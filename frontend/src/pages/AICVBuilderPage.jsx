import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const STORAGE_KEY = 'ta_my_profile';

const questions = {
  en: [
    { key: 'name', text: 'What is your full name?' },
    { key: 'email', text: 'What is your email?' },
    { key: 'phone', text: 'Your phone number?' },
    { key: 'university', text: 'Which university do you study at?' },
    { key: 'specialty', text: 'What is your specialty?' },
    { key: 'skills', text: 'List your skills (comma separated)' },
    { key: 'bio', text: 'Tell me about yourself briefly' },
  ],
  ar: [
    { key: 'name', text: 'ما هو اسمك الكامل؟' },
    { key: 'email', text: 'ما هو بريدك الإلكتروني؟' },
    { key: 'phone', text: 'ما هو رقم هاتفك؟' },
    { key: 'university', text: 'في أي جامعة تدرس؟' },
    { key: 'specialty', text: 'ما هي تخصصك؟' },
    { key: 'skills', text: 'سرد مهاراتك (مفصولة بفواصل)' },
    { key: 'bio', text: 'أخبرنا عن نفسك باختصار' },
  ]
};

const AICVBuilderPage = () => {
  const navigate = useNavigate();
  const { lang, toggleLanguage, t } = useLanguage();

  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const currentQuestions = questions[lang] || questions.en;

  // Initialize chat messages when language changes
  useEffect(() => {
    setMessages([
      { sender: 'ai', text: lang === 'ar' 
          ? "مرحبا 👋 أنا مساعد بناء السيرة الذاتية بالذكاء الاصطناعي. هيا نبني سيرتك الذاتية." 
          : "Hey 👋 I'm your AI CV builder. Let's build your CV." 
      },
      { sender: 'ai', text: currentQuestions[0].text }
    ]);
    setStep(0);
    setAnswers({});
    setInput('');
  }, [lang]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#0f172a' : '#ffffff';
    document.body.style.transition = 'background-color 0.3s ease';
    return () => { document.body.style.backgroundColor = ''; };
  }, [darkMode]);

  const handleSend = () => {
    if (!input.trim()) return;

    const currentQ = currentQuestions[step];
    const newAnswers = { ...answers, [currentQ.key]: input };

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setAnswers(newAnswers);

    if (step + 1 < currentQuestions.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: '...' }]);
        setTimeout(() => {
          setMessages(prev => [
            ...prev.slice(0, -1),
            { sender: 'ai', text: currentQuestions[step + 1].text }
          ]);
          setStep(prev => prev + 1);
        }, 600);
      }, 400);
    } else {
      generateCV(newAnswers);
    }
  };

  const generateCV = (data) => {
    const cvText = `${data.name}\n${data.email} | ${data.phone}\n----------------------------------------\nEDUCATION\n${data.university} - ${data.specialty}\n----------------------------------------\nABOUT ME\n${data.bio}\n----------------------------------------\nSKILLS\n${data.skills}`;

    const cvDataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(cvText);
    const cvFileName = `${data.name.replace(/\s/g, '_')}_CV.txt`;

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const updatedProfile = {
      ...existing,
      ...data,
      skills: data.skills.split(',').map(s => s.trim()),
      cvUrl: cvDataUrl,
      cvName: cvFileName,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));

    setMessages(prev => [
      ...prev,
      { sender: 'ai', text: lang === 'ar' ? '✅ سيرتك الذاتية جاهزة! جاري التوجيه إلى الملف الشخصي...' : '✅ Your CV is ready! Redirecting to your profile...' }
    ]);

    setTimeout(() => {
      navigate('/student/my-profile');
    }, 1500);
  };

  const theme = {
    bg: darkMode ? '#0f172a' : '#ffffff',
    card: darkMode ? '#111827' : '#ffffff',
    border: darkMode ? '#1f2937' : '#e2e8f0',
    text: darkMode ? '#e5e7eb' : '#0f172a',
    subText: darkMode ? '#9ca3af' : '#64748b',
    aiBubble: darkMode ? '#1f2937' : '#ffffff',
    inputBg: darkMode ? '#111827' : '#ffffff',
  };

  return (
    <div 
      className="cv-builder-page" 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: 20,
        background: theme.bg,
        minHeight: '100vh',
        color: theme.text,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Return Button - Changes with language */}
        <button
          onClick={() => navigate('/student/my-profile')}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: `1px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14.5,
          }}
        >
          ← {t('Return') || (lang === 'ar' ? 'العودة' : 'Return to Profile')}
        </button>

        <h1 style={{ margin: 0, fontSize: 24 }}>🪄 {t('aiCvBuilder') || 'AI CV Builder'}</h1>

        <div style={{ display: 'flex', gap: 8 }}>
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
              background: theme.card,
              color: theme.text,
              cursor: 'pointer',
              fontWeight: 600,
              minWidth: 70
            }}
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
              background: theme.card,
              color: theme.text,
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
        height: 460,
        overflowY: 'auto',
        marginBottom: 16,
        background: theme.card,
        boxShadow: darkMode ? 'none' : '0 4px 20px rgba(15,23,42,0.06)'
      }}>
        {messages.map((m, i) => (
          <div 
            key={i} 
            style={{ 
              textAlign: m.sender === 'user' ? (lang === 'ar' ? 'left' : 'right') : 'left', 
              marginBottom: 12 
            }}
          >
            <span style={{
              display: 'inline-block',
              padding: '11px 16px',
              borderRadius: 14,
              background: m.sender === 'user'
                ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                : theme.aiBubble,
              color: m.sender === 'user' ? '#fff' : theme.text,
              maxWidth: '78%',
              fontSize: 14,
              lineHeight: 1.55,
              border: m.sender === 'ai' ? `1px solid ${theme.border}` : 'none'
            }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: 8,
        borderRadius: 14,
        background: theme.inputBg,
        border: `1px solid ${theme.border}`
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('typeYourAnswer') || (lang === 'ar' ? 'اكتب إجابتك...' : 'Type your answer...')}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 15,
            padding: '12px 14px',
            background: 'transparent',
            color: theme.text
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '12px 22px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 15
          }}
        >
          {t('send') || 'Send'}
        </button>
      </div>
    </div>
  );
};

export default AICVBuilderPage;
