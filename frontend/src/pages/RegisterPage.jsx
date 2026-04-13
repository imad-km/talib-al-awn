import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { signUpWithOtp, verifyEmailOtp } from '../services/api';
import './RegisterPage.css';

const STEPS_STUDENT = ['regStepRole', 'regStepScan', 'regStepInfo', 'regStepVerify'];
const STEPS_EMPLOYER = ['regStepRole', 'regStepBusiness', 'regStepVerify'];

const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

const ALGERIA_UNIVERSITIES = {
  "جامعة العلوم والتكنولوجيا هواري بومدين": "الجزائر",
  "جامعة الجزائر 1": "الجزائر", "جامعة الجزائر 2": "الجزائر", "جامعة الجزائر 3": "الجزائر",
  "المدرسة العليا للإعلام الآلي (ESI)": "الجزائر", "المدرسة الوطنية المتعددة التقنيات": "الجزائر",
  "جامعة قسنطينة 1": "قسنطينة", "جامعة قسنطينة 2": "قسنطينة", "جامعة قسنطينة 3": "قسنطينة",
  "جامعة وهران 1": "وهران", "جامعة وهران 2": "وهران", "جامعة العلوم والتكنولوجيا وهران": "وهران",
  "جامعة سطيف 1": "سطيف", "جامعة سطيف 2": "سطيف", "جامعة عنابة": "عنابة", "جامعة بجاية": "بجاية",
  "جامعة باتنة 1": "باتنة", "جامعة باتنة 2": "باتنة", "جامعة تلمسان": "تلمسان",
  "جامعة تيزي وزو": "تيزي وزو", "جامعة البليدة 1": "البليدة", "جامعة البليدة 2": "البليدة",
  "جامعة الشلف": "الشلف", "جامعة بسكرة": "بسكرة", "جامعة سكيكدة": "سكيكدة",
  "جامعة جيجل": "جيجل", "جامعة مستغانم": "مستغانم", "جامعة سيدي بلعباس": "سيدي بلعباس",
  "جامعة الأغواط": "الأغواط", "جامعة الجلفة": "الجلفة", "جامعة المدية": "المدية", "جامعة المسيلة": "المسيلة"
};

const WILAYAS = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار",
  "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر",
  "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة",
  "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران", "البيض",
  "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي",
  "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت",
  "غرداية", "غليزان", "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس",
  "عين صالح", "عين قزام", "توقرت", "جانت", "المغير", "المنيعة"
];

const RegisterPage = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(''); // 'student' | 'employer'
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  // Scan states
  const [scanState, setScanState] = useState('idle'); // idle, scanning, success, fail, invalid
  const [cardImagePreview, setCardImagePreview] = useState('');
  const [cardScanned, setCardScanned] = useState(false);
  const [timer, setTimer] = useState(300);

  // Form state
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
    university: '', specialty: '', studentId: '', wilaya: '',
    businessName: '', businessType: ''
  });

  const updateForm = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleUniversityChange = (val) => {
    let w = form.wilaya;
    for (let uName in ALGERIA_UNIVERSITIES) {
      if (val.includes(uName) || uName.includes(val)) {
        w = ALGERIA_UNIVERSITIES[uName];
        break;
      }
    }
    setForm(prev => ({ ...prev, university: val, wilaya: w }));
  };

  const steps = role === 'employer' ? STEPS_EMPLOYER : STEPS_STUDENT;

  const pickRole = (r) => {
    setRole(r);
    setStep(1);
    setAlert('');
  };

  const goBack = () => {
    if (step > 0) { setStep(step - 1); setAlert(''); }
  };

  const handleCard = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(',')[1];
      setCardImagePreview(ev.target.result);
      setScanState('scanning');
      setAlert('');

      try {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) throw new Error("No API Key");

        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: GROQ_MODEL,
            temperature: 0,
            max_tokens: 500,
            response_format: { type: "json_object" },
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'text', text: `Analyze this Algerian university student card image. The layout is Right-To-Left (RTL).
                Extract the following into JSON:
                {
                  "is_student_card": true/false,
                  "first_name_ar": "The FULL Arabic string next to 'الاسم' (e.g., 'قينان مزدك)",
                  "last_name_ar": "The Arabic string next to 'اللقب' (e.g., 'عماد الدين')",
                  "id_number": "The long numeric ID at the bottom (e.g., '202432012311')",
                  "institution": "The university name at the top (e.g., 'جامعة الشلف')",
                  "field_of_study": "The Arabic text next to 'الفرع'"
                }.
                CRITICAL: 
                - The first name (الاسم) often has multiple words (e.g., 'عماد الدين'). DO NOT split them. 
                - The surname (اللقب) is 'كسولة'. DO NOT put 'أيوب' in the 'last_name_ar' field.
                - On this card, the labels 'اللقب' and 'الاسم' are on the RIGHT and their values are to their LEFT.
                - Return ONLY valid JSON.` },
                { type: 'image_url', image_url: { url: `data:${file.type};base64,${base64}` } }
              ]
            }]
          })
        });

        const d = await resp.json();
        if (resp.status === 401) throw new Error("Invalid Groq API Key (401)");
        if (d.error) throw new Error(d.error.message);

        const raw = (d.choices?.[0]?.message?.content || '').trim();
        const m = raw.match(/\{[\s\S]*\}/);
        if (!m) throw new Error('no data');

        const info = JSON.parse(m[0]);

        if (!info.is_student_card) {
          setScanState('invalid');
          setAlert(t('scanNotStudentCard'));
          return;
        }

        const cap = s => s ? s.toString().trim() : '';
        let fn = cap(info.first_name_ar || '').replace(/الاسم|Prénom/gi, '').trim();
        let ln = cap(info.last_name_ar || '').replace(/اللقب|Nom/gi, '').trim();
        let uni = cap(info.institution || '');

        let w = form.wilaya;
        for (let uName in ALGERIA_UNIVERSITIES) {
          if (uni.includes(uName) || uName.includes(uni)) {
            w = ALGERIA_UNIVERSITIES[uName];
            break;
          }
        }

        setForm(prev => ({
          ...prev,
          firstName: fn,
          lastName: ln,
          university: uni,
          specialty: cap(info.field_of_study || ''),
          studentId: cap(info.id_number || ''),
          wilaya: w || prev.wilaya
        }));

        setScanState('success');
        setCardScanned(true);

      } catch (err) {
        console.error(err);
        setScanState('fail');
        setCardScanned(true);
        setAlert(t('scanAiFailedAlert'));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNext = async () => {
    setAlert('');

    if (role === 'student' && step === 1) {
      if (!cardScanned) {
        setAlert(t('scanRequired'));
        return;
      }
      setStep(2);
      return;
    }

    const isFormStep = (role === 'student' && step === 2) || (role === 'employer' && step === 1);
    if (isFormStep) {
      if (!form.firstName || !form.lastName || !form.email || !form.password || !form.wilaya) {
        setAlert(t('fillAllFields'));
        return;
      }
      if (form.password !== form.confirmPassword) {
        setAlert(t('regPasswordMismatch'));
        return;
      }
      if (role === 'employer' && (!form.businessType)) {
        setAlert(t('fillAllFields'));
        return;
      }

      setLoading(true);

      const metadata = role === 'student' ? {
        type: 'student',
        firstname: form.firstName,
        lastname: form.lastName,
        phone: form.phone,
        wilaya: form.wilaya,
        institution: form.university,
        field_of_study: form.specialty,
        student_id_number: form.studentId,
        grade: 'Student',
        domain: form.specialty.toLowerCase().slice(0, 80) || 'autre',
      } : {
        type: 'employer',
        firstname: form.firstName,
        lastname: form.lastName,
        phone: form.phone,
        wilaya: form.wilaya,
        company_name: form.businessName,
        grade: 'Company manager',
        domain: form.businessType || 'autre',
      };

      const res = await signUpWithOtp({ email: form.email, password: form.password, metadata });
      setLoading(false);
      if (res.error) {
        setAlert(res.error.message || 'Error occurred');
        return;
      }

      setStep(role === 'student' ? 3 : 2);
      setTimer(120);
    }
  };

  useEffect(() => {
    if ((role === 'student' && step === 3) || (role === 'employer' && step === 2)) {
      if (timer > 0) {
        const iv = setTimeout(() => setTimer(t => t - 1), 1000);
        return () => clearTimeout(iv);
      }
    }
  }, [timer, step, role]);

  const handleOtpChange = (idx, val) => {
    if (val.length > 1) val = val[val.length - 1];
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setAlert(t('regEnterOtp'));
      return;
    }
    setLoading(true);
    setAlert('');
    const res = await verifyEmailOtp({ email: form.email, token: code });
    setLoading(false);

    if (res.error) {
      setAlert(res.error.message?.includes('expire') ? 'Expired' : 'Incorrect Code');
      return;
    }

    navigate(role === 'student' ? '/student' : '/employer');
  };

  const StepBar = () => {
    if (step === 0) return null;
    return (
      <div className="step-bar">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className="step-col">
              <div className={`sdot${i < step ? ' done' : i === step ? ' active' : ''}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <div className={`slbl${i < step ? ' done' : i === step ? ' active' : ''}`}>{t(s)}</div>
            </div>
            {i < steps.length - 1 && <div className={`sline${i < step ? ' done' : ''}`}></div>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const formatTimer = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="register-root" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <link rel="stylesheet" href="/brand.css" />
      <nav>
        <div className="nav-logo">
          <img src="/assets/logo-07.svg" className="nav-logo-img" alt="Talib-Awn" />
          {t('regNavBrand')}<span>{t('regNavBrandSub')}</span>
        </div>
        <div className="nav-actions">

          <span>{t('regHaveAccount')}</span>
          <Link to="/login">{t('regLoginLink')}</Link>
        </div>
      </nav>

      <div className="page">
        <StepBar />
        {alert && <div className="alert show">{alert}</div>}

        {/* STEP 0: ROLE PICKER */}
        {step === 0 && (
          <div className="step-panel">
            <div className="card">
              <h2 className="card-title">{t('regWelcome')}</h2>
              <p className="card-sub">{t('regChooseRole')}</p>
              <div className="role-grid">
                <div className={`role-card${role === 'student' ? ' selected' : ''}`} onClick={() => pickRole('student')}>
                  <div className="role-check">✓</div>
                  <img src="/assets/icons/student.webp" alt="" className="role-icon" onError={e => { e.target.style.display = 'none'; }} />
                  <div className="role-title">{t('regStudentTitle')}</div>
                  <div className="role-desc">{t('regStudentDesc')}</div>
                </div>
                <div className={`role-card${role === 'employer' ? ' selected' : ''}`} onClick={() => pickRole('employer')}>
                  <div className="role-check">✓</div>
                  <img src="/assets/icons/employer.webp" alt="" className="role-icon" onError={e => { e.target.style.display = 'none'; }} />
                  <div className="role-title">{t('regEmployerTitle')}</div>
                  <div className="role-desc">{t('regEmployerDesc')}</div>
                </div>
              </div>
            </div>
            <div className="form-foot"><Link to="/login">{t('regHaveAccountLink')}</Link></div>
          </div>
        )}

        {/* STEP 1 (STUDENT): SCAN */}
        {step === 1 && role === 'student' && (
          <div className="step-panel">
            {scanState === 'success' && (
              <div className="scan-success-banner show">
                <div className="scan-success-icon">✓</div>
                <div className="scan-success-text">
                  <strong>{t('scanSuccessTitle')}</strong>
                  <p>{t('scanSuccessSub')}</p>
                </div>
              </div>
            )}
            <div className="card">
              <h2 className="card-title">{t('regScanTitle')}</h2>
              <p className="card-sub">{t('regScanSub')}</p>

              <div className="upload-grid">
                <div className="upload-box">
                  <input type="file" accept="image/*" onChange={handleCard} />
                  <div className="upload-box-icon"><img src="/assets/icons/upload.webp" alt="upload" /></div>
                  <div className="upload-box-title">{t('uploadBoxUploadTitle')}</div>
                  <div className="upload-box-sub">{t('uploadBoxUploadSub')}</div>
                  <div className="btn-upload">{t('uploadBoxUploadBtn')}</div>
                  <div className="upload-box-hint">{t('uploadBoxHint')}</div>
                </div>
                <div className="upload-or">{t('uploadOr')}</div>
                <div className="upload-box">
                  <input type="file" accept="image/*" capture="environment" onChange={handleCard} />
                  <div className="upload-box-icon"><img src="/assets/icons/camera.webp" alt="camera" /></div>
                  <div className="upload-box-title">{t('uploadBoxCamTitle')}</div>
                  <div className="upload-box-sub">{t('uploadBoxCamSub')}</div>
                  <div className="btn-upload">{t('uploadBoxCamBtn')}</div>
                  <div className="upload-box-hint">{t('uploadBoxCamHint')}</div>
                </div>
              </div>

              {cardImagePreview && (
                <div className="card-preview show">
                  <img src={cardImagePreview} alt="Card Preview" />
                </div>
              )}

              {scanState === 'scanning' && (
                <div className="scan-status show">
                  <div className="scan-spinner"></div>
                  <span>{t('scanStatus')}</span>
                </div>
              )}

            </div>
            <div className="action-row">
              <button className="btn-secondary" onClick={goBack}>← {t('regBack')}</button>
              <button className={`btn-primary${loading ? ' loading' : ''}`} onClick={handleNext} disabled={!cardScanned || scanState === 'scanning'}>
                <div className="spinner"></div>
                <span className="btn-label">{t('regNext')}</span>
              </button>
            </div>
          </div>
        )}

        {/* DETAILS/FORM (STEP 2 Student, STEP 1 Employer)  */}
        {((role === 'student' && step === 2) || (role === 'employer' && step === 1)) && (
          <div className="step-panel">
            {role === 'student' && scanState === 'fail' && (
              <div className="scan-fail-banner show">
                <div className="scan-fail-icon">!</div>
                <div className="scan-fail-text">
                  <strong>{t('scanFailTitle')}</strong>
                  <p>{t('scanFailSub')}</p>
                </div>
              </div>
            )}
            {role === 'student' && scanState === 'success' && (
              <div className="scan-success-banner show" style={{ marginBottom: 14 }}>
                <div className="scan-success-icon">✓</div>
                <div className="scan-success-text" style={{ display: 'flex', alignItems: 'center' }}>
                  <strong>{t('scanSuccessTitle')}</strong>
                </div>
              </div>
            )}

            <div className="card">
              <h2 className="card-title">
                {role === 'student' ? (scanState === 'success' ? t('verifyScannedData') : t('manualEntryTitle')) : t('regEmployerFormTitle')}
              </h2>
              <p className="card-sub">
                {role === 'student' ? (scanState === 'success' ? t('verifyScannedDataSub') : t('manualEntrySub')) : t('regFormSub')}
              </p>

              {role === 'employer' && (
                <div className="social-row">
                  <button className="btn-social">
                    <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="" /> {t('regGoogleSignup')}
                  </button>
                </div>
              )}
              {role === 'employer' && <div className="divider">{t('loginOr')}</div>}

              {role === 'employer' && (
                <>
                  <div className="sec-divider">{t('regBusinessInfo')}</div>
                  <div className="form-grid-2">
                    <div className="fg">
                      <label>{t('regBusinessName')}</label>
                      <input type="text" value={form.businessName} onChange={e => updateForm('businessName', e.target.value)} placeholder={t('regBusinessNamePh')} />
                    </div>
                    <div className="fg">
                      <label>{t('regBusinessType')}</label>
                      <select value={form.businessType} onChange={e => updateForm('businessType', e.target.value)}>
                        <option value="">{t('regSelectType')}</option>
                        <option value="retail">Retail</option>
                        <option value="cafe">{t('regTypeCafe')}</option>
                        <option value="store">{t('regTypeStore')}</option>
                        <option value="delivery">{t('regTypeDelivery')}</option>
                        <option value="events">{t('regTypeEvents')}</option>
                        <option value="other">{t('regTypeOther')}</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="sec-divider">{role === 'student' && scanState === 'success' ? t('extractedDataHeader') : t('regPersonalInfo')}</div>
              <div className="form-grid-2">
                <div className="fg">
                  <label>{t('regFirstName')} *</label>
                  <input type="text" className={scanState === 'success' ? 'prefilled' : ''} value={form.firstName} onChange={e => updateForm('firstName', e.target.value)} placeholder={t('regFirstNamePh')} />
                </div>
                <div className="fg">
                  <label>{t('regLastName')} *</label>
                  <input type="text" className={scanState === 'success' ? 'prefilled' : ''} value={form.lastName} onChange={e => updateForm('lastName', e.target.value)} placeholder={t('regLastNamePh')} />
                </div>
              </div>

              {role === 'student' && (
                <div className="form-grid-2">
                  <div className="fg">
                    <label>{t('regUniversity')} *</label>
                    <input type="text" className={scanState === 'success' ? 'prefilled' : ''} value={form.university} onChange={e => handleUniversityChange(e.target.value)} placeholder={t('regUniversityPh')} list="universities" />
                    <datalist id="universities">
                      {Object.keys(ALGERIA_UNIVERSITIES).map((u, i) => <option key={i} value={u} />)}
                    </datalist>
                  </div>
                  <div className="fg">
                    <label>{t('specialty')} *</label>
                    <input type="text" className={scanState === 'success' ? 'prefilled' : ''} value={form.specialty} onChange={e => updateForm('specialty', e.target.value)} placeholder={t('fieldPh')} />
                  </div>
                </div>
              )}

              {role === 'student' && (
                <div className="fg">
                  <label>{t('studentIdLabel')} <span className="opt">({t('regOptional')})</span></label>
                  <input type="text" className={scanState === 'success' ? 'prefilled' : ''} value={form.studentId} onChange={e => updateForm('studentId', e.target.value)} placeholder={t('studentIdPh')} />
                </div>
              )}

              {role === 'student' && scanState === 'success' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#3d7a52', marginBottom: 8, marginTop: -6 }}>
                  <span>✓</span><span>{t('cardScanSuccessCheck')}</span>
                </div>
              )}

              <div className="sec-divider">{t('contactInfoHeader')}</div>
              <div className="form-grid-2">
                <div className="fg">
                  <label>{t('regPhone')} <span className="opt">({t('regOptional')})</span></label>
                  <div className="unavailable-input">
                    <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="0555 00 00 00" disabled />
                    <div className="unavailable-overlay">
                      <span>{t('notAvailableYet')}</span>
                    </div>
                  </div>
                </div>
                <div className="fg">
                  <label>{t('wilaya')} *</label>
                  <select value={form.wilaya} onChange={e => updateForm('wilaya', e.target.value)}>
                    <option value="">{t('selectWilaya')}</option>
                    {WILAYAS.map((w, i) => <option key={i} value={w}>{String(i + 1).padStart(2, '0')} {w}</option>)}
                  </select>
                </div>
              </div>

              <div className="sec-divider">{role === 'student' ? t('accountDataHeader') : t('regSecurity')}</div>
              <div className="fg">
                <label>{t('loginEmailLabel')} *</label>
                <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="you@example.com" />
              </div>

              <div className="form-grid-2">
                <div className="fg">
                  <label>{t('loginPasswordLabel')} *</label>
                  <input type="password" value={form.password} onChange={e => updateForm('password', e.target.value)} placeholder="••••••••" />
                </div>
                <div className="fg">
                  <label>{t('regConfirmPassword')} *</label>
                  <input type="password" value={form.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} placeholder="••••••••" />
                </div>
              </div>

              <div className="action-row">
                <button className="btn-secondary" onClick={goBack}>← {t('regBack')}</button>
                <button className={`btn-primary${loading ? ' loading' : ''}`} onClick={handleNext} disabled={loading}>
                  <div className="spinner"></div>
                  <span className="btn-label">{role === 'student' ? t('regSendOtp') : t('regCreateAccount')}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP OTP */}
        {((role === 'student' && step === 3) || (role === 'employer' && step === 2)) && (
          <div className="step-panel">
            <div className="card" style={{ textAlign: 'center' }}>
              <h2 className="card-title">{t('regOtpTitle')}</h2>
              <p className="card-sub">{t('regOtpSub').replace('{email}', form.email)}</p>

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

              <div className={`timer-badge ${timer === 0 ? 'expired' : ''}`}>
                ⏱ {timer > 0 ? formatTimer(timer) : t('regResend')}
              </div>
              <br />

              <button className={`btn-primary${loading ? ' loading' : ''}`} onClick={handleVerify} disabled={loading || timer === 0}>
                <div className="spinner"></div>
                <span className="btn-label">{t('regVerify')}</span>
              </button>

              <div style={{ marginTop: 16 }}>
                <button className="resend-btn" disabled={timer > 0} onClick={handleNext}>{t('regResend')}</button>
              </div>

              <div className="action-row" style={{ justifyContent: 'center', marginTop: 12 }}>
                 <button className="btn-secondary" onClick={goBack}>{t('regBack')}</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RegisterPage;
