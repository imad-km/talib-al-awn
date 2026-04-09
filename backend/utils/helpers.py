import random
import string
import bcrypt
from datetime import datetime
from flask import jsonify


def ok(data=None, **kwargs):
    r = {'ok': True}
    if data is not None: r['data'] = data
    r.update(kwargs)
    return jsonify(r)


def err(msg, code=400):
    return jsonify({'ok': False, 'error': msg}), code


def otp_code():
    return ''.join(random.choices(string.digits, k=6))


def hash_pw(pw):
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def check_pw(pw, h):
    return bcrypt.checkpw(pw.encode(), h.encode())


def row_to_dict(row):
    if row is None: return None
    d = dict(row)
    for k, v in d.items():
        if isinstance(v, datetime): d[k] = v.isoformat()
    return d


def rows_to_list(rows):
    return [row_to_dict(r) for r in rows] if rows else []
