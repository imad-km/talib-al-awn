import pymysql.err
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db_query, db_insert
from utils.helpers import ok, err, row_to_dict, rows_to_list

jobs_bp = Blueprint('jobs', __name__)


@jobs_bp.route('/api/jobs', methods=['GET'])
def list_jobs():
    wilaya   = request.args.get('wilaya')
    category = request.args.get('category')
    search   = request.args.get('q')
    sql  = 'SELECT j.*, u.name AS employer_name FROM jobs j JOIN users u ON j.employer_id=u.id WHERE j.status=%s'
    args = ['open']
    if wilaya:   sql += ' AND j.wilaya=%s';     args.append(wilaya)
    if category: sql += ' AND j.category=%s';   args.append(category)
    if search:   sql += ' AND j.title LIKE %s'; args.append(f'%{search}%')
    sql += ' ORDER BY j.created_at DESC LIMIT 50'
    rows = db_query(sql, args, fetchall=True)
    return ok(rows_to_list(rows))


@jobs_bp.route('/api/jobs', methods=['POST'])
@jwt_required()
def create_job():
    uid  = int(get_jwt_identity())
    data = request.json or {}
    row  = db_insert(
        'INSERT INTO jobs (employer_id,title,description,category,wilaya,work_type,daily_salary,required_skills) '
        'VALUES (%s,%s,%s,%s,%s,%s,%s,%s)',
        (uid, data.get('title'), data.get('description'), data.get('category'),
         data.get('wilaya'), data.get('work_type', 'partial'),
         data.get('daily_salary', 0), data.get('required_skills', '')),
        'jobs'
    )
    return ok(row_to_dict(row)), 201


@jobs_bp.route('/api/jobs/<int:jid>', methods=['GET'])
def get_job(jid):
    row = db_query(
        'SELECT j.*, u.name AS employer_name, u.wilaya AS employer_wilaya, '
        '  COALESCE(ROUND(AVG(r.score),1),0) AS employer_rating, '
        '  COUNT(r.id) AS employer_rating_count '
        'FROM jobs j JOIN users u ON j.employer_id=u.id '
        'LEFT JOIN ratings r ON r.rated_id=u.id '
        'WHERE j.id=%s GROUP BY j.id, u.name, u.wilaya',
        (jid,), fetchone=True
    )
    if not row: return err('الوظيفة غير موجودة', 404)
    return ok(row_to_dict(row))


@jobs_bp.route('/api/jobs/<int:jid>', methods=['PUT'])
@jwt_required()
def update_job(jid):
    uid  = int(get_jwt_identity())
    data = request.json or {}
    allowed = ['title','description','category','wilaya','work_type','daily_salary','required_skills','status']
    sets = ', '.join(f"{k}=%s" for k in allowed if k in data)
    vals = [data[k] for k in allowed if k in data] + [jid, uid]
    if not sets: return err('لا توجد بيانات للتحديث')
    db_query(f'UPDATE jobs SET {sets} WHERE id=%s AND employer_id=%s', vals, commit=True)
    return ok({'message': 'تم تحديث الوظيفة'})


@jobs_bp.route('/api/jobs/<int:jid>', methods=['DELETE'])
@jwt_required()
def delete_job(jid):
    uid = int(get_jwt_identity())
    db_query('UPDATE jobs SET status=%s WHERE id=%s AND employer_id=%s', ('deleted', jid, uid), commit=True)
    return ok({'message': 'تم حذف الوظيفة'})


@jobs_bp.route('/api/applications', methods=['GET'])
@jwt_required()
def list_applications():
    uid  = int(get_jwt_identity())
    user = db_query('SELECT role FROM users WHERE id=%s', (uid,), fetchone=True)
    if user['role'] == 'employer':
        rows = db_query(
            'SELECT a.*, u.name AS student_name, j.title AS job_title FROM applications a '
            'JOIN users u ON a.student_id=u.id JOIN jobs j ON a.job_id=j.id '
            'WHERE j.employer_id=%s ORDER BY a.created_at DESC',
            (uid,), fetchall=True
        )
    else:
        rows = db_query(
            'SELECT a.*, j.title AS job_title, u.name AS employer_name FROM applications a '
            'JOIN jobs j ON a.job_id=j.id JOIN users u ON j.employer_id=u.id '
            'WHERE a.student_id=%s ORDER BY a.created_at DESC',
            (uid,), fetchall=True
        )
    return ok(rows_to_list(rows))


@jobs_bp.route('/api/applications', methods=['POST'])
@jwt_required()
def apply_job():
    uid  = int(get_jwt_identity())
    data = request.json or {}
    jid  = data.get('job_id')
    if not jid: return err('معرف الوظيفة مطلوب')
    try:
        row = db_insert(
            'INSERT INTO applications (job_id, student_id, cover_letter) VALUES (%s,%s,%s)',
            (jid, uid, data.get('cover_letter', '')),
            'applications'
        )
        return ok(row_to_dict(row)), 201
    except pymysql.err.IntegrityError:
        return err('لقد تقدمت لهذه الوظيفة مسبقاً')


@jobs_bp.route('/api/applications/<int:aid>', methods=['PUT'])
@jwt_required()
def update_application(aid):
    data   = request.json or {}
    status = data.get('status')
    if status not in ('pending', 'accepted', 'rejected'):
        return err('حالة غير صالحة')
    db_query('UPDATE applications SET status=%s WHERE id=%s', (status, aid), commit=True)
    return ok({'message': 'تم تحديث حالة الطلب'})
