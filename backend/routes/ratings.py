import pymysql.err
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db_query, db_insert
from utils.helpers import ok, err, row_to_dict, rows_to_list

ratings_bp = Blueprint('ratings', __name__)


@ratings_bp.route('/api/deals/<int:cid>/rate', methods=['POST'])
@jwt_required()
def rate_user(cid):
    uid  = int(get_jwt_identity())
    data = request.json or {}

    deal = db_query(
        "SELECT * FROM deals WHERE conversation_id=%s AND status IN ('secured','completed')",
        (cid,), fetchone=True
    )
    if not deal:
        return err('لا يمكن التقييم إلا بعد إتمام الصفقة')

    is_employer = (uid == deal['employer_id'])
    is_student  = (uid == deal['student_id'])
    if not is_employer and not is_student:
        return err('غير مصرح', 403)

    rated_id = deal['student_id'] if is_employer else deal['employer_id']
    score    = data.get('score')
    comment  = data.get('comment', '').strip() or None

    if score is None or not isinstance(score, int) or not (1 <= score <= 5):
        return err('التقييم يجب أن يكون بين 1 و 5')

    try:
        row = db_insert(
            'INSERT INTO ratings (deal_id, rater_id, rated_id, score, comment) VALUES (%s,%s,%s,%s,%s)',
            (deal['id'], uid, rated_id, score, comment),
            'ratings'
        )
    except pymysql.err.IntegrityError:
        return err('لقد قمت بتقييم هذه الصفقة مسبقاً')

    return ok(row_to_dict(row)), 201


@ratings_bp.route('/api/ratings/<int:user_id>', methods=['GET'])
def get_user_ratings(user_id):
    rows = db_query(
        'SELECT r.*, u.name AS rater_name, u.avatar_url AS rater_avatar '
        'FROM ratings r JOIN users u ON r.rater_id=u.id '
        'WHERE r.rated_id=%s ORDER BY r.created_at DESC',
        (user_id,), fetchall=True
    )
    avg = db_query(
        'SELECT COALESCE(ROUND(AVG(score),1),0) AS avg, COUNT(*) AS total '
        'FROM ratings WHERE rated_id=%s',
        (user_id,), fetchone=True
    )
    return ok({
        'ratings': rows_to_list(rows),
        'average': float(avg['avg']),
        'total':   avg['total'],
    })


@ratings_bp.route('/api/ratings/<int:rating_id>', methods=['DELETE'])
@jwt_required()
def delete_rating(rating_id):
    uid    = int(get_jwt_identity())
    rating = db_query('SELECT * FROM ratings WHERE id=%s AND rater_id=%s', (rating_id, uid), fetchone=True)
    if not rating:
        return err('التقييم غير موجود أو ليس لديك صلاحية حذفه', 404)
    db_query('DELETE FROM ratings WHERE id=%s', (rating_id,), commit=True)
    return ok({'message': 'تم حذف التقييم'})
