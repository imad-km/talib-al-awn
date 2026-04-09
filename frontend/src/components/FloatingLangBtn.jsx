import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './FloatingLangBtn.css';

const FloatingLangBtn = () => {
  const { lang, toggleLanguage } = useLanguage();
  const location = useLocation();

  // Only show on public pages — dashboards handle language via Settings
  const showOn = ['/', '/login', '/register', '/otp', '/login-otp', '/forgot-password'];
  if (!showOn.includes(location.pathname)) return null;

  return (
    <button className="floating-lang-btn" onClick={toggleLanguage} title="Switch Language">
      <span className="lang-text">{lang === 'ar' ? 'EN' : 'Ar'}</span>
    </button>
  );
};

export default FloatingLangBtn;
