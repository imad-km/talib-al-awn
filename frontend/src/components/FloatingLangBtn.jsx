import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import './FloatingLangBtn.css';

const FloatingLangBtn = () => {
  const { lang, toggleLanguage } = useLanguage();
  const location = useLocation();

  const showOn = ['/', '/login', '/register', '/otp', '/login-otp', '/forgot-password'];
  if (!showOn.includes(location.pathname)) return null;

  return (
    <button className="floating-lang-btn" onClick={toggleLanguage} title="Switch Language">
      <div className="button-content">
        <div className="icon-wrapper">
          <Globe size={18} />
        </div>
        <span className="lang-text">{lang === 'ar' ? 'English' : 'العربية'}</span>
      </div>
    </button>
  );
};

export default FloatingLangBtn;
