from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db_query, db_insert
from utils.helpers import ok, err, row_to_dict, rows_to_list
from utils.security import rate_limit, sanitize_json, sanitize_str, validate_int_id

users_bp = Blueprint('users', __name__)


@users_bp.route('/api/users/search', methods=['GET'])
@jwt_required()
@rate_limit('default')
def search_users():
    q    = sanitize_str(request.args.get('q', ''), 100).strip()
    role = sanitize_str(request.args.get('role', ''), 20)
    if not q: return err('معامل البحث q مطلوب')

    sql  = (
        'SELECT u.id, u.name, u.role, u.grade, u.wilaya, u.avatar_url, '
        'COALESCE(ROUND(AVG(r.score),1),0) AS rating, '
        'COUNT(r.id) AS rating_count '
        'FROM users u '
        'LEFT JOIN ratings r ON r.rated_id=u.id '
        'WHERE u.name LIKE %s AND u.verified=1'
    )
    args = [f'%{q}%']
    if role in ('student', 'employer', 'admin'):
        sql += ' AND u.role=%s'
        args.append(role)
    sql += ' GROUP BY u.id ORDER BY u.name LIMIT 30'
    rows = db_query(sql, args, fetchall=True)
    return ok(rows_to_list(rows))


@users_bp.route('/api/users/<int:user_id>', methods=['GET'])
@rate_limit('default')
def get_user_profile(user_id):
    if not validate_int_id(user_id): return err('معرف غير صالح', 400)
    user = db_query(
        'SELECT u.id, u.name, u.role, u.grade, u.wilaya, u.university, u.speciality, u.bio, u.skills, u.avatar_url, u.created_at, '
        '  COALESCE(ROUND(AVG(r.score),1),0) AS rating, '
        '  COUNT(r.id) AS rating_count '
        'FROM users u LEFT JOIN ratings r ON r.rated_id=u.id '
        'WHERE u.id=%s GROUP BY u.id',
        (user_id,), fetchone=True
    )
    if not user: return err('المستخدم غير موجود', 404)
    return ok(row_to_dict(user))


@users_bp.route('/api/stats', methods=['GET'])
@rate_limit('default')
def public_stats():
    users = db_query("SELECT COUNT(*) AS c FROM users WHERE verified=1", fetchone=True)['c']
    jobs  = db_query("SELECT COUNT(*) AS c FROM jobs WHERE status='open'", fetchone=True)['c']
    deals = db_query("SELECT COUNT(*) AS c FROM deals WHERE status IN ('secured','completed')", fetchone=True)['c']
    return ok({'users': users, 'open_jobs': jobs, 'completed_deals': deals})


@users_bp.route('/api/demands', methods=['GET'])
@rate_limit('default')
def list_demands():
    wilaya   = sanitize_str(request.args.get('wilaya', ''), 100)
    category = sanitize_str(request.args.get('category', ''), 100)
    search   = sanitize_str(request.args.get('q', ''), 100)
    sql  = (
        'SELECT d.*, u.name AS student_name, u.avatar_url AS student_avatar, '
        '  u.university, u.speciality, u.grade '
        'FROM demands d JOIN users u ON d.student_id=u.id '
        "WHERE d.status='open' AND u.verified=1"
    )
    args = []
    if wilaya:   sql += ' AND d.wilaya=%s';                                args.append(wilaya)
    if category: sql += ' AND d.category=%s';                              args.append(category)
    if search:   sql += ' AND (d.title LIKE %s OR d.skills LIKE %s)';     args += [f'%{search}%', f'%{search}%']
    sql += ' ORDER BY d.created_at DESC LIMIT 50'
    rows = db_query(sql, args, fetchall=True)
    return ok(rows_to_list(rows))


@users_bp.route('/api/demands', methods=['POST'])
@jwt_required()
@rate_limit('default')
def create_demand():
    uid  = int(get_jwt_identity())
    user = db_query('SELECT role FROM users WHERE id=%s', (uid,), fetchone=True)
    if not user: return err('المستخدم غير موجود', 404)
    if user['role'] == 'employer':
        return err('أصحاب العمل لا يمكنهم نشر طلبات عمل', 403)

    data  = sanitize_json(request.get_json(silent=True) or {})
    title = sanitize_str(data.get('title', ''), 255).strip()
    if not title: return err('عنوان الطلب مطلوب')

    row = db_insert(
        'INSERT INTO demands (student_id, title, description, category, wilaya, '
        'available_hours, expected_salary, skills) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)',
        (uid, title,
         sanitize_str(data.get('description', ''), 2000),
         sanitize_str(data.get('category', ''), 100),
         sanitize_str(data.get('wilaya', ''), 100),
         sanitize_str(data.get('available_hours', ''), 50),
         data.get('expected_salary'),
         sanitize_str(data.get('skills', ''), 500)),
        'demands'
    )
    return ok(row_to_dict(row)), 201


@users_bp.route('/api/demands/<int:did>', methods=['GET'])
@rate_limit('default')
def get_demand(did):
    if not validate_int_id(did): return err('معرف غير صالح', 400)
    row = db_query(
        'SELECT d.*, u.name AS student_name, u.avatar_url AS student_avatar, '
        '  u.university, u.speciality, u.grade, u.wilaya AS student_wilaya, '
        '  COALESCE(ROUND(AVG(r.score),1),0) AS student_rating, '
        '  COUNT(r.id) AS student_rating_count '
        'FROM demands d '
        'JOIN users u ON d.student_id=u.id '
        'LEFT JOIN ratings r ON r.rated_id=u.id '
        'WHERE d.id=%s GROUP BY d.id, u.id',
        (did,), fetchone=True
    )
    if not row: return err('الطلب غير موجود', 404)
    return ok(row_to_dict(row))


@users_bp.route('/api/demands/<int:did>', methods=['PUT'])
@jwt_required()
@rate_limit('default')
def update_demand(did):
    if not validate_int_id(did): return err('معرف غير صالح', 400)
    uid    = int(get_jwt_identity())
    demand = db_query('SELECT id, student_id FROM demands WHERE id=%s', (did,), fetchone=True)
    if not demand: return err('الطلب غير موجود', 404)
    if demand['student_id'] != uid: return err('غير مصرح', 403)

    data    = sanitize_json(request.get_json(silent=True) or {})
    allowed = ['title','description','category','wilaya','available_hours','expected_salary','skills','status']
    sets    = ', '.join(f"{k}=%s" for k in allowed if k in data)
    vals    = [data[k] for k in allowed if k in data] + [did]
    if not sets: return err('لا توجد بيانات للتحديث')
    db_query(f'UPDATE demands SET {sets} WHERE id=%s', vals, commit=True)
    return ok({'message': 'تم تحديث الطلب'})


@users_bp.route('/api/demands/<int:did>', methods=['DELETE'])
@jwt_required()
@rate_limit('default')
def delete_demand(did):
    if not validate_int_id(did): return err('معرف غير صالح', 400)
    uid    = int(get_jwt_identity())
    demand = db_query('SELECT id, student_id FROM demands WHERE id=%s', (did,), fetchone=True)
    if not demand: return err('الطلب غير موجود', 404)
    if demand['student_id'] != uid: return err('غير مصرح', 403)
    db_query("UPDATE demands SET status='closed' WHERE id=%s", (did,), commit=True)
    return ok({'message': 'تم إغلاق الطلب'})


@users_bp.route('/api/demands/mine', methods=['GET'])
@jwt_required()
@rate_limit('default')
def my_demands():
    uid  = int(get_jwt_identity())
    rows = db_query(
        'SELECT * FROM demands WHERE student_id=%s ORDER BY created_at DESC',
        (uid,), fetchall=True
    )
    return ok(rows_to_list(rows))
