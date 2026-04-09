import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import FilterSidebar from '../components/FilterSidebar';
import JobCard from '../components/JobCard';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const JOB_DATA = [
  {
    en:  { name: 'Cashier',           employer: 'Nakhla Café',            location: 'Algiers',       description: 'Part-time cashier needed at a café. Flexible hours that fit student schedules.', postedAgo: '20 min' },
    ar:  { name: 'أمين صندوق',        employer: 'مقهى النخلة',             location: 'الجزائر العاصمة', description: 'مطلوب أمين صندوق للعمل في مقهى بدوام جزئي. ساعات مرنة تناسب جدول الطلاب.', postedAgo: '20 دقيقة' },
    salary: '110 دج', workTime: '20 يوم', experience: 'Beginner',
  },
  {
    en:  { name: 'Private Tutor',     employer: 'Al-Amal Learning Center', location: 'Oran',         description: 'Teaching high-school mathematics. Subject experience required.', postedAgo: '3 hours' },
    ar:  { name: 'مدرّس خصوصي',       employer: 'مركز الأمل التعليمي',      location: 'وهران',        description: 'تدريس مادة الرياضيات لطلاب الثانوية. خبرة مطلوبة في المادة.', postedAgo: '3 ساعات' },
    salary: '150 دج', workTime: '10 أيام', experience: 'Expert',
  },
  {
    en:  { name: 'Admin Assistant',   employer: 'Ben Omar Accounting',     location: 'Constantine',  description: 'Part-time administrative assistant to support an accounting office team.', postedAgo: '1 day' },
    ar:  { name: 'مساعد إداري',       employer: 'مكتب بن عمر للمحاسبة',    location: 'قسنطينة',      description: 'مطلوب مساعد إداري لدعم فريق العمل في مكتب محاسبة بدوام جزئي.', postedAgo: '1 يوم' },
    salary: '130 دج', workTime: '15 يوم', experience: 'Beginner',
  },
  {
    en:  { name: 'Photographer',      employer: 'Al-Daw Studio',           location: 'Annaba',       description: 'Photographing social events and occasions. A professional camera is required.', postedAgo: '2 days' },
    ar:  { name: 'مصور فوتوغرافي',    employer: 'استوديو الضوء',            location: 'عنابة',        description: 'تصوير فعاليات ومناسبات اجتماعية. كاميرا احترافية مطلوبة.', postedAgo: '2 أيام' },
    salary: '200 دج', workTime: '5 أيام', experience: 'Medium',
  },
  {
    en:  { name: 'Kitchen Assistant', employer: 'Al-Asala Restaurant',     location: 'Setif',        description: 'Support the kitchen team at a popular restaurant. No experience needed, training provided.', postedAgo: '45 min' },
    ar:  { name: 'مساعد طباخ',        employer: 'مطعم الأصالة',             location: 'سطيف',         description: 'دعم طاقم المطبخ في مطعم شهير. لا خبرة مطلوبة، تدريب متوفر.', postedAgo: '45 دقيقة' },
    salary: '90 دج', workTime: '30 يوم', experience: 'Beginner',
  },
  {
    en:  { name: 'Sales Rep',         employer: 'Nova Tech Company',       location: 'Tlemcen',      description: 'Promoting a startup\'s products and visiting clients. Excellent communication skills required.', postedAgo: '5 hours' },
    ar:  { name: 'مندوب مبيعات',      employer: 'شركة نوفا للتقنية',        location: 'تلمسان',       description: 'الترويج لمنتجات شركة ناشئة وزيارة العملاء. مهارات تواصل ممتازة مطلوبة.', postedAgo: '5 ساعات' },
    salary: '120 دج', workTime: '12 يوم', experience: 'Medium',
  },
];

const FindJobs = () => {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');

  const SAMPLE_JOBS = JOB_DATA.map(j => ({ ...j[lang], salary: j.salary, workTime: j.workTime, experience: j.experience }));

  const q = search.toLowerCase();
  const filtered = SAMPLE_JOBS.filter(j =>
    !q ||
    j.name.toLowerCase().includes(q) ||
    j.location.toLowerCase().includes(q) ||
    j.description.toLowerCase().includes(q) ||
    (j.employer || '').toLowerCase().includes(q)
  );

  return (
    <div className="find-jobs-page">
      <div className="fj-hero">
        <div className="fj-hero-text">
          <h1 className="fj-title">{t('findJobNow')}</h1>
          <p className="fj-sub">{t('heroSubtitle')}</p>
        </div>
        <div className="fj-stat-chips">
          <div className="fj-chip">
            <span className="chip-num">6</span>
            <span className="chip-lbl">{t('jobsAvailableLabel')}</span>
          </div>
          <div className="fj-chip">
            <span className="chip-num">4</span>
            <span className="chip-lbl">{t('citiesLabel')}</span>
          </div>
        </div>
      </div>

      <div className="search-row">
        <div className="search-capsule">
          <MagnifyingGlassIcon className="search-icon-dim" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="search-input-field"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="search-btn-purple">{t('searchBtn')}</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="sidebar-col">
          <FilterSidebar />
        </div>
        <div className="main-col">
          <div className="results-bar">
            <span className="results-count">{filtered.length} {t('jobsFoundLabel')}</span>
            <button className="sort-btn">
              <AdjustmentsHorizontalIcon className="sort-icon" />
              {t('sortBtn')}
            </button>
          </div>
          <div className="jobs-list">
            {filtered.length > 0 ? (
              filtered.map((job, i) => <JobCard key={i} job={job} />)
            ) : (
              <div className="empty-jobs">
                <p>{t('noJobsMatch')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .find-jobs-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ── Hero ── */
        .fj-hero {
          background: linear-gradient(135deg, #EBEBFF 0%, #EEF2FF 100%);
          border-radius: 20px;
          padding: 48px 48px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          border: 1px solid #DDD6FE;
        }

        .fj-title {
          font-size: 40px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 8px;
          line-height: 1.15;
        }

        .fj-sub {
          font-size: 16px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
        }

        .fj-stat-chips {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .fj-chip {
          background: white;
          border: 1px solid #DDD6FE;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 90px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(109, 40, 217, 0.06);
        }

        .chip-num {
          font-size: 26px;
          font-weight: 900;
          color: #6D28D9;
          line-height: 1;
        }

        .chip-lbl {
          font-size: 11px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ── Search ── */
        .search-row {
          margin: 0;
        }

        .search-capsule {
          background: white;
          border: 1.5px solid #E2E8F0;
          border-radius: 100px;
          padding: 8px 8px 8px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-capsule:focus-within {
          border-color: #8B5CF6;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.12);
        }

        .search-icon-dim {
          width: 20px;
          height: 20px;
          color: #94A3B8;
          flex-shrink: 0;
        }

        .search-input-field {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 15px;
          color: #1E293B;
          outline: none;
          font-family: inherit;
        }

        .search-btn-purple {
          background: #5B21B6;
          color: white;
          border: none;
          padding: 13px 40px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .search-btn-purple:hover { background: #4C1D95; }

        /* ── Grid ── */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 32px;
          align-items: start;
        }

        .sidebar-col {
          position: sticky;
          top: 100px;
        }

        /* ── Results bar ── */
        .results-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .results-count {
          font-size: 14px;
          font-weight: 700;
          color: #64748B;
        }

        .sort-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sort-btn:hover { border-color: #8B5CF6; color: #6D28D9; }

        .sort-icon {
          width: 16px;
          height: 16px;
        }

        .jobs-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .empty-jobs {
          grid-column: span 2;
          text-align: center;
          padding: 60px;
          color: #94A3B8;
          font-weight: 600;
          background: white;
          border-radius: 16px;
          border: 1px dashed #E2E8F0;
        }

        [dir="rtl"] .search-capsule {
          padding: 8px 24px 8px 8px;
        }

        @media (max-width: 1100px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .sidebar-col { position: static; }
          .jobs-list { grid-template-columns: 1fr 1fr; }
          .fj-hero { flex-direction: column; align-items: flex-start; }
          .fj-stat-chips { width: 100%; }
        }

        @media (max-width: 640px) {
          .jobs-list { grid-template-columns: 1fr; }
          .fj-title { font-size: 28px; }
          .fj-hero { padding: 28px 24px; }
        }
      `}} />
    </div>
  );
};

export default FindJobs;
