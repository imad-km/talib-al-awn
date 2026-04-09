from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db_query
from config import PLATFORM_NAME
from utils.helpers import ok, err, rows_to_list
from utils.email import send_email, invite_html

admin_bp = Blueprint('admin', __name__)


def _require_admin(uid):
    user = db_query('SELECT * FROM users WHERE id=%s', (uid,), fetchone=True)
    if user and user.get('role') == 'admin':
        return user
    return None


@admin_bp.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def admin_stats():
    uid = int(get_jwt_identity())
    if not _require_admin(uid): return err('غير مصرح', 403)
    users_count   = db_query('SELECT COUNT(*) AS c FROM users', fetchone=True)['c']
    jobs_count    = db_query('SELECT COUNT(*) AS c FROM jobs', fetchone=True)['c']
    deals_count   = db_query('SELECT COUNT(*) AS c FROM deals', fetchone=True)['c']
    ratings_count = db_query('SELECT COUNT(*) AS c FROM ratings', fetchone=True)['c']
    return ok({'users': users_count, 'jobs': jobs_count, 'deals': deals_count, 'ratings': ratings_count})


@admin_bp.route('/api/admin/users', methods=['GET'])
@jwt_required()
def admin_users():
    uid = int(get_jwt_identity())
    if not _require_admin(uid): return err('غير مصرح', 403)
    rows = db_query(
        'SELECT id, email, name, role, verified, is_banned, ban_reason, created_at '
        'FROM users ORDER BY created_at DESC',
        fetchall=True
    )
    return ok(rows_to_list(rows))


@admin_bp.route('/api/admin/ban', methods=['POST'])
@jwt_required()
def admin_ban():
    uid = int(get_jwt_identity())
    if not _require_admin(uid): return err('غير مصرح', 403)

    data      = request.json or {}
    target_id = data.get('user_id')
    reason    = (data.get('reason') or '').strip()

    if not target_id: return err('user_id مطلوب')
    if not reason:    return err('سبب الحظر مطلوب')

    target = db_query('SELECT id, role, is_banned FROM users WHERE id=%s', (target_id,), fetchone=True)
    if not target:                return err('المستخدم غير موجود', 404)
    if target['role'] == 'admin': return err('لا يمكن حظر مسؤول')
    if target['is_banned']:       return err('المستخدم محظور بالفعل')

    db_query('UPDATE users SET is_banned=1, ban_reason=%s WHERE id=%s', (reason, target_id), commit=True)
    return ok({'message': 'تم حظر المستخدم'})


@admin_bp.route('/api/admin/unban', methods=['POST'])
@jwt_required()
def admin_unban():
    uid = int(get_jwt_identity())
    if not _require_admin(uid): return err('غير مصرح', 403)

    data      = request.json or {}
    target_id = data.get('user_id')
    if not target_id: return err('user_id مطلوب')

    target = db_query('SELECT id, is_banned FROM users WHERE id=%s', (target_id,), fetchone=True)
    if not target:              return err('المستخدم غير موجود', 404)
    if not target['is_banned']: return err('المستخدم غير محظور')

    db_query('UPDATE users SET is_banned=0, ban_reason=NULL WHERE id=%s', (target_id,), commit=True)
    return ok({'message': 'تم رفع الحظر عن المستخدم'})


@admin_bp.route('/api/admin/invite', methods=['POST'])
@jwt_required()
def admin_invite():
    uid = int(get_jwt_identity())
    if not _require_admin(uid): return err('غير مصرح', 403)

    data     = request.json or {}
    to_email = (data.get('email') or '').strip()
    to_name  = data.get('name', '')

    if not to_email: return err('البريد الإلكتروني مطلوب')

    send_email(to_email, f'دعوة للانضمام إلى {PLATFORM_NAME}', invite_html(to_name))
    return ok({'message': f'تم إرسال الدعوة إلى {to_email}'})
