import React from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FilterBar = () => {
  const { t, lang } = useLanguage();

  const filterKeys = [
    { key: 'category', label: t('category'), default: 'Any' },
    { key: 'jobType', label: t('jobType'), default: 'Any' },
    { key: 'expLevel', label: t('expLevel'), default: 'Any' },
    { key: 'salary', label: t('salaryPerDay'), default: 'Any' },
    { key: 'location', label: t('location'), default: 'Any' },
  ];

  return (
    <div className="filter-bar-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="filter-items">
        <div className="filter-main-icon">
          <Filter size={18} />
          <span>{t('filter')}</span>
        </div>
        
        {filterKeys.map((filter) => (
          <div key={filter.key} className="filter-dropdown">
            <span className="filter-label">{filter.label}</span>
            <div className="filter-select">
              <span>{filter.default}</span>
              <ChevronDown size={14} />
            </div>
          </div>
        ))}

        <button className="clear-all-btn">
          <X size={14} />
          <span>{t('resetAll')}</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .filter-bar-container {
          background: white;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 12px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          margin-bottom: 24px;
          position: sticky;
          top: 100px;
          z-index: 900;
        }

        .filter-items {
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .filter-main-icon {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--primary);
          font-weight: 800;
          font-size: 14px;
          padding-inline-end: 24px;
          border-inline-end: 1px solid var(--border);
        }

        .filter-dropdown {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-select {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
          cursor: pointer;
          transition: color 0.2s;
        }

        .filter-select:hover {
          color: var(--primary);
        }

        .clear-all-btn {
          margin-inline-start: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .clear-all-btn:hover {
          color: #EF4444;
          background: rgba(239, 68, 68, 0.05);
        }

        @media (max-width: 1024px) {
          .filter-items { gap: 20px; }
          .filter-main-icon { display: none; }
        }
      `}} />
    </div>
  );
};

export default FilterBar;
