import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EmployerHome from './EmployerHome';
import EmployerJobs from './EmployerJobs';
import EmployerApplicants from './EmployerApplicants';
import Wallet from './Wallet';
import Inbox from './Inbox';
import ProfilePage from './ProfilePage';
import EmployerProfilePage from './EmployerProfilePage';
import SettingsPage from './SettingsPage';
import NotificationsPage from './NotificationsPage';
import { useLanguage } from '../context/LanguageContext';

const EmployerDashboard = () => {
  const { lang } = useLanguage();

  return (
    <div className="dashboard-container employer-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar role="employer" />
      <main className="dashboard-content">
        <Routes>
          <Route index element={<EmployerHome />} />
          <Route path="jobs" element={<EmployerJobs />} />
          <Route path="applicants" element={<EmployerApplicants />} />
          <Route path="wallet" element={<Wallet isEmployer={true} />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="my-profile" element={<EmployerProfilePage />} />
          <Route path="profile/:slug" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Routes>
      </main>
      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container {
          min-height: 100vh;
          background-color: var(--bg-main);
        }
        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px;
        }
      `}} />
    </div>
  );
};

export default EmployerDashboard;
