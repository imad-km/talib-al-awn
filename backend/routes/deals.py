from datetime import datetime, timedelta

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db_query, db_insert
from utils.helpers import ok, err, row_to_dict, rows_to_list

deals_bp = Blueprint('deals', __name__)


def calc_fee(daily, months):
    if daily < 1000:
        fee_per_month = 150
    else:
        fee_per_month = round(daily * 0.30, 2)
    return fee_per_month, fee_per_month * months


@deals_bp.route('/api/deals/<int:cid>', methods=['GET'])
@jwt_required()
def get_deal(cid):
    deal = db_query('SELECT * FROM deals WHERE conversation_id=%s ORDER BY id DESC LIMIT 1', (cid,), fetchone=True)
    if not deal: return ok(None)
    d = row_to_dict(deal)
    fpm, total_fee = calc_fee(float(d.get('daily_salary', 1000)), d.get('duration_months', 1))
    d['fee_per_month'] = fpm
    d['total_fee']     = total_fee
    return ok(d)


@deals_bp.route('/api/deals/<int:cid>/start', methods=['POST'])
@jwt_required()
def start_deal(cid):
    uid      = int(get_jwt_identity())
    existing = db_query("SELECT id, status FROM deals WHERE conversation_id=%s AND status!='cancelled'", (cid,), fetchone=True)
    if existing: return err('هناك صفقة نشطة بالفعل')

    conv = db_query('SELECT id FROM conversations WHERE id=%s AND employer_id=%s', (cid, uid), fetchone=True)
    if not conv: return err('غير مصرح', 403)

    row = db_insert(
        'INSERT INTO deals (conversation_id, employer_id, status) VALUES (%s,%s,%s)',
        (cid, uid, 'employer_started'),
        'deals'
    )
    return ok(row_to_dict(row))


@deals_bp.route('/api/deals/<int:cid>/accept', methods=['POST'])
@jwt_required()
def accept_deal(cid):
    uid  = int(get_jwt_identity())
    deal = db_query("SELECT * FROM deals WHERE conversation_id=%s AND status='employer_started'", (cid,), fetchone=True)
    if not deal: return err('لا توجد صفقة في انتظار القبول')
    conv = db_query('SELECT * FROM conversations WHERE id=%s AND student_id=%s', (cid, uid), fetchone=True)
    if not conv: return err('غير مصرح', 403)
    db_query(
        'UPDATE deals SET status=%s, student_id=%s, updated_at=NOW() WHERE id=%s',
        ('form', uid, deal['id']), commit=True
    )
    return ok({'message': 'تم قبول الصفقة'})


@deals_bp.route('/api/deals/<int:cid>/form', methods=['PUT'])
@jwt_required()
def update_deal_form(cid):
    data = request.json or {}
    deal = db_query("SELECT * FROM deals WHERE conversation_id=%s AND status='form'", (cid,), fetchone=True)
    if not deal: return err('لا يمكن تعديل النموذج الآن')
    allowed = ['daily_salary','duration_months','start_date','payment_date','instructions']
    sets = ', '.join(f"{k}=%s" for k in allowed if k in data) + ', updated_at=NOW()'
    vals = [data[k] for k in allowed if k in data] + [deal['id']]
    db_query(f'UPDATE deals SET {sets} WHERE id=%s', vals, commit=True)
    return ok({'message': 'تم تحديث نموذج الاتفاقية'})


@deals_bp.route('/api/deals/<int:cid>/confirm', methods=['POST'])
@jwt_required()
def confirm_deal(cid):
    uid  = int(get_jwt_identity())
    deal = db_query("SELECT * FROM deals WHERE conversation_id=%s AND status='form'", (cid,), fetchone=True)
    if not deal: return err('لا توجد اتفاقية في مرحلة التأكيد')

    is_employer = (uid == deal['employer_id'])
    is_student  = (uid == deal['student_id'])
    if not is_employer and not is_student: return err('غير مصرح', 403)

    emp_conf = deal['employer_confirmed'] or is_employer
    stu_conf = deal['student_confirmed']  or is_student

    if emp_conf and stu_conf:
        deadline = datetime.utcnow() + timedelta(hours=24)
        db_query(
            'UPDATE deals SET employer_confirmed=1, student_confirmed=1, status=%s, deposit_deadline=%s, updated_at=NOW() WHERE id=%s',
            ('deposit_pending', deadline, deal['id']), commit=True
        )
        daily   = float(deal['daily_salary'])
        months  = deal['duration_months']
        monthly = round(daily * 30, 2)
        fpm, _  = calc_fee(daily, months)
        for m in range(1, months + 1):
            db_query('INSERT INTO payments (deal_id, month_number, amount, fee, status) VALUES (%s,%s,%s,%s,%s)',
                     (deal['id'], m, monthly, fpm, 'pending'), commit=True)
        return ok({'status': 'deposit_pending', 'deadline': deadline.isoformat()})
    else:
        field = 'employer_confirmed' if is_employer else 'student_confirmed'
        db_query(f'UPDATE deals SET {field}=1, updated_at=NOW() WHERE id=%s', (deal['id'],), commit=True)
        return ok({'status': 'waiting_other'})


@deals_bp.route('/api/deals/<int:cid>/deposit', methods=['POST'])
@jwt_required()
def deposit_deal(cid):
    uid  = int(get_jwt_identity())
    deal = db_query("SELECT * FROM deals WHERE conversation_id=%s AND status='deposit_pending'", (cid,), fetchone=True)
    if not deal: return err('لا توجد صفقة في انتظار الإيداع')
    if uid != deal['employer_id']: return err('فقط صاحب العمل يمكنه الإيداع', 403)

    if deal['deposit_deadline']:
        dl = deal['deposit_deadline']
        if isinstance(dl, datetime) and datetime.utcnow() > dl:
            db_query('UPDATE deals SET status=%s WHERE id=%s', ('cancelled', deal['id']), commit=True)
            return err('انتهت مهلة الإيداع. تم إلغاء الصفقة تلقائياً')

    db_query('UPDATE deals SET status=%s, updated_at=NOW() WHERE id=%s', ('secured', deal['id']), commit=True)
    return ok({'status': 'secured', 'message': 'تم الإيداع — الأموال مؤمّنة'})


@deals_bp.route('/api/deals/<int:cid>/payments', methods=['GET'])
@jwt_required()
def deal_payments(cid):
    deal = db_query('SELECT id FROM deals WHERE conversation_id=%s ORDER BY id DESC LIMIT 1', (cid,), fetchone=True)
    if not deal: return ok([])
    rows = db_query('SELECT * FROM payments WHERE deal_id=%s ORDER BY month_number', (deal['id'],), fetchall=True)
    return ok(rows_to_list(rows))


@deals_bp.route('/api/deals/<int:cid>/cancel', methods=['POST'])
@jwt_required()
def cancel_deal(cid):
    deal = db_query('SELECT id FROM deals WHERE conversation_id=%s', (cid,), fetchone=True)
    if deal:
        db_query('UPDATE deals SET status=%s WHERE id=%s', ('cancelled', deal['id']), commit=True)
    return ok({'message': 'تم إلغاء الصفقة'})
