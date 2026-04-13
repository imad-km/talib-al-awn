import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Star, Clock, Banknote, Heart, MoreHorizontal, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ApplyModal from './ApplyModal';

const JobCard = ({ job = {} }) => {
  const { t, lang } = useLanguage();
  const isRtl = lang === 'ar';
  const [showApply, setShowApply] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowDetailsPopup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fallbacks for the premium aesthetic requested by user
  const employerName = job.employer || 'PixelTech Global';
  const jobTitle = job.name || 'Senior Product Designer';
  const location = job.location || 'New York City, NY';
  const description = job.description || 'Lead the design direction for our core user-facing platforms, platforms, creative and impactful experiences.';
  
  const expLabel = {
    beginner: isRtl ? 'مبتدئ' : 'Beginner',
    medium:   isRtl ? 'متوسط' : 'Medium',
    expert:   isRtl ? 'خبير'  : 'Expert',
  }[job.experience?.toLowerCase()] || job.experience || '5+ Years Exp';

  const workTime = job.workTime || 'Full-time';
  const salary = job.salary || '$350/Day';
  const postedAgo = job.postedAgo || '2 days ago';

  const typeLabel = {
    partTime: isRtl ? 'دوام جزئي' : 'Part Time',
    fullTime: isRtl ? 'دوام كامل' : 'Full Time'
  }[job.type] || job.type || 'Full Time';

  const initial = employerName.charAt(0).toUpperCase();

  return (
    <>
      <div className={`jc-supercard-wrapper ${isRtl ? 'rtl' : 'ltr'}`}>
        {/* Render only the component (Background elements moved to global scope) */}

        <div className="jc-supercard">
          {/* Header Section */}
          <div className="jc-header">
            <div className="jc-header-left">
              <div className="jc-avatar-container">
                <div className="jc-avatar-halo">
                  <div className="jc-avatar-inner">
                    {job.employerAvatar ? (
                      <img src={job.employerAvatar} alt={initial} />
                    ) : (
                      <span className="jc-avatar-letter">{initial}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="jc-title-area">
                <h3 className="jc-title">{jobTitle}</h3>
                <div className="jc-subtitle">
                  <span className="jc-employer">{employerName}</span>
                  <span className="jc-dot">•</span>
                  <MapPin size={14} className="jc-icon-pin" strokeWidth={2.5} />
                  <span className="jc-location">{location}</span>
                </div>
              </div>
            </div>

            <div className="jc-header-right">
              <div className="jc-type-badge">
                {typeLabel}
              </div>
              <div ref={popupRef} style={{ position: 'relative' }}>
                <button 
                  className="jc-more-btn" 
                  onClick={() => setShowDetailsPopup(!showDetailsPopup)}
                >
                  <MoreHorizontal size={20} color="#9ca3af" />
                </button>

                {showDetailsPopup && (
                  <div className="jc-details-popup">
                    <h4 className="jc-popup-title">{t('jobDetails') || 'Job Details'}</h4>
                    <div className="jc-popup-item">
                      <span className="jc-popup-lbl">{t('employerProfile') || 'View Profile'}:</span>
                      <a href={`/employer/${job.employerId || 1}`} className="jc-popup-link" target="_blank" rel="noreferrer">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    <div className="jc-popup-item">
                      <span className="jc-popup-lbl">{t('category') || 'Category'}:</span>
                      <span className="jc-popup-val">{job.category || 'N/A'}</span>
                    </div>
                    <div className="jc-popup-item">
                      <span className="jc-popup-lbl">{t('jobType') || 'Type'}:</span>
                      <span className="jc-popup-val">{typeLabel}</span>
                    </div>
                    <div className="jc-popup-item">
                      <span className="jc-popup-lbl">{t('wilaya') || 'Wilaya'}:</span>
                      <span className="jc-popup-val">{job.wilaya || 'N/A'}</span>
                    </div>
                    <div className="jc-popup-item">
                      <span className="jc-popup-lbl">{t('workTime') || 'Work Time'}:</span>
                      <span className="jc-popup-val">{workTime}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="jc-body">
            <p className="jc-description">{description}</p>
          </div>

          {/* Job Details (Tags) Section */}
          <div className="jc-tags">
            <div className="jc-tag">
              <Star size={15} className="jc-tag-icon" strokeWidth={2} />
              <span>{expLabel}</span>
            </div>
            <div className="jc-tag">
              <Clock size={15} className="jc-tag-icon" strokeWidth={2} />
              <span>{workTime}</span>
            </div>
            <div className="jc-tag">
              <Banknote size={15} className="jc-tag-icon" strokeWidth={2} />
              <span>{salary}</span>
            </div>
          </div>

          {/* Footer Section */}
          <div className="jc-footer">
    <div className="jc-posted-time">
      {t('stats.postedTime', `Posted ${postedAgo}`).replace('{time}', postedAgo)}
    </div>
            <div className="jc-actions">
              <button
                className={`jc-heart-btn ${liked ? 'liked' : ''}`}
                onClick={() => setLiked(!liked)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Heart size={18} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : '#9ca3af'} strokeWidth={liked ? 0 : 2} />
              </button>
              <button className="jc-apply" onClick={() => setShowApply(true)}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        /* Parent Wrapper */
        .jc-supercard-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          z-index: 1;
        }

        /* Base Card styling - Premium aesthetic */
        .jc-supercard {
          position: relative;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 1);
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 2;
        }

        .jc-supercard:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.06),
            0 10px 20px rgba(0, 0, 0, 0.04),
            0 0 0 1px rgba(255, 255, 255, 1),
            inset 0 1px 0 rgba(255, 255, 255, 1);
        }

        /* Header */
        .jc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .jc-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .jc-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .jc-type-badge {
          background: rgba(124, 58, 237, 0.1);
          color: #7C3AED;
          border: 1px solid rgba(124, 58, 237, 0.2);
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .jc-more-btn {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .jc-more-btn:hover {
          background: rgba(0,0,0,0.04);
          border-color: rgba(0,0,0,0.1);
        }

        .jc-details-popup {
          position: absolute;
          top: calc(100% + 8px);
          inset-inline-end: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px;
          min-width: 220px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .jc-popup-title {
          margin: 0 0 4px 0;
          font-size: 15px;
          font-weight: 800;
          color: #0F172A;
          border-bottom: 2px solid #F1F5F9;
          padding-bottom: 8px;
        }

        .jc-popup-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .jc-popup-lbl {
          color: #64748B;
          font-weight: 600;
        }

        .jc-popup-val {
          color: #1E293B;
          font-weight: 800;
        }
        
        .jc-popup-link {
          color: #7C3AED;
          font-weight: 800;
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        .jc-popup-link:hover {
          text-decoration: underline;
        }

        /* Avatar Section */
        .jc-avatar-container {
          position: relative;
          flex-shrink: 0;
        }
        .jc-avatar-halo {
          width: 60px; height: 60px;
          border-radius: 50%;
          padding: 3px;
          background: conic-gradient(from 0deg, var(--primary), var(--accent), var(--secondary), var(--primary));
          animation: rotate-halo 5s linear infinite;
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
        }
        @keyframes rotate-halo {
          100% { transform: rotate(360deg); }
        }
        .jc-avatar-inner {
          width: 100%; height: 100%;
          background: #ffffff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          animation: counter-rotate 5s linear infinite;
        }
        @keyframes counter-rotate {
          100% { transform: rotate(-360deg); }
        }
        .jc-avatar-inner img { width: 100%; height: 100%; object-fit: cover; }
        .jc-avatar-letter {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 28px;
          font-weight: 900;
        }

        /* Title Area */
        .jc-title-area {
          display: flex; flex-direction: column; gap: 4px;
        }
        .jc-title {
          font-size: 20px;
          font-weight: 800;
          color: #1f2937;
          margin: 0;
          letter-spacing: -0.3px;
        }
        .jc-subtitle {
          display: flex; align-items: center; gap: 6px;
          color: #6b7280;
          font-size: 13px;
          font-weight: 500;
        }
        .jc-employer {
          font-weight: 700;
          color: #4b5563;
        }
        .jc-dot { color: #d1d5db; font-size: 18px; }
        .jc-icon-pin { color: #9ca3af; margin-right: -2px; }
        .jc-location { font-weight: 500; }

        /* Description Body */
        .jc-body { margin-bottom: 20px; }
        .jc-description {
          font-size: 15px;
          line-height: 1.5;
          color: #4b5563;
          margin: 0;
          font-weight: 400;
        }

        /* Tags Section */
        .jc-tags {
          display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px;
        }
        .jc-tag {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .jc-tag-icon { color: #9ca3af; }

        /* Footer Section */
        .jc-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 6px;
        }
        .jc-posted-time {
          font-size: 12.5px;
          color: #9ca3af;
          font-weight: 500;
        }
        .jc-actions {
          display: flex; align-items: center; gap: 10px;
        }
        .jc-heart-btn {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }
        .jc-heart-btn:hover {
          border-color: #d1d5db;
          box-shadow: 0 6px 14px rgba(0,0,0,0.06);
        }
        .jc-heart-btn.liked {
          border-color: #fecaca;
          background: #fff5f5;
        }

        .jc-apply {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%);
          background-size: 200% 200%;
          color: white;
          border: none;
          border-radius: 14px;
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.35), inset 0 1px 0 rgba(255,255,255,0.3);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          animation: gradient-shift 5s ease infinite;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .jc-apply::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          transition: none;
        }
        .jc-apply:hover {
          transform: translateY(-1.5px) scale(1.01);
          box-shadow: 0 8px 18px rgba(147, 51, 234, 0.4), inset 0 1px 0 rgba(255,255,255,0.4);
        }
        .jc-apply:hover::before {
          animation: shine 1.5s ease;
        }
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* RTL Specific Adjustments */
        .jc-supercard-wrapper.rtl { direction: rtl; }
        .jc-supercard-wrapper.rtl .jc-shard-1 { left: auto; right: -15px; transform: scaleX(-1) rotate(20deg); }
        .jc-supercard-wrapper.rtl .jc-shard-2 { right: auto; left: -15px; transform: scaleX(-1) rotate(50deg); }
        .jc-supercard-wrapper.rtl .jc-particle-1 { right: auto; left: -8px; }
        .jc-supercard-wrapper.rtl .jc-particle-2 { left: auto; right: 30px; }
        .jc-supercard-wrapper.rtl .jc-icon-pin { margin-right: 0; margin-left: -2px; }
      `}} />
    </>
  );
};

export default JobCard;
