import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './LoginOtpPage.css';

const LoginOtpPage = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');

  const handleSendOtp = () => {
    const val = activeTab === 'email' ? email : phone;
    if (!val.trim()) {
      setAlert(t('fillAllFields'));
      return;
    }
    
    setAlert('');
    setLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      navigate('/otp', { state: { email: val, type: activeTab } });
    }, 1200);
  };

  return (
    <div className="login-otp-root" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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
      </div>

      {/* FORM PANEL */}
      <div className="form-side">
        <div className="form-box">
          <h2 className="form-title">{t('loginOtpTitle')}</h2>
          <p className="form-sub">{t('loginOtpSubtitle')}</p>

          <div className="otp-tabs">
            <button 
              className={`otp-tab ${activeTab === 'email' ? 'active' : ''}`} 
              onClick={() => setActiveTab('email')}
            >
              {t('otpTabEmail')}
            </button>
            <button 
              className={`otp-tab ${activeTab === 'phone' ? 'active' : ''}`} 
              onClick={() => setActiveTab('phone')}
            >
              {t('otpTabPhone')}
            </button>
          </div>

          {alert && <div className="alert show">{alert}</div>}

          {activeTab === 'email' ? (
            <div className="fg">
              <label>{t('loginEmailLabel')}</label>
              <div className="input-with-icon">
                <span className="icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="you@univ.dz" 
                />
              </div>
            </div>
          ) : (
            <div className="fg relative-fg">
              <label>{t('regPhone')}</label>
              <div className="input-with-icon">
                <span className="icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="0XXX XX XX XX" 
                  disabled
                />
              </div>
              <div className="phone-overlay">
                <span className="overlay-badge">{t('availableSoon')}</span>
              </div>
            </div>
          )}

          <button className={`btn-primary ${loading ? 'loading' : ''}`} onClick={handleSendOtp} disabled={loading}>
            {loading ? <div className="spinner"></div> : t('regSendOtp')}
          </button>

          <div className="form-foot">
            <Link to="/login" className="back-to-login">
              {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOtpPage;
