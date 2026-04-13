import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import FloatingLangBtn from './components/FloatingLangBtn';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import AdminPanel from './pages/AdminPanel';
import StudentDashboard from './pages/StudentDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import OtpPage from './pages/OtpPage';
import LoginOtpPage from './pages/LoginOtpPage';
import AICVBuilderPage from './pages/AICVBuilderPage';
import AIChatWidget from "./components/AIChatWidget";
import './index.css';

function AppContent() {
  const location = useLocation();
  const hideAIChat = location.pathname === '/' || location.pathname.startsWith('/admin');

  return (
    <>
      <FloatingLangBtn />
      {!hideAIChat && <AIChatWidget />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/login-otp" element={<LoginOtpPage />} />
        <Route path="/ai-cv" element={<AICVBuilderPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminPanel />} />
        
        {/* Student Routes */}
        <Route path="/student/*" element={<StudentDashboard />} />
        
        {/* Employer Routes */}
        <Route path="/employer/*" element={<EmployerDashboard />} />
        
        {/* Catch-all redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;
