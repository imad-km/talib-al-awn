import time
from datetime import datetime, timedelta

from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)

from database import db_query
from config import OTP_EXPIRY_SEC, PLATFORM_NAME
from utils.helpers import ok, err, otp_code, hash_pw, check_pw, row_to_dict
from utils.email import send_email, otp_html

auth_bp = Blueprint('auth', __name__)

_pending_registrations = {}
_pending_resets        = {}
_pending_login_otps    = {}


@auth_bp.route('/api/auth/register/send-otp', methods=['POST'])
def send_otp():
    data  = request.json or {}
    email = (data.get('email') or '').strip().lower()
    pw    = data.get('password', '')
    name  = data.get('name', '')
    role  = data.get('role', 'student')
    phone = data.get('phone', '')

    if not email or not pw:
        return err('البريد الإلكتروني وكلمة المرور مطلوبان')
    if len(pw) < 6:
        return err('كلمة المرور قصيرة جداً (6 أحرف على الأقل)')

    existing = db_query('SELECT id, verified FROM users WHERE email=%s', (email,), fetchone=True)
    if existing and existing['verified']:
        return err('البريد الإلكتروني مسجّل بالفعل')

    code    = otp_code()
    expires = datetime.utcnow() + timedelta(seconds=OTP_EXPIRY_SEC)

    if existing:
        db_query('UPDATE users SET otp=%s, otp_expires=%s, name=%s, phone=%s, password_hash=%s WHERE email=%s',
                 (code, expires, name, phone, hash_pw(pw), email), commit=True)
    else:
        db_query(
            'INSERT INTO users (email, password_hash, name, role, phone, otp, otp_expires) '
            'VALUES (%s,%s,%s,%s,%s,%s,%s)',
            (email, hash_pw(pw), name, role, phone, code, expires), commit=True
        )

    send_email(email, f'{code} هو رمز التحقق الخاص بك — {PLATFORM_NAME}', otp_html(code),
               plain_text=f'رمز التحقق الخاص بك هو: {code}\nينتهي خلال دقيقتين.\nلا تشارك هذا الرمز مع أي شخص.')
    print(f'[OTP] {email} → {code}')
    return ok({'message': 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'})


@auth_bp.route('/api/auth/register/verify-otp', methods=['POST'])
def verify_otp():
    data  = request.json or {}
    email = (data.get('email') or '').strip().lower()
    code  = str(data.get('otp', '')).strip()

    user = db_query('SELECT * FROM users WHERE email=%s', (email,), fetchone=True)
    if not user:
        return err('المستخدم غير موجود')
    if user['otp'] != code:
        return err('رمز التحقق غير صحيح')
    otp_exp = user['otp_expires']
    if otp_exp and datetime.utcnow() > (otp_exp if isinstance(otp_exp, datetime) else otp_exp):
        return err('انتهت صلاحية رمز التحقق')

    db_query('UPDATE users SET verified=1, otp=NULL, otp_expires=NULL WHERE id=%s',
             (user['id'],), commit=True)

    identity   = str(user['id'])
    access_tk  = create_access_token(identity=identity)
    refresh_tk = create_refresh_token(identity=identity)
    db_query('UPDATE users SET refresh_token=%s WHERE id=%s', (refresh_tk, user['id']), commit=True)

    u = row_to_dict(user)
    u.pop('password_hash', None); u.pop('otp', None); u.pop('refresh_token', None)
    return ok({'access_token': access_tk, 'refresh_token': refresh_tk, 'user': u})


@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data  = request.json or {}
    email = (data.get('email') or '').strip().lower()
    pw    = data.get('password', '')

    user = db_query('SELECT * FROM users WHERE email=%s', (email,), fetchone=True)
    if not user or not check_pw(pw, user['password_hash']):
        return err('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    if not user['verified']:
        return err('يرجى التحقق من بريدك الإلكتروني أولاً')
    if user.get('is_banned'):
        return ({'ok': False, 'banned': True, 'reason': user.get('ban_reason', '')}), 403

    identity   = str(user['id'])
    access_tk  = create_access_token(identity=identity)
    refresh_tk = create_refresh_token(identity=identity)
    db_query('UPDATE users SET refresh_token=%s WHERE id=%s', (refresh_tk, user['id']), commit=True)

    u = row_to_dict(user)
    u.pop('password_hash', None); u.pop('otp', None); u.pop('refresh_token', None)
    return ok({'access_token': access_tk, 'refresh_token': refresh_tk, 'user': u})


@auth_bp.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    uid = get_jwt_identity()
    access_tk = create_access_token(identity=uid)
    return ok({'access_token': access_tk})


@auth_bp.route('/api/auth/me', methods=['GET'])
@jwt_required()
def me():
    uid  = int(get_jwt_identity())
    user = db_query('SELECT * FROM users WHERE id=%s', (uid,), fetchone=True)
    if not user: return err('المستخدم غير موجود', 404)
    u = row_to_dict(user)
    u.pop('password_hash', None); u.pop('otp', None); u.pop('refresh_token', None)
    return ok(u)


@auth_bp.route('/api/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    uid  = int(get_jwt_identity())
    data = request.json or {}
    allowed = ['name','phone','grade','wilaya','university','speciality','bio','skills','avatar_url']
    sets = ', '.join(f"{k}=%s" for k in allowed if k in data)
    vals = [data[k] for k in allowed if k in data] + [uid]
    if not sets: return err('لا توجد بيانات للتحديث')
    db_query(f'UPDATE users SET {sets} WHERE id=%s', vals, commit=True)
    return ok({'message': 'تم تحديث الملف الشخصي'})


@auth_bp.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data  = request.json or {}
    email = (data.get('email') or '').strip().lower()
    if not email:
        return err('البريد الإلكتروني مطلوب')

    user = db_query('SELECT id, verified FROM users WHERE email=%s', (email,), fetchone=True)
    if user and user['verified']:
        code = otp_code()
        _pending_resets[email] = {'otp': code, 'sent_at': time.time(), 'verified': False}
        send_email(email, f'{code} هو رمز إعادة التعيين — {PLATFORM_NAME}',
                   otp_html(code, is_reset=True),
                   plain_text=f'رمز إعادة تعيين كلمة المرور: {code}\nينتهي خلال دقيقتين.\nلا تشارك هذا الرمز مع أي شخص.')
        print(f'[RESET OTP] {email} → {code}')

    return ok({'message': 'إذا كان البريد الإلكتروني مسجّلاً، سيصلك رمز إعادة التعيين'})


@auth_bp.route('/api/auth/verify-reset-otp', methods=['POST'])
def verify_reset_otp():
    data  = request.json or {}
    email = (data.get('email') or '').strip().lower()
    code  = str(data.get('otp', '')).strip()

    if not email or not code:
        return err('البريد الإلكتروني والرمز مطلوبان')

    pending = _pending_resets.get(email)
    if not pending:
        return err('لا يوجد طلب إعادة تعيين لهذا البريد')
    if time.time() - pending['sent_at'] > OTP_EXPIRY_SEC:
        _pending_resets.pop(email, None)
        return err('انتهت صلاحية الرمز، يرجى الطلب مجدداً')
    if code != pending['otp']:
        return err('رمز غير صحيح')

    _pending_resets[email]['verified'] = True
    return ok({'message': 'تم التحقق من الرمز بنجاح'})


@auth_bp.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data   = request.json or {}
    email  = (data.get('email') or '').strip().lower()
    new_pw = data.get('new_password', '')

    if not email or not new_pw:
        return err('البريد الإلكتروني وكلمة المرور الجديدة مطلوبان')
    if len(new_pw) < 6:
        return err('كلمة المرور قصيرة جداً (6 أحرف على الأقل)')

    pending = _pending_resets.get(email)
    if not pending or not pending.get('verified'):
        return err('يرجى التحقق من رمز OTP أولاً')

    db_query('UPDATE users SET password_hash=%s WHERE email=%s', (hash_pw(new_pw), email), commit=True)
    _pending_resets.pop(email, None)
    return ok({'message': 'تم تغيير كلمة المرور بنجاح'})


@auth_bp.route('/api/auth/login/send-otp', methods=['POST'])
def login_send_otp():
    data    = request.json or {}
    contact = (data.get('contact') or '').strip().lower()
    ch_type = (data.get('type') or 'email').strip().lower()

    if not contact:
        return err('يرجى إدخال البريد الإلكتروني')
    if ch_type != 'email':
        return err('الدخول برمز OTP متاح عبر البريد الإلكتروني فقط حالياً')

    row = db_query('SELECT id FROM users WHERE email=%s AND verified=1 AND is_banned=0',
                   (contact,), fetchone=True)
    if not row:
        return ok({'message': 'إذا كان البريد مسجّلاً وموثّقاً، سيصلك رمز الدخول'})

    code = otp_code()
    _pending_login_otps[contact] = {'otp': code, 'sent_at': time.time()}
    send_email(contact, f'{code} هو رمز الدخول — {PLATFORM_NAME}', otp_html(code),
               plain_text=f'رمز الدخول الخاص بك هو: {code}\nينتهي خلال دقيقتين.\nلا تشارك هذا الرمز مع أي شخص.')
    print(f'[LOGIN OTP] {contact} → {code}')
    return ok({'message': 'إذا كان البريد مسجّلاً وموثّقاً، سيصلك رمز الدخول'})


@auth_bp.route('/api/auth/login/verify-otp', methods=['POST'])
def login_verify_otp():
    data    = request.json or {}
    contact = (data.get('contact') or '').strip().lower()
    code    = (data.get('otp') or '').strip()

    if not contact or not code:
        return err('البريد والرمز مطلوبان')

    pending = _pending_login_otps.get(contact)
    if not pending:
        return err('لا يوجد طلب دخول لهذا البريد')
    if time.time() - pending['sent_at'] > OTP_EXPIRY_SEC:
        _pending_login_otps.pop(contact, None)
        return err('انتهت صلاحية الرمز، يرجى طلب رمز جديد')
    if code != pending['otp']:
        return err('الرمز غير صحيح')

    _pending_login_otps.pop(contact, None)

    row = db_query(
        'SELECT id, email, name, role, grade, phone, verified FROM users WHERE email=%s AND is_banned=0',
        (contact,), fetchone=True
    )
    if not row:
        return err('الحساب غير موجود أو محظور')

    user          = {k: row[k] for k in ['id','email','name','role','grade','phone','verified'] if k in row}
    access_token  = create_access_token(identity=str(user['id']))
    refresh_token = create_refresh_token(identity=str(user['id']))
    return ok({'access_token': access_token, 'refresh_token': refresh_token, 'user': user})
