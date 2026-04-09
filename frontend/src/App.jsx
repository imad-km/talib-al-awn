import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <FloatingLangBtn />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/login-otp" element={<LoginOtpPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminPanel />} />
          
          {/* Student Routes */}
          <Route path="/student/*" element={<StudentDashboard />} />
          
          {/* Employer Routes */}
          <Route path="/employer/*" element={<EmployerDashboard />} />
          
          {/* Catch-all redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
