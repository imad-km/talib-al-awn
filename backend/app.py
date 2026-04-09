import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS

import config
from database import init_db
from routes.auth          import auth_bp
from routes.jobs          import jobs_bp
from routes.conversations import conversations_bp
from routes.deals         import deals_bp
from routes.ratings       import ratings_bp
from routes.admin         import admin_bp
from routes.users         import users_bp

app = Flask(__name__)
app.config['JWT_SECRET_KEY']           = config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = config.JWT_ACCESS_TOKEN_EXPIRES
app.config['JWT_REFRESH_TOKEN_EXPIRES']= config.JWT_REFRESH_TOKEN_EXPIRES

CORS(app, supports_credentials=True, origins=config.CORS_ORIGINS)
JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(jobs_bp)
app.register_blueprint(conversations_bp)
app.register_blueprint(deals_bp)
app.register_blueprint(ratings_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(users_bp)


@app.route('/')
def health():
    return jsonify({'ok': True, 'message': 'Talib-Awn API is running ✅'})


@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        from database import get_db
        conn = get_db()
        conn.ping(reconnect=True)
        conn.close()
        from utils.helpers import ok
        return ok({'status': 'healthy', 'database': 'connected'})
    except Exception as e:
        from utils.helpers import err
        return err(f'Database connection failed: {str(e)}', 500)


try:
    init_db()
except Exception as e:
    print(f"⚠️  Database init failed: {e}")
    print("⚠️  Make sure DATABASE_URL is set in Railway environment variables!")


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    db_url = os.environ.get('DATABASE_URL')
    print(f"🚀 Talib-Awn backend starting on port {port}...")
    print(f"🔗 DB URL configured: {'Yes' if db_url else 'No'}")
    app.run(host='0.0.0.0', port=port, debug=True)
