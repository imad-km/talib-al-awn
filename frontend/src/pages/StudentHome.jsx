import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import StatCard from '../components/StatCard';
import JobCard from '../components/JobCard';
import {
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  BanknotesIcon,
  ArrowRightIcon,
  FireIcon,
  BoltIcon,
  AcademicCapIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const PROFILE_KEY = 'ta_my_profile';
const DEFAULT_STUDENT = { name: 'Student', university: '', wilaya: '' };
function loadStudent() {
  try {
    const s = localStorage.getItem(PROFILE_KEY);
    return s ? { ...DEFAULT_STUDENT, ...JSON.parse(s) } : { ...DEFAULT_STUDENT };
  } catch { return { ...DEFAULT_STUDENT }; }
}

const JOB_DATA_HOME = [
  {
    en: { name: 'Store Assistant',   employer: 'Sidi Mhamed Store',     location: 'Sidi Mhamed', description: 'Part-time store assistant needed in the Sidi Mhamed area.',                          postedAgo: '20 min' },
    ar: { name: 'مساعد متجر',         employer: 'متجر سيدي مهامد',        location: 'سيدي مهامد',  description: 'مطلوب مساعد متجر للعمل بدوام جزئي في منطقة سيدي مهامد.',                          postedAgo: '20 دقيقة' },
    salary: '120 دج', workTime: '5 أيام', experience: 'Beginner',
  },
  {
    en: { name: 'Delivery Driver',   employer: 'Fast Delivery Co.',     location: 'Hydra',       description: 'Delivery driver needed in the Hydra area. A driving licence is required.',          postedAgo: '2 hours' },
    ar: { name: 'سائق توصيل',         employer: 'شركة التوصيل السريع',    location: 'حيدرة',       description: 'مطلوب سائق توصيل طلبات في منطقة حيدرة. رخصة قيادة مطلوبة.',                        postedAgo: '2 ساعات' },
    salary: '150 دج', workTime: '10 أيام', experience: 'Medium',
  },
];

const ACTIVITY_DATA = [
  {
    en: { role: 'Customer Support Representative', company: 'Ooredoo Algeria' },
    ar: { role: 'ممثل خدمة العملاء',               company: 'أوريدو الجزائر'   },
    status: 'pending', dot: 'dot-amber',
  },
  {
    en: { role: 'Logistics Assistant', company: 'Yassir' },
    ar: { role: 'مساعد لوجستي',         company: 'ياسير'  },
    status: 'accepted', dot: 'dot-emerald',
  },
  {
    en: { role: 'Sales Assistant', company: 'Techno Store' },
    ar: { role: 'مساعد مبيعات',    company: 'تكنو ستور'  },
    status: 'rejected', dot: 'dot-violet',
  },
];

const StudentHome = () => {
  const { t, lang } = useLanguage();
  const [student] = useState(loadStudent);

  const firstName = student.name?.split(' ')[0] || 'Student';

  const sampleJobs = JOB_DATA_HOME.map(j => ({ ...j[lang], salary: j.salary, workTime: j.workTime, experience: j.experience }));
  const activities = ACTIVITY_DATA.map(a => ({ ...a[lang], status: a.status, dot: a.dot }));

  return (
    <div className="student-home">
      <div className="welcome-banner">
        <div className="welcome-text">
          <span className="welcome-badge">
            <BoltIcon className="badge-icon" />
            {t('home')}
          </span>
          <h1 className="welcome-title">👋 Welcome back, {firstName}!</h1>
          <div className="welcome-meta">
            {student.university && (
              <span className="welcome-meta-item">
                <AcademicCapIcon style={{ width: 14, height: 14 }} />
                {student.university}
              </span>
            )}
            {student.wilaya && (
              <span className="welcome-meta-item">
                <MapPinIcon style={{ width: 14, height: 14 }} />
                {student.wilaya}
              </span>
            )}
          </div>
          <p className="welcome-sub">{t('welcomeSub')}</p>
        </div>
        <div className="welcome-illustration">
          <div className="illo-avatar">{student.name?.[0]?.toUpperCase() || 'S'}</div>
          <div className="illo-circle c1" />
          <div className="illo-circle c2" />
          <div className="illo-circle c3" />
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title={t('activeApps')} value="3" icon={ClockIcon} color="#7C3AED" />
        <StatCard title={t('avgRating')} value="4.7 ★" icon={StarIcon} color="#F59E0B" />
        <StatCard title={t('wallet')} value="12,500 Da" icon={BanknotesIcon} color="#10B981" />
        <StatCard title={t('completedJobs')} value="12" icon={CheckCircleIcon} color="#6366F1" />
      </div>

      <div className="home-sections">
        <section className="home-section">
          <div className="section-header">
            <div className="section-title-group">
              <FireIcon className="section-icon" />
              <h2 className="section-title">{t('recommendedJobs')}</h2>
            </div>
            <button className="view-link">
              {t('viewAll')}
              <ArrowRightIcon className="link-arrow" />
            </button>
          </div>
          <div className="jobs-compact-list">
            {sampleJobs.map((job, i) => (
              <JobCard key={i} job={job} />
            ))}
          </div>
        </section>

        <section className="home-section activity-section">
          <div className="section-header">
            <div className="section-title-group">
              <ClockIcon className="section-icon" />
              <h2 className="section-title">{t('activeApps')}</h2>
            </div>
          </div>
          <div className="activity-list">
            {activities.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className={`activity-dot ${a.dot}`} />
                <div className="activity-info">
                  <span className="activity-role">{a.role}</span>
                  <span className="activity-company">{a.company}</span>
                </div>
                <span className={`activity-status status-${a.status}`}>
                  {t(`status${a.status.charAt(0).toUpperCase() + a.status.slice(1)}`)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .student-home {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* ── Welcome Banner ── */
        .welcome-banner {
          background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%);
          border-radius: 24px;
          padding: 40px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
          min-height: 180px;
        }

        .welcome-text {
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1;
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(124, 58, 237, 0.3);
          border: 1px solid rgba(139, 92, 246, 0.4);
          color: #A78BFA;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 5px 12px;
          border-radius: 100px;
          width: fit-content;
        }

        .badge-icon {
          width: 14px;
          height: 14px;
        }

        .welcome-title {
          font-size: 30px;
          font-weight: 900;
          color: white;
          margin: 0;
          line-height: 1.2;
        }

        .welcome-sub {
          font-size: 14px;
          color: #94A3B8;
          margin: 0;
          max-width: 420px;
          line-height: 1.6;
        }

        .welcome-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 2px;
        }

        .welcome-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          color: #C4B5FD;
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.25);
          padding: 4px 10px;
          border-radius: 100px;
        }

        .welcome-illustration {
          position: absolute;
          inset-inline-end: 48px;
          top: 50%;
          transform: translateY(-50%);
          width: 200px;
          height: 200px;
          pointer-events: none;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .illo-avatar {
          position: relative;
          z-index: 2;
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          font-size: 36px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 6px rgba(124,58,237,0.25), 0 16px 40px rgba(0,0,0,0.3);
        }

        .illo-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.18;
        }

        .c1 {
          width: 160px; height: 160px;
          background: radial-gradient(circle, #7C3AED, transparent);
          top: 0; right: 0;
        }
        .c2 {
          width: 100px; height: 100px;
          background: radial-gradient(circle, #6366F1, transparent);
          bottom: 10px; right: 50px;
        }
        .c3 {
          width: 60px; height: 60px;
          background: radial-gradient(circle, #A78BFA, transparent);
          top: 20px; right: 120px;
        }

        /* ── Stats ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── Sections ── */
        .home-sections {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .home-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-icon {
          width: 20px;
          height: 20px;
          color: var(--primary, #7C3AED);
        }

        .section-title {
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .view-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--primary, #7C3AED);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          padding: 0;
        }

        .link-arrow {
          width: 14px;
          height: 14px;
        }

        [dir="rtl"] .link-arrow { transform: scaleX(-1); }

        .jobs-compact-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        @media (max-width: 768px) {
          .jobs-compact-list { grid-template-columns: 1fr; }
          .welcome-banner { padding: 28px 24px; }
          .welcome-title { font-size: 22px; }
        }

        /* ── Activity Section ── */
        .activity-section {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 24px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #F1F5F9;
        }

        .activity-item:last-child { border-bottom: none; }

        .activity-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dot-amber  { background: #F59E0B; box-shadow: 0 0 0 3px #FEF3C7; }
        .dot-emerald { background: #10B981; box-shadow: 0 0 0 3px #D1FAE5; }
        .dot-violet { background: #7C3AED; box-shadow: 0 0 0 3px #EDE9FE; }

        .activity-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .activity-role {
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
        }

        .activity-company {
          font-size: 12px;
          color: #94A3B8;
          font-weight: 600;
        }

        .activity-status {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          padding: 4px 10px;
          border-radius: 100px;
        }

        .status-pending  { background: #FEF3C7; color: #D97706; }
        .status-accepted { background: #D1FAE5; color: #059669; }
        .status-rejected { background: #FFE4E6; color: #E11D48; }
      `}} />
    </div>
  );
};

export default StudentHome;
