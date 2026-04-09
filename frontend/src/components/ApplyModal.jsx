import React, { useState } from 'react';
import { XMarkIcon, BriefcaseIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

const ApplyModal = ({ job, onClose }) => {
  const { t, lang } = useLanguage();
  const isRtl = lang === 'ar';
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ coverLetter: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep('success');
  };

  return (
    <div className="am-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`am-modal ${isRtl ? 'rtl' : 'ltr'}`}>
        <button className="am-close" onClick={onClose}>
          <XMarkIcon style={{ width: 20, height: 20 }} />
        </button>

        {step === 'form' ? (
          <>
            <div className="am-job-banner">
              <div className="am-job-avatar">
                <span>{(job.employer || job.name || 'E').charAt(0).toUpperCase()}</span>
              </div>
              <div className="am-job-info">
                <h2 className="am-job-title">{job.name}</h2>
                <div className="am-job-meta">
                  <span className="am-meta-item">
                    <MapPinIcon style={{ width: 13, height: 13 }} />
                    {job.location}
                  </span>
                  <span className="am-meta-dot" />
                  <span className="am-meta-item">
                    <BriefcaseIcon style={{ width: 13, height: 13 }} />
                    {job.employer || t('employerLabel')}
                  </span>
                  <span className="am-meta-dot" />
                  <span className="am-salary">{job.salary} / {t('perDay')}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="am-form">
              <div className="am-field">
                <label className="am-label">{t('coverLetter')}</label>
                <textarea
                  className="am-textarea"
                  rows={4}
                  required
                  placeholder={t('coverLetterPh')}
                  value={form.coverLetter}
                  onChange={e => setForm({ ...form, coverLetter: e.target.value })}
                />
              </div>

              <div className="am-actions">
                <button type="button" className="am-cancel" onClick={onClose}>
                  {t('cancelBtn')}
                </button>
                <button type="submit" className="am-submit" disabled={loading}>
                  {loading ? t('sendingBtn') : t('sendApplication')}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="am-success">
            <div className="am-success-icon">
              <CheckCircleIcon style={{ width: 48, height: 48, color: '#7C3AED' }} />
            </div>
            <h2 className="am-success-title">{t('applicationSent')}</h2>
            <p className="am-success-sub">
              {t('applicationSentSub').replace('{job}', job.name)}
            </p>
            <button className="am-submit" onClick={onClose}>
              {t('closeBtn')}
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .am-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 10, 40, 0.45);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .am-modal {
          background: #fff;
          border-radius: 24px;
          padding: 32px;
          width: 100%;
          max-width: 500px;
          position: relative;
          box-shadow: 0 24px 60px rgba(91, 33, 182, 0.18);
          animation: am-slide-in 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes am-slide-in {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .am-modal.rtl { direction: rtl; }
        .am-close {
          position: absolute;
          top: 18px; right: 18px;
          background: #F1F5F9;
          border: none;
          border-radius: 50%;
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #64748B;
          transition: background 0.18s;
        }
        .am-modal.rtl .am-close { right: auto; left: 18px; }
        .am-close:hover { background: #E2E8F0; color: #0F172A; }
        .am-job-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          background: linear-gradient(135deg, #F5F0FF 0%, #EDE9FE 100%);
          border-radius: 16px;
          padding: 18px 20px;
          margin-bottom: 24px;
          border: 1px solid #DDD6FE;
        }
        .am-job-avatar {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #8B5CF6, #6D28D9);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 800;
          color: white;
          flex-shrink: 0;
        }
        .am-job-info { flex: 1; min-width: 0; }
        .am-job-title {
          font-size: 17px; font-weight: 800;
          color: #1E1B4B; margin: 0 0 6px;
        }
        .am-job-meta {
          display: flex; align-items: center;
          gap: 6px; flex-wrap: wrap;
        }
        .am-meta-item {
          display: flex; align-items: center;
          gap: 3px; font-size: 12px;
          font-weight: 600; color: #6B7280;
        }
        .am-meta-dot {
          width: 3px; height: 3px;
          background: #CBD5E1; border-radius: 50%;
        }
        .am-salary {
          font-size: 12px; font-weight: 800;
          color: #7C3AED;
        }
        .am-form { display: flex; flex-direction: column; gap: 20px; }
        .am-field { display: flex; flex-direction: column; gap: 6px; }
        .am-label {
          font-size: 13px; font-weight: 700;
          color: #374151;
        }
        .am-input, .am-textarea {
          border: 1.5px solid #E5E7EB;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          font-family: inherit;
          color: #1E293B;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: none;
          background: #FAFAFA;
        }
        .am-input:focus, .am-textarea:focus {
          border-color: #8B5CF6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
          background: #fff;
        }
        .am-actions {
          display: flex; gap: 12px;
          margin-top: 4px;
        }
        .am-cancel {
          flex: 0 0 auto;
          padding: 13px 24px;
          background: #F1F5F9;
          border: none; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          color: #475569; cursor: pointer;
          transition: background 0.18s;
          font-family: inherit;
        }
        .am-cancel:hover { background: #E2E8F0; }
        .am-submit {
          flex: 1;
          padding: 13px 24px;
          background: linear-gradient(135deg, #7C3AED, #5B21B6);
          border: none; border-radius: 12px;
          font-size: 14px; font-weight: 800;
          color: white; cursor: pointer;
          transition: opacity 0.18s, transform 0.15s;
          font-family: inherit;
        }
        .am-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .am-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .am-success {
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          gap: 16px; padding: 16px 0 8px;
        }
        .am-success-icon {
          width: 80px; height: 80px;
          background: linear-gradient(135deg, #F5F0FF, #EDE9FE);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .am-success-title {
          font-size: 22px; font-weight: 800;
          color: #1E1B4B; margin: 0;
        }
        .am-success-sub {
          font-size: 14px; color: #64748B;
          line-height: 1.6; margin: 0;
          max-width: 340px;
        }
      `}} />
    </div>
  );
};

export default ApplyModal;
