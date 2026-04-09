import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StudentHome from './StudentHome';
import FindJobs from './FindJobs';
import Applications from './Applications';
import Wallet from './Wallet';
import Inbox from './Inbox';
import ProfilePage from './ProfilePage';
import MyProfilePage from './MyProfilePage';
import SettingsPage from './SettingsPage';
import NotificationsPage from './NotificationsPage';
import { useLanguage } from '../context/LanguageContext';

const StudentDashboard = () => {
  const { lang } = useLanguage();

  return (
    <div className="dashboard-container student-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar role="student" />
      <main className="dashboard-content">
        <Routes>
          <Route index element={<StudentHome />} />
          <Route path="find-jobs" element={<FindJobs />} />
          <Route path="applications" element={<Applications />} />
          <Route path="wallet" element={<Wallet isEmployer={false} />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="profile/:slug" element={<ProfilePage />} />
          <Route path="my-profile" element={<MyProfilePage />} />
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

export default StudentDashboard;
