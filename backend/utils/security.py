import re
import time
import html
from collections import defaultdict
from functools import wraps
from flask import request, jsonify


_rate_store = defaultdict(list)

RATE_LIMITS = {
    'auth':    (10, 60),
    'otp':     (5,  60),
    'default': (60, 60),
}

def _get_ip():
    return request.headers.get('X-Forwarded-For', request.remote_addr or '').split(',')[0].strip()

def rate_limit(bucket='default'):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            ip  = _get_ip()
            key = f'{bucket}:{ip}'
            max_calls, window = RATE_LIMITS.get(bucket, RATE_LIMITS['default'])
            now  = time.time()
            hits = [t for t in _rate_store[key] if now - t < window]
            if len(hits) >= max_calls:
                return jsonify({'ok': False, 'error': 'Too many requests'}), 429
            hits.append(now)
            _rate_store[key] = hits
            return fn(*args, **kwargs)
        return wrapper
    return decorator


_XSS_PATTERN     = re.compile(r'<[^>]+>', re.IGNORECASE)
_SCRIPT_PATTERN  = re.compile(r'(javascript|vbscript|data:|on\w+\s*=)', re.IGNORECASE)
_SQL_PATTERN     = re.compile(
    r"(\b(select|insert|update|delete|drop|alter|create|truncate|exec|execute|union|cast|convert|declare|xp_)\b"
    r"|--|;|/\*|\*/|0x[0-9a-f]+)",
    re.IGNORECASE
)
_NULL_BYTE       = re.compile(r'\x00')
_MAX_STRING      = 4096
_MAX_JSON_DEPTH  = 5


def _sanitize_value(v, depth=0):
    if depth > _MAX_JSON_DEPTH:
        return ''
    if isinstance(v, str):
        if len(v) > _MAX_STRING:
            v = v[:_MAX_STRING]
        v = _NULL_BYTE.sub('', v)
        if _SCRIPT_PATTERN.search(v):
            v = _XSS_PATTERN.sub('', v)
            v = html.escape(v)
        return v
    if isinstance(v, dict):
        return {k: _sanitize_value(val, depth + 1) for k, val in v.items() if isinstance(k, str)}
    if isinstance(v, list):
        return [_sanitize_value(i, depth + 1) for i in v[:100]]
    if isinstance(v, (int, float, bool)) or v is None:
        return v
    return ''


def sanitize_json(data):
    if not isinstance(data, dict):
        return {}
    return _sanitize_value(data)


def sanitize_str(value, max_len=255):
    if not isinstance(value, str):
        return ''
    value = value[:max_len]
    value = _NULL_BYTE.sub('', value)
    if _SCRIPT_PATTERN.search(value):
        value = _XSS_PATTERN.sub('', value)
        value = html.escape(value)
    return value


def check_sql_injection(value):
    if isinstance(value, str) and _SQL_PATTERN.search(value):
        return True
    return False


def scan_request_for_injection():
    for key, val in request.args.items():
        if check_sql_injection(key) or check_sql_injection(val):
            return True
    try:
        body = request.get_json(silent=True) or {}
        for val in _flatten(body):
            if check_sql_injection(str(val)):
                return True
    except Exception:
        pass
    return False


def _flatten(obj, depth=0):
    if depth > _MAX_JSON_DEPTH:
        return
    if isinstance(obj, dict):
        for v in obj.values():
            yield from _flatten(v, depth + 1)
    elif isinstance(obj, list):
        for i in obj[:100]:
            yield from _flatten(i, depth + 1)
    else:
        yield obj


def add_security_headers(response):
    response.headers['X-Content-Type-Options']    = 'nosniff'
    response.headers['X-Frame-Options']            = 'DENY'
    response.headers['X-XSS-Protection']           = '1; mode=block'
    response.headers['Referrer-Policy']            = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy']         = 'geolocation=(), microphone=(), camera=()'
    response.headers['Content-Security-Policy']    = (
        "default-src 'none'; "
        "script-src 'none'; "
        "style-src 'none'; "
        "img-src 'none'; "
        "connect-src 'none'; "
        "frame-ancestors 'none';"
    )
    response.headers['Strict-Transport-Security']  = 'max-age=31536000; includeSubDomains'
    response.headers.pop('Server', None)
    response.headers.pop('X-Powered-By', None)
    return response


def validate_email(email):
    return bool(re.fullmatch(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}', email))


def validate_password(pw):
    return isinstance(pw, str) and 6 <= len(pw) <= 128


def validate_int_id(value):
    try:
        v = int(value)
        return v > 0
    except (TypeError, ValueError):
        return False


def guard(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if scan_request_for_injection():
            return jsonify({'ok': False, 'error': 'Invalid input'}), 400
        ct = request.content_type or ''
        if request.method in ('POST', 'PUT', 'PATCH') and 'application/json' not in ct:
            if request.data:
                return jsonify({'ok': False, 'error': 'Content-Type must be application/json'}), 415
        return fn(*args, **kwargs)
    return wrapper
