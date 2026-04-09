import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const { lang, t } = useLanguage();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, msg: '', success: false });
    const [countdown, setCountdown] = useState(120);

    useEffect(() => {
        let interval;
        if (step === 2 && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [step, countdown]);

    const showAlert = (msg, success = false) => {
        setAlert({ show: true, msg, success });
    };

    const handleSendOtp = async () => {
        if (!email.trim()) {
            showAlert(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني.' : 'Please enter your email.');
            return;
        }
        setLoading(true);
        setAlert({ ...alert, show: false });
        
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            setCountdown(120);
        }, 1500);
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 6) {
            showAlert(lang === 'ar' ? 'أدخل جميع أرقام الرمز الستة.' : 'Enter all 6 digits of the code.');
            return;
        }
        setLoading(true);
        setAlert({ ...alert, show: false });

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1500);
    };

    const handleResetPassword = async () => {
        if (!password || password.length < 6) {
            showAlert(lang === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            showAlert(lang === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
            return;
        }
        setLoading(true);
        setAlert({ ...alert, show: false });

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            showAlert(lang === 'ar' ? 'تم تحديث كلمة المرور! جاري التحويل…' : 'Password updated! Redirecting...', true);
            setTimeout(() => {
                navigate('/login');
            }, 1800);
        }, 1500);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="forgot-root" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <link rel="stylesheet" href="/brand.css" />
            
            {/* BRAND PANEL */}
            <div className="brand-panel">
                <div className="brand-logo">
                    <img src="/assets/logo-07.svg" className="brand-logo-img" alt="Talib-Awn" />
                    <div className="brand-logo-name">طالب<span> عون</span></div>
                </div>

                <div className="brand-content">
                    <div className="brand-eyebrow">{lang === 'ar' ? 'استعادة كلمة المرور' : 'Password Recovery'}</div>
                    <h1 className="brand-h1">
                        <span>{lang === 'ar' ? 'نسيت كلمة' : 'Forgot your'}</span>
                        <em> {lang === 'ar' ? 'المرور؟' : 'Password?'}</em>
                    </h1>
                    <div className="brand-underline"></div>
                    <p className="brand-sub">
                        {lang === 'ar' 
                            ? 'لا مشكلة — سنرسل رمزاً إلى بريدك الإلكتروني حتى تتمكن من تعيين كلمة مرور جديدة.'
                            : "No problem — we'll send a code to your email so you can set a new password."}
                    </p>
                </div>

                <div className="brand-steps">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bstep">
                            <div className={`bstep-num${step >= i ? ' done' : ''}`}>{step > i ? '✓' : i}</div>
                            <div className="bstep-text">
                                {i === 1 && (lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email')}
                                {i === 2 && (lang === 'ar' ? 'تحقق من رمز التأكيد المرسل' : 'Verify the confirmation code')}
                                {i === 3 && (lang === 'ar' ? 'عيّن كلمة مرور جديدة' : 'Set a new password')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FORM PANEL */}
            <div className="form-side">
                <div className="form-box">
                    <div className="step-indicator">
                        <div className={`step-dot ${step === 1 ? 'active' : step > 1 ? 'done' : 'pending'}`}>1</div>
                        <div className={`step-line ${step > 1 ? 'done' : ''}`}></div>
                        <div className={`step-dot ${step === 2 ? 'active' : step > 2 ? 'done' : 'pending'}`}>2</div>
                        <div className={`step-line ${step > 2 ? 'done' : ''}`}></div>
                        <div className={`step-dot ${step === 3 ? 'active' : step > 3 ? 'done' : 'pending'}`}>3</div>
                    </div>

                    {alert.show && (
                        <div className={`alert ${alert.success ? 'success' : ''} show`}>
                            {alert.msg}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="step-content">
                            <div className="form-header">
                                <h2>{lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}</h2>
                                <p>{lang === 'ar' ? 'سنرسل رمز إعادة التعيين إلى هذا العنوان.' : "We'll send a reset code to this address."}</p>
                            </div>
                            <div className="fg">
                                <label>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                                <span className="fg-icon">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                </span>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="you@example.com" 
                                />
                            </div>
                            <button className={`btn-submit ${loading ? 'loading' : ''}`} onClick={handleSendOtp} disabled={loading}>
                                <div className="spinner"></div>
                                <span className="btn-label">{lang === 'ar' ? 'إرسال رمز التأكيد ←' : 'Send Code ←'}</span>
                            </button>
                            <div className="form-footer">
                                <Link to="/login">{lang === 'ar' ? '← العودة إلى تسجيل الدخول' : '← Back to Login'}</Link>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-content">
                            <div className="form-header">
                                <h2>{lang === 'ar' ? 'تحقق من بريدك' : 'Check your email'}</h2>
                                <p>{lang === 'ar' ? `أدخل الرمز المكوّن من 6 أرقام المرسل إلى ` : 'Enter the 6-digit code sent to '} <strong style={{color:'var(--blue)'}}>{email}</strong></p>
                            </div>
                            <div style={{textAlign:'center', marginBottom:8}}>
                                <div className={`timer-badge ${countdown === 0 ? 'expired' : ''}`}>
                                    {countdown === 0 
                                        ? (lang === 'ar' ? 'انتهت صلاحية الرمز' : 'Code expired') 
                                        : `${lang === 'ar' ? 'ينتهي خلال' : 'Expires in'} ${formatTime(countdown)}`}
                                </div>
                            </div>
                            <div className="otp-container">
                                <input 
                                    type="text" 
                                    maxLength="6" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g,''))}
                                    placeholder="• • • • • •"
                                    className="otp-input"
                                />
                            </div>
                            <button className={`btn-submit ${loading ? 'loading' : ''}`} onClick={handleVerifyOtp} disabled={loading}>
                                <div className="spinner"></div>
                                <span className="btn-label">{lang === 'ar' ? 'تحقق من الرمز ←' : 'Verify Code ←'}</span>
                            </button>
                            <div style={{textAlign:'center', marginTop:16}}>
                                <button className="resend-btn" onClick={handleSendOtp} disabled={countdown > 0}>
                                    {lang === 'ar' ? 'إعادة الإرسال' : 'Resend Code'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="step-content">
                            <div className="form-header">
                                <h2>{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</h2>
                                <p>{lang === 'ar' ? 'اختر كلمة مرور قوية لحسابك.' : 'Choose a strong password for your account.'}</p>
                            </div>
                            <div className="fg">
                                <label>{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder={lang === 'ar' ? '6 أحرف على الأقل' : 'Min 6 characters'}
                                />
                            </div>
                            <div className="fg">
                                <label>{lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    placeholder={lang === 'ar' ? 'أعد كلمة المرور' : 'Re-enter password'}
                                />
                            </div>
                            <button className={`btn-submit ${loading ? 'loading' : ''}`} onClick={handleResetPassword} disabled={loading}>
                                <div className="spinner"></div>
                                <span className="btn-label">{lang === 'ar' ? 'تحديث كلمة المرور ←' : 'Update Password ←'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
