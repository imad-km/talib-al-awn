import hashlib
import hmac
import json
import requests

from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from config import CHARGILY_API_KEY, CHARGILY_BASE_URL, APP_BASE_URL
from database import db_query
from utils.helpers import ok, err
from utils.security import rate_limit, sanitize_json, validate_int_id

payments_bp = Blueprint('payments', __name__)

FEE_RATE = 0.02


def _chargily_headers():
    return {
        'Authorization': f'Bearer {CHARGILY_API_KEY}',
        'Content-Type': 'application/json',
    }


@payments_bp.route('/api/deals/<int:cid>/checkout', methods=['POST'])
@jwt_required()
@rate_limit('default')
def create_checkout(cid):
    if not validate_int_id(cid): return err('معرف غير صالح', 400)

    uid  = int(get_jwt_identity())
    data = sanitize_json(request.get_json(silent=True) or {})

    amount = data.get('amount')
    if amount is None:
        return err('المبلغ مطلوب', 400)
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except (TypeError, ValueError):
        return err('المبلغ غير صالح', 400)

    fee   = round(amount * FEE_RATE, 2)
    total = round(amount + fee, 2)

    deal = db_query(
        "SELECT * FROM deals WHERE conversation_id=%s AND status='deposit_pending'",
        (cid,), fetchone=True
    )
    if not deal:
        return err('لا توجد صفقة في انتظار الدفع')
    if uid != deal['employer_id']:
        return err('فقط صاحب العمل يمكنه الدفع', 403)

    if deal['deposit_deadline']:
        dl = deal['deposit_deadline']
        if isinstance(dl, datetime) and datetime.utcnow() > dl:
            db_query('UPDATE deals SET status=%s WHERE id=%s', ('cancelled', deal['id']), commit=True)
            return err('انتهت مهلة الدفع. تم إلغاء الصفقة تلقائياً')

    payload = {
        'amount':      int(total),
        'currency':    'dzd',
        'description': f'رسوم منصة طالب عون — صفقة #{deal["id"]}',
        'success_url': f'{APP_BASE_URL}/api/payments/success?deal_id={deal["id"]}',
        'failure_url': f'{APP_BASE_URL}/api/payments/failure?deal_id={deal["id"]}',
        'metadata':    {'deal_id': deal['id'], 'conversation_id': cid, 'employer_id': uid},
    }

    try:
        resp = requests.post(
            f'{CHARGILY_BASE_URL}/checkouts',
            json=payload,
            headers=_chargily_headers(),
            timeout=10
        )
        resp.raise_for_status()
        resp_data = resp.json()
    except requests.RequestException as e:
        return err(f'خطأ في بوابة الدفع: {str(e)}', 502)

    checkout_url = resp_data.get('checkout_url')
    checkout_id  = resp_data.get('id')

    db_query(
        'UPDATE deals SET chargily_checkout_id=%s, updated_at=NOW() WHERE id=%s',
        (checkout_id, deal['id']), commit=True
    )

    return ok({
        'checkout_url': checkout_url,
        'checkout_id':  checkout_id,
        'amount':       amount,
        'fee':          fee,
        'total':        total,
    })


@payments_bp.route('/api/payments/success', methods=['GET'])
def payment_success():
    deal_id = request.args.get('deal_id')
    if not deal_id:
        return err('معرف الصفقة مفقود', 400)

    deal = db_query("SELECT * FROM deals WHERE id=%s AND status='deposit_pending'", (deal_id,), fetchone=True)
    if deal:
        db_query(
            "UPDATE deals SET status='secured', updated_at=NOW() WHERE id=%s",
            (deal_id,), commit=True
        )

    return ok({'status': 'secured', 'message': 'تم الدفع بنجاح — الأموال مؤمّنة'})


@payments_bp.route('/api/payments/failure', methods=['GET'])
def payment_failure():
    deal_id = request.args.get('deal_id')
    return err(f'فشل الدفع للصفقة #{deal_id}. يرجى المحاولة مجدداً.', 402)


@payments_bp.route('/api/payments/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('signature', '')
    payload   = request.get_data()

    expected = hmac.new(
        CHARGILY_API_KEY.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        return err('توقيع غير صالح', 403)

    try:
        data = json.loads(payload)
    except (ValueError, KeyError):
        return err('بيانات غير صالحة', 400)

    event_type = data.get('type')
    metadata   = data.get('data', {}).get('metadata', {})
    deal_id    = metadata.get('deal_id')

    if not deal_id:
        return ok({'received': True})

    if event_type == 'checkout.paid':
        db_query(
            "UPDATE deals SET status='secured', updated_at=NOW() WHERE id=%s AND status='deposit_pending'",
            (deal_id,), commit=True
        )
    elif event_type == 'checkout.failed':
        db_query(
            "UPDATE deals SET status='deposit_pending', updated_at=NOW() WHERE id=%s",
            (deal_id,), commit=True
        )

    return ok({'received': True})
