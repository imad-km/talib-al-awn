from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db_query, db_insert
from utils.helpers import ok, err, row_to_dict, rows_to_list
from utils.security import rate_limit, sanitize_json, sanitize_str, validate_int_id

conversations_bp = Blueprint('conversations', __name__)


@conversations_bp.route('/api/conversations', methods=['GET'])
@jwt_required()
@rate_limit('default')
def list_convs():
    uid  = int(get_jwt_identity())
    rows = db_query(
        'SELECT c.*, '
        '  e.name AS employer_name, s.name AS student_name, j.title AS job_title, '
        '  (SELECT content FROM messages WHERE conversation_id=c.id ORDER BY created_at DESC LIMIT 1) AS last_msg '
        'FROM conversations c '
        'JOIN users e ON c.employer_id=e.id '
        'JOIN users s ON c.student_id=s.id '
        'LEFT JOIN jobs j ON c.job_id=j.id '
        'WHERE c.employer_id=%s OR c.student_id=%s '
        'ORDER BY c.created_at DESC',
        (uid, uid), fetchall=True
    )
    return ok(rows_to_list(rows))


@conversations_bp.route('/api/conversations', methods=['POST'])
@jwt_required()
@rate_limit('default')
def create_conv():
    data   = sanitize_json(request.get_json(silent=True) or {})
    emp_id = data.get('employer_id')
    stu_id = data.get('student_id')
    job_id = data.get('job_id')
    if not validate_int_id(emp_id) or not validate_int_id(stu_id):
        return err('معرفات المستخدمين غير صالحة', 400)
    existing = db_query(
        'SELECT id FROM conversations WHERE employer_id=%s AND student_id=%s AND (job_id=%s OR job_id IS NULL)',
        (emp_id, stu_id, job_id), fetchone=True
    )
    if existing: return ok(row_to_dict(existing))
    row = db_insert(
        'INSERT INTO conversations (employer_id, student_id, job_id) VALUES (%s,%s,%s)',
        (emp_id, stu_id, job_id),
        'conversations'
    )
    return ok(row_to_dict(row)), 201


@conversations_bp.route('/api/conversations/<int:cid>/messages', methods=['GET'])
@jwt_required()
@rate_limit('default')
def get_messages(cid):
    if not validate_int_id(cid): return err('معرف غير صالح', 400)
    rows = db_query(
        'SELECT m.*, u.name AS sender_name FROM messages m JOIN users u ON m.sender_id=u.id '
        'WHERE m.conversation_id=%s ORDER BY m.created_at ASC',
        (cid,), fetchall=True
    )
    return ok(rows_to_list(rows))


@conversations_bp.route('/api/conversations/<int:cid>/messages', methods=['POST'])
@jwt_required()
@rate_limit('default')
def send_message(cid):
    if not validate_int_id(cid): return err('معرف غير صالح', 400)
    uid  = int(get_jwt_identity())
    data = sanitize_json(request.get_json(silent=True) or {})
    content  = sanitize_str(data.get('content', ''), 2000)
    msg_type = sanitize_str(data.get('msg_type', 'text'), 30)
    if msg_type not in ('text', 'image', 'file'):
        msg_type = 'text'
    row  = db_insert(
        'INSERT INTO messages (conversation_id, sender_id, content, msg_type) VALUES (%s,%s,%s,%s)',
        (cid, uid, content, msg_type),
        'messages'
    )
    return ok(row_to_dict(row)), 201
