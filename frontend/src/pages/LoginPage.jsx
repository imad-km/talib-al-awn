import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './LoginPage.css';

const LoginPage = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password) {
      setAlert(t('fillAllFields'));
      return;
    }
    setAlert('');
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      // Will connect to backend later
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="login-root" dir={lang === 'ar' ? 'rtl' : 'ltr'} onKeyDown={handleKeyDown}>
      <link rel="stylesheet" href="/brand.css" />
      


      {/* BRAND PANEL */}
      <div className="brand">
        <div className="brand-logo">
          <img src="/assets/logo-07.svg" className="brand-logo-img" alt="طالب عون" />
          <div className="brand-logo-name">{t('loginBrandName')}<span> {t('loginBrandSub')}</span></div>
        </div>
        <div className="brand-headline">
          <h1 className="brand-h1">
            <span>{t('loginBrandH1')}</span>
            <span>{t('loginBrandH2')}</span>
          </h1>
          <div className="brand-underline"></div>
          <p className="brand-sub">{t('loginBrandDesc')}</p>
        </div>
        <div className="brand-stats">
          <div className="bstat">
            <div className="bstat-num">{t('loginStatFree')}</div>
            <div className="bstat-lbl">{t('loginStatFreeLbl')}</div>
          </div>
          <div className="bstat">
            <div className="bstat-num">{t('loginStatLocal')}</div>
            <div className="bstat-lbl">{t('loginStatLocalLbl')}</div>
          </div>
          <div className="bstat">
            <div className="bstat-num">{t('loginStatFlex')}</div>
            <div className="bstat-lbl">{t('loginStatFlexLbl')}</div>
          </div>
        </div>
      </div>

      {/* FORM PANEL */}
      <div className="form-side">
        <div className="form-box">
          <h2 className="form-title">{t('loginWelcome')}</h2>
          <p className="form-sub">{t('loginSubtitle')}</p>

          {alert && <div className="alert show">{alert}</div>}

          <div className="fg">
            <label>{t('loginEmailLabel')}</label>
            <span className="fg-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>

          <div className="fg">
            <label>{t('loginPasswordLabel')}</label>
            <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          <div className="row-meta">
            <label className="remember">
              <input type="checkbox" defaultChecked /> {t('loginRemember')}
            </label>
            <Link to="/forgot-password" data-id="forgot-password-link" className="forgot">{t('loginForgot')}</Link>
          </div>

          <button className={`btn-green${loading ? ' loading' : ''}`} onClick={handleLogin} disabled={loading}>
            <div className="spinner"></div>
            <span className="btn-label">{t('loginBtn')}</span>
          </button>

          <div className="divider">{t('loginOr')}</div>

          <div className="social-row">
            <button className="btn-social coming-soon" data-tooltip={t('availableSoon')}>
              <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="" /> Google
            </button>
          </div>

          <div className="form-foot">
            {t('loginNoAccount')} <Link to="/register">{t('loginCreateAccount')}</Link>
          </div>

          <Link to="/login-otp" className="otp-link">
            <span style={{display:'flex',alignItems:'center',gap:8}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
              {t('loginOtp')}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
