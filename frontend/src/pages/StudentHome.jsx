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

  const STATS = [
    { title: t('activeApps'), value: "3", icon: ClockIcon, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', delta: '2 maturing soon' },
    { title: t('avgRating'), value: "4.7 ★", icon: StarIcon, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', delta: 'Based on 5 reviews' },
    { title: t('wallet'), value: "12,500 Da", icon: BanknotesIcon, color: '#10B981', bg: '#f0fdf4', border: '#bbf7d0', delta: 'Total available' },
    { title: t('completedJobs'), value: "12", icon: CheckCircleIcon, color: '#6366F1', bg: '#eff6ff', border: '#dbeafe', delta: '+2 this month' },
  ];

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="student-home" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Avatar */}
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff', boxShadow: '0 8px 24px rgba(124,58,237,0.25)', flexShrink: 0 }}>
            {student.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Welcome back</p>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{firstName}</h1>
            {/* Uni + location pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 2 }}>
              {student.university && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#7c3aed', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '3px 10px', borderRadius: 100 }}>
                  <AcademicCapIcon style={{ width: 13, height: 13 }} />{student.university}
                </span>
              )}
              {student.wilaya && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#0891b2', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '3px 10px', borderRadius: 100 }}>
                  <MapPinIcon style={{ width: 13, height: 13 }} />{student.wilaya}
                </span>
              )}
              <span style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', alignSelf: 'center' }}>{today}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{ background: '#fff', border: `1.5px solid ${stat.border}`, borderRadius: 20, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.09)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 22, height: 22, color: stat.color }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: stat.color, background: stat.bg, padding: '4px 10px', borderRadius: 100, border: `1px solid ${stat.border}` }}>
                  Live
                </span>
              </div>
              <div>
                <p style={{ fontSize: 34, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', lineHeight: 1, letterSpacing: '-1px' }}>{stat.value}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', margin: '0 0 4px' }}>{stat.title}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 500 }}>{stat.delta}</p>
              </div>
            </div>
          );
        })}
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
