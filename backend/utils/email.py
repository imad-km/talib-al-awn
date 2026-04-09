import smtplib
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import GMAIL_ADDRESS, GMAIL_APP_PASS, PLATFORM_NAME, LOGO_URL


def send_email(to_email, subject, html, plain_text=None):
    def _send():
        try:
            msg = MIMEMultipart('alternative')
            msg['From']    = f'{PLATFORM_NAME} <{GMAIL_ADDRESS}>'
            msg['To']      = to_email
            msg['Subject'] = subject
            if plain_text:
                msg.attach(MIMEText(plain_text, 'plain'))
            msg.attach(MIMEText(html, 'html'))
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(GMAIL_ADDRESS, GMAIL_APP_PASS)
                server.sendmail(GMAIL_ADDRESS, to_email, msg.as_string())
        except Exception as e:
            print(f'[EMAIL ERROR] {to_email}: {e}')
    threading.Thread(target=_send, daemon=True).start()


def otp_html(otp, expiry_min=2, is_reset=False):
    accent = '#c0392b' if is_reset else '#7c3aed'
    header = 'إعادة تعيين كلمة المرور' if is_reset else 'رمز التحقق'
    sub    = 'استخدم الرمز أدناه لإعادة تعيين كلمة مرورك.' if is_reset else 'استخدم الرمز أدناه لإكمال عملية التسجيل وإنشاء حسابك بنجاح.'

    return f"""<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
  body {{ font-family: 'Cairo', Arial, sans-serif; }}
</style>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;background-image:radial-gradient(circle, #e5e7eb 1.2px, transparent 1.2px);background-size:32px 32px;">
<div style="display:none;font-size:1px;color:#f9fafb;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
  رمز التحقق الخاص بك هو: {otp} — صالح لمدة {expiry_min} دقيقتين
</div>
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
<tr><td align="center">
  <table width="540" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.08);border:1px solid #f3f4f6;">
    <tr><td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:48px 32px;text-align:center;">
      <img src="https://i.ibb.co/rf2fRJT8/logo-07.png" width="70" height="70" style="border-radius:16px;border:3px solid rgba(255,255,255,0.2);margin-bottom:20px;display:inline-block;"/>
      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.02em;">{header}</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;font-weight:400;">{PLATFORM_NAME}</p>
    </td></tr>
    <tr><td style="padding:48px 32px;text-align:center;">
      <p style="font-size:16px;color:#4b5563;margin:0 0 32px;line-height:1.6;">
        {sub}<br/>
        ينتهي هذا الرمز خلال <strong style="color:{accent};">{expiry_min} دقيقتين</strong>.
      </p>
      <div style="background:#f3f4f6;border-radius:18px;padding:32px 24px;margin-bottom:32px;display:inline-block;">
        <p style="margin:0 0 16px;font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.1em;">رمز التحقق الخاص بك</p>
        <div style="display:inline-block;background:#ffffff;border:2px dashed {accent}50;border-radius:14px;padding:16px 36px;cursor:pointer;">
          <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:36px;font-weight:800;color:{accent};letter-spacing:0.4em;user-select:all;-webkit-user-select:all;-moz-user-select:all;-ms-user-select:all;">{otp}</span>
        </div>
        <p style="margin:12px 0 0;font-size:11px;color:#9ca3af;">انقر مطولاً أو حدد الرمز لنسخه</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;margin-bottom:32px;">
        <tr><td style="padding:14px;text-align:center;font-size:13px;color:#92400e;line-height:1.4;">
          لا تشارك هذا الرمز مع أي شخص
        </td></tr>
      </table>
      <p style="font-size:13px;color:#9ca3af;margin:0;">إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني.</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>"""


def invite_html(to_name):
    greeting = f'مرحباً {to_name}،' if to_name else 'مرحباً،'
    return f"""<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f3ff;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff;padding:36px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0"
       style="background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 6px 32px rgba(0,0,0,0.09);">
  <tr><td style="background:linear-gradient(135deg,#6c3dab,#4a2080);padding:44px;text-align:center;">
    <img src="{LOGO_URL}" width="80" height="80"
         style="border-radius:16px;border:3px solid rgba(255,255,255,0.22);
                object-fit:cover;display:block;margin:0 auto 18px;"/>
    <div style="display:inline-block;background:rgba(212,168,67,0.2);border:1px solid rgba(212,168,67,0.5);
                border-radius:100px;padding:4px 16px;font-size:11px;letter-spacing:0.14em;
                color:#d4a843;margin-bottom:14px;">دعوة خاصة</div>
    <h1 style="margin:0;color:#fff;font-size:30px;font-weight:700;">أنت مدعو!</h1>
  </td></tr>
  <tr><td style="padding:44px;">
    <p style="font-size:15px;color:#555;margin:0 0 16px;">{greeting}</p>
    <p style="font-size:15px;color:#444;line-height:1.8;margin:0 0 32px;">
      يسعدنا دعوتك للانضمام إلى منصة
      <strong style="color:#6c3dab;">{PLATFORM_NAME}</strong> —
      المنصة المتخصصة في ربط طلاب الجامعات الجزائرية بفرص العمل الجزئي.
    </p>
    <div style="text-align:center;margin:0 0 32px;">
      <a href="#" style="display:inline-block;background:linear-gradient(135deg,#6c3dab,#4a2080);
                          color:#fff;text-decoration:none;padding:16px 48px;border-radius:12px;
                          font-weight:700;font-size:14px;letter-spacing:0.06em;">
        انضم الآن ←
      </a>
    </div>
    <p style="font-size:11px;color:#ccc;text-align:center;margin:0;">
      تمت إرسال هذه الدعوة من فريق {PLATFORM_NAME}
    </p>
  </td></tr>
  <tr><td style="background:#f8f6ff;padding:22px;text-align:center;border-top:1px solid #ede9f5;">
    <p style="font-size:11px;color:#bbb;margin:0;">© 2026 {PLATFORM_NAME} · الجزائر</p>
  </td></tr>
</table></td></tr></table></body></html>"""
