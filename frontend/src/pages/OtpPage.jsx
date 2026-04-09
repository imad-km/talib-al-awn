import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { verifyEmailOtp, signUpWithOtp } from '../services/api';
import './OtpPage.css';

const OtpPage = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [alert, setAlert] = useState('');
  const otpRefs = useRef([]);

  const email = location.state?.email || 'user@example.com';

  useEffect(() => {
    if (timer > 0) {
      const iv = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(iv);
    }
  }, [timer]);

  const handleOtpChange = (idx, val) => {
    if (val.length > 1) val = val[val.length - 1];
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) otpRefs.current[idx + 1].focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) return;
    setLoading(true);
    const res = await verifyEmailOtp({ email, otp: code });
    setLoading(false);
    if (res.error) {
      setAlert(res.error.message);
    } else {
      navigate('/student-home');
    }
  };

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="otp-page-root" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <link rel="stylesheet" href="/brand.css" />

      <div className="otp-card">
        <div className="otp-header">
        <div className="brand-logo" style={{justifyContent: 'center', marginBottom: 32}}>
          <img src="/assets/logo-07.svg" style={{height: 48}} alt="Talib-Awn" />
        </div>
        <div className="otp-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
          </div>
          <h1>{t('regOtpTitle')}</h1>
          <p>{t('regOtpSub').replace('{email}', email)}</p>
        </div>

        {alert && <div className="otp-alert">{alert}</div>}

        <div className="otp-inputs">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => otpRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              className={digit ? 'filled' : ''}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
            />
          ))}
        </div>

        <div className={`otp-timer ${timer === 0 ? 'expired' : ''}`}>
          {timer > 0 ? formatTimer(timer) : t('regResend')}
        </div>

        <button 
          className={`otp-verify-btn ${loading ? 'loading' : ''}`} 
          onClick={handleVerify} 
          disabled={loading || timer === 0 || otp.join('').length < 6}
        >
          {loading ? <div className="otp-spinner"></div> : t('regVerify')}
        </button>

        <div className="otp-footer">
          <button className="otp-resend-link" disabled={timer > 0}>{t('regResend')}</button>
          <button className="otp-back-link" onClick={() => navigate(-1)}>{t('regBack')}</button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
