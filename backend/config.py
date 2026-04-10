import os
from datetime import timedelta

try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ Environment variables loaded from .env")
except ImportError:
    print("⚠️  python-dotenv not found. Run 'pip install python-dotenv' to use .env files.")

JWT_SECRET_KEY          = os.environ.get('JWT_SECRET_KEY', 'talib-awn-secret-key-dev-2026')
JWT_ACCESS_TOKEN_EXPIRES  = timedelta(hours=8)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

CORS_ORIGINS = [
    "https://talib-awn.netlify.app",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5503",
    "http://127.0.0.1:5503",
]

GMAIL_ADDRESS  = os.environ.get('GMAIL_ADDRESS',  'taliibawn@gmail.com')
GMAIL_APP_PASS = os.environ.get('GMAIL_APP_PASS', 'kmtg sdjq tntv kuph')
PLATFORM_NAME  = 'طالب عون | Talib Awn'
LOGO_URL       = 'https://i.ibb.co/rf2fRJT8/logo-07.png'
OTP_EXPIRY_SEC = 120

DB_HOST     = "173.249.28.246"
DB_PORT     = 3306
DB_USER     = "zitadokm"
DB_PASSWORD = "i2006imadalge"
DB_NAME     = "talib"

CHARGILY_API_KEY  = "test_sk_bqpzX0rThK1ohs8iXJPMoGYXMLgmQ9kDDCVkByqX"
CHARGILY_BASE_URL = "https://pay.chargily.net/test/api/v2"
APP_BASE_URL      = "http://localhost:5000"
