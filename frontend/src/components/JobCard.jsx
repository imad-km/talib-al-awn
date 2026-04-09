import React, { useState } from 'react';
import { MapPin, Star, Clock, Banknote, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ApplyModal from './ApplyModal';

const AVATAR_GRADIENTS = [
  ['#C4B5FD', '#8B5CF6'],
  ['#A5B4FC', '#6366F1'],
  ['#6EE7B7', '#10B981'],
  ['#FCD34D', '#F59E0B'],
  ['#FCA5A5', '#EF4444'],
];

const JobCard = ({ job }) => {
  const { t, lang } = useLanguage();
  const isRtl = lang === 'ar';
  const [showApply, setShowApply] = useState(false);
  const [liked, setLiked] = useState(false);

  const seed = (job.employer || job.name || 'E').charCodeAt(0);
  const [gradFrom, gradTo] = AVATAR_GRADIENTS[seed % AVATAR_GRADIENTS.length];
  const initial = (job.employer || job.name || 'E').charAt(0).toUpperCase();

  const expLabel = {
    beginner: isRtl ? 'مبتدئ' : 'Beginner',
    medium:   isRtl ? 'متوسط' : 'Medium',
    expert:   isRtl ? 'خبير'  : 'Expert',
  }[job.experience?.toLowerCase()] || job.experience || '—';

  return (
    <>
      <div className={`jc-card ${isRtl ? 'rtl' : 'ltr'}`}>
        <span className="jc-sparkle sp1">✦</span>
        <span className="jc-sparkle sp2">✦</span>
        <span className="jc-sparkle sp3">✦</span>

        <div className="jc-header">
          <div className="jc-avatar" style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
            {job.employerAvatar
              ? <img src={job.employerAvatar} alt={initial} className="jc-avatar-img" />
              : <span className="jc-avatar-letter">{initial}</span>
            }
          </div>

          <div className="jc-title-block">
            <h3 className="jc-job-title">{job.name || '—'}</h3>
            <div className="jc-location">
              <MapPin size={11} strokeWidth={2.5} />
              <span>{job.location || '—'}</span>
            </div>
            {job.employer && (
              <div className="jc-employer-tag">
                <User size={10} strokeWidth={2.5} />
                <span>{job.employer}</span>
              </div>
            )}
          </div>

          <div className="jc-header-actions">
            <button
              className={`jc-like-btn ${liked ? 'liked' : ''}`}
              onClick={() => setLiked(v => !v)}
              aria-label="save"
            >
              <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <div className="jc-badge">{t('partTime')}</div>
          </div>
        </div>

        <p className="jc-desc">{job.description || '—'}</p>

        <div className="jc-stats">
          <div className="jc-stat">
            <span className="jc-stat-icon icon-star">
              <Star size={13} strokeWidth={2} />
            </span>
            <div className="jc-stat-text">
              <span className="jc-stat-label">{t('expNeeded')}</span>
              <span className="jc-stat-val">{expLabel}</span>
            </div>
          </div>
          <div className="jc-stat-divider" />
          <div className="jc-stat">
            <span className="jc-stat-icon icon-clock">
              <Clock size={13} strokeWidth={2} />
            </span>
            <div className="jc-stat-text">
              <span className="jc-stat-label">{t('workTime')}</span>
              <span className="jc-stat-val">{job.workTime || '—'}</span>
            </div>
          </div>
          <div className="jc-stat-divider" />
          <div className="jc-stat">
            <span className="jc-stat-icon icon-money">
              <Banknote size={13} strokeWidth={2} />
            </span>
            <div className="jc-stat-text">
              <span className="jc-stat-label">{t('dailySalary')}</span>
              <span className="jc-stat-val">{job.salary || '—'}</span>
            </div>
          </div>
        </div>

        <div className="jc-footer">
          <span className="jc-posted">
            {t('postedTime').replace('{time}', job.postedAgo || (isRtl ? '20 دقيقة' : '20 min'))}
          </span>
          <button className="jc-apply-btn" onClick={() => setShowApply(true)}>
            {t('apply')}
          </button>
        </div>
      </div>

      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        .jc-card {
          position: relative;
          background: linear-gradient(145deg, #F5F0FF 0%, #EDE9FE 60%, #E9E3FD 100%);
          border: 1.5px solid rgba(196, 181, 253, 0.5);
          border-radius: 22px;
          padding: 22px 22px 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow: hidden;
          cursor: default;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.25s ease,
                      border-color 0.25s ease;
          will-change: transform;
        }
        .jc-card:hover {
          transform: translateY(-6px) scale(1.012);
          box-shadow:
            0 20px 50px rgba(109, 40, 217, 0.16),
            0 6px 20px rgba(109, 40, 217, 0.10),
            inset 0 1px 0 rgba(255,255,255,0.8);
          border-color: rgba(139, 92, 246, 0.6);
        }

        /* Sparkle decorations */
        .jc-sparkle {
          position: absolute;
          font-size: 14px;
          color: rgba(167, 139, 250, 0.4);
          pointer-events: none;
          transition: opacity 0.25s, transform 0.25s;
          line-height: 1;
        }
        .jc-card:hover .jc-sparkle { opacity: 0.9; }
        .sp1 { top: 16px; left: 50%; font-size: 10px; color: rgba(196,181,253,0.5); }
        .sp2 { bottom: 60px; right: 18px; font-size: 8px; color: rgba(167,139,250,0.35); }
        .sp3 { top: 50%; left: 22px; font-size: 7px; color: rgba(196,181,253,0.4); }

        /* Header */
        .jc-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .jc-avatar {
          width: 52px; height: 52px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(109, 40, 217, 0.25);
          transition: transform 0.25s;
        }
        .jc-card:hover .jc-avatar { transform: scale(1.08); }
        .jc-avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .jc-avatar-letter {
          font-size: 20px; font-weight: 800;
          color: white; text-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .jc-title-block {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column; gap: 3px;
        }
        .jc-job-title {
          font-size: 17px; font-weight: 800;
          color: #1E1B4B; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .jc-location {
          display: flex; align-items: center; gap: 4px;
          color: #6B7280; font-size: 11px; font-weight: 600;
        }
        .jc-employer-tag {
          display: flex; align-items: center; gap: 3px;
          color: #8B5CF6; font-size: 11px; font-weight: 700;
          margin-top: 1px;
        }
        .jc-header-actions {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 8px; flex-shrink: 0;
        }
        .jc-like-btn {
          background: rgba(255,255,255,0.7);
          border: 1.5px solid rgba(196,181,253,0.5);
          border-radius: 50%;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #C4B5FD;
          transition: color 0.2s, background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .jc-like-btn:hover { transform: scale(1.15); border-color: #8B5CF6; color: #7C3AED; background: white; }
        .jc-like-btn.liked { color: #E45454; border-color: #FCA5A5; background: #FFF5F5; }
        .jc-badge {
          background: rgba(255,255,255,0.75);
          border: 1.5px solid rgba(196,181,253,0.6);
          border-radius: 100px;
          padding: 3px 10px;
          font-size: 11px; font-weight: 700;
          color: #6D28D9;
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }

        /* Description */
        .jc-desc {
          font-size: 13px; line-height: 1.6;
          color: #4B5563; margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Stats */
        .jc-stats {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(221,214,254,0.7);
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 0;
          backdrop-filter: blur(8px);
        }
        .jc-stat {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .jc-stat-divider {
          width: 1px; height: 32px;
          background: rgba(196,181,253,0.4);
          flex-shrink: 0;
          margin: 0 4px;
        }
        .jc-stat-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .icon-star  { background: #FEF9C3; color: #D97706; }
        .icon-clock { background: #FFEDD5; color: #EA580C; }
        .icon-money { background: #DCFCE7; color: #16A34A; }
        .jc-stat-text {
          display: flex; flex-direction: column; gap: 1px;
          min-width: 0;
        }
        .jc-stat-label {
          font-size: 10px; font-weight: 700;
          color: #9CA3AF; text-transform: uppercase;
          white-space: nowrap; letter-spacing: 0.3px;
        }
        .jc-stat-val {
          font-size: 13px; font-weight: 800;
          color: #1E1B4B;
          white-space: nowrap;
        }

        /* Footer */
        .jc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2px;
        }
        .jc-posted {
          font-size: 11px; font-weight: 600;
          color: #9CA3AF;
        }
        .jc-apply-btn {
          background: linear-gradient(135deg, #8B5CF6, #6D28D9);
          color: white;
          border: none;
          border-radius: 100px;
          padding: 9px 26px;
          font-size: 13px; font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(109, 40, 217, 0.3);
        }
        .jc-apply-btn:hover {
          opacity: 0.92;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(109, 40, 217, 0.4);
        }
        .jc-apply-btn:active { transform: translateY(0); }

        /* RTL */
        .jc-card.rtl .jc-header { direction: rtl; }
        .jc-card.rtl .jc-footer { direction: rtl; }
        .jc-card.rtl .jc-stats  { direction: rtl; }
        .jc-card.rtl .jc-desc   { direction: rtl; }
        .jc-card.rtl .sp1 { left: auto; right: 50%; }
        .jc-card.rtl .sp2 { right: auto; left: 18px; }
        .jc-card.rtl .sp3 { left: auto; right: 22px; }
      `}} />
    </>
  );
};

export default JobCard;
