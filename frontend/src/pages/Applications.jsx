import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  StarIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  NoSymbolIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const APPS_DATA = [
  {
    id: 1,
    en: {
      company: 'Ooredoo Algeria', role: 'Customer Support Representative',
      date: '2 days ago', location: 'Algiers, Hydra',
      jobType: 'Part-Time', category: 'Customer Service',
      duration: '4 hours/day (Morning Shift)',
      fullDescription: 'We are looking for an energetic customer support rep to handle daytime inquiries.',
    },
    ar: {
      company: 'أوريدو الجزائر', role: 'ممثل خدمة العملاء',
      date: 'يومين', location: 'الجزائر، حيدرة',
      jobType: 'دوام جزئي', category: 'خدمة العملاء',
      duration: '4 ساعات/يوم (فترة صباحية)',
      fullDescription: 'نبحث عن ممثل خدمة عملاء نشيط للتعامل مع الاستفسارات خلال النهار.',
    },
    status: 'pending', salary: '120 Da/day', rating: 4.8,
    mapsUrl: 'https://maps.google.com/?q=Ooredoo+Hydra',
  },
  {
    id: 2,
    en: {
      company: 'Yassir', role: 'Logistics Assistant',
      date: 'yesterday', location: 'Algiers, Sidi Mhamed',
      jobType: 'Contract', category: 'Logistics & Delivery',
      duration: '6 hours/day (Flexible)',
      fullDescription: 'Manage incoming packages and route them to drivers efficiently using our internal software.',
    },
    ar: {
      company: 'ياسير', role: 'مساعد لوجستي',
      date: 'أمس', location: 'الجزائر، سيدي مهامد',
      jobType: 'عقد', category: 'اللوجستيات والتوصيل',
      duration: '6 ساعات/يوم (مرن)',
      fullDescription: 'إدارة الطرود الواردة وتوزيعها على السائقين باستخدام برنامجنا الداخلي.',
    },
    status: 'accepted', salary: '150 Da/day', rating: 4.5,
    mapsUrl: 'https://maps.google.com/?q=Yassir+Sidi+Mhamed',
  },
  {
    id: 3,
    en: {
      company: 'Techno Store', role: 'Sales Assistant',
      date: '1 week ago', location: 'Oran, Downtown',
      jobType: 'Part-Time', category: 'Retail',
      duration: 'Weekends only (8 hours)',
      fullDescription: 'Assist customers on the floor, manage inventory shelving, and handle basic cash register duties.',
    },
    ar: {
      company: 'تكنو ستور', role: 'مساعد مبيعات',
      date: 'أسبوع', location: 'وهران، وسط المدينة',
      jobType: 'دوام جزئي', category: 'تجزئة',
      duration: 'عطلة نهاية الأسبوع فقط (8 ساعات)',
      fullDescription: 'مساعدة العملاء في الرف، وإدارة المخزون، والتعامل مع الصندوق الأساسي.',
    },
    status: 'rejected', salary: '90 Da/day', rating: 3.9,
    mapsUrl: 'https://maps.google.com/?q=Techno+Store+Oran',
  },
];

const Applications = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionApp, setActionApp] = useState(null);
  const [cancelStep, setCancelStep] = useState('idle'); // idle | confirm | done
  const [activeFilter, setActiveFilter] = useState('all');

  const [appIds, setAppIds] = useState(APPS_DATA.map(a => a.id));

  const apps = APPS_DATA
    .filter(a => appIds.includes(a.id))
    .map(a => ({ ...a[lang], id: a.id, status: a.status, salary: a.salary, rating: a.rating, mapsUrl: a.mapsUrl }));

  const openAction = (app) => {
    setActionApp(app);
    setCancelStep('idle');
  };

  const closeAction = () => {
    setActionApp(null);
    setCancelStep('idle');
  };

  const confirmCancel = () => {
    setCancelStep('confirm');
  };

  const executeCancel = () => {
    setAppIds(prev => prev.filter(id => id !== actionApp.id));
    setCancelStep('done');
  };

  const goToChat = () => {
    closeAction();
    navigate(`/student/inbox?newChat=${encodeURIComponent(actionApp.company)}`);
  };

  useEffect(() => {
    const anyOpen = selectedApp || actionApp;
    document.body.style.overflow = anyOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedApp, actionApp]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'accepted': return { color: 'emerald', text: t('statusAccepted') };
      case 'rejected': return { color: 'rose', text: t('statusRejected') };
      default: return { color: 'amber', text: t('statusPending') };
    }
  };

  const filtered = apps.filter(app => activeFilter === 'all' || app.status === activeFilter);

  return (
    <div className="applications-page">
      <header className="page-header">
        <h1 className="page-title">{t('myApplications')}</h1>
        <p className="page-subtitle">{t('appsSubtitle')}</p>
      </header>

      <div className="filters-bar">
        <div className="filter-group">
          {['all', 'pending', 'accepted', 'rejected'].map(f => (
            <button
              key={f}
              className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'all' ? t('allApps') : f === 'pending' ? t('statusPending') : f === 'accepted' ? t('statusAccepted') : t('statusRejected')}
            </button>
          ))}
        </div>
      </div>

      <div className="apps-list">
        {filtered.length === 0 && (
          <div className="empty-state-card">
            <CheckCircleIcon className="empty-icon" />
            <p>{t('noAppsFound')}</p>
          </div>
        )}
        {filtered.map(app => {
          const status = getStatusDisplay(app.status);
          return (
            <div key={app.id} className="app-card">
              <div className={`status-pill absolute-corner ${status.color}`}>
                {status.text}
              </div>

              <div className="app-main-left">
                <h2 className="role-title">{app.role}</h2>
                <h3 className="company-name">
                  {t('byEmployer')}: <span className="highlight-company">{app.company}</span>
                </h3>
                <div className="meta-info">
                  <div className="meta-item">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{app.location}</span>
                  </div>
                  <div className="meta-item">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{app.duration || app.date}</span>
                  </div>
                  <div className="meta-item">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span>{app.salary}</span>
                  </div>
                </div>
              </div>

              <div className="app-actions-right">
                <button className="btn-action" onClick={() => openAction(app)}>
                  {t('actionBtn')}
                </button>
                <button className="btn-details" onClick={() => setSelectedApp(app)}>
                  {t('detailsBtn')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── DETAILS MODAL ─── */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ position: 'relative' }}>
              <h2 className="modal-title">{t('jobDetails')}</h2>
              <div style={{ position: 'absolute', top: 22, right: 60, display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className={`status-pill ${getStatusDisplay(selectedApp.status).color}`} style={{ fontSize: 10, padding: '3px 10px' }}>
                  {getStatusDisplay(selectedApp.status).text}
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedApp(null)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section employer-block">
                <h3 className="section-label">{t('employerInfo')}</h3>
                <div className="employer-card">
                  <div className="employer-pfp">
                    <UserCircleIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="employer-info-tx">
                    <h4 className="employer-name-lg">{selectedApp.company}</h4>
                    <div className="employer-rating">
                      <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{selectedApp.rating} / 5.0</span>
                    </div>
                  </div>
                  <button
                    className="btn-visit-profile"
                    onClick={() => { setSelectedApp(null); navigate(`/student/employer/${selectedApp.id}`); }}
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    {t('visitProfile')}
                  </button>
                </div>
              </div>

              <hr className="divider" />

              <div className="modal-section">
                <h3 className="section-label">{t('jobDetails')}</h3>
                <h2 className="modal-job-title">{selectedApp.role}</h2>
                <div className="tag-row">
                  <span className="info-tag">{selectedApp.jobType}</span>
                  <span className="info-tag">{selectedApp.category}</span>
                </div>
                <p className="job-desc-full">{selectedApp.fullDescription}</p>
              </div>

              <hr className="divider" />

              <div className="modal-section">
                <h3 className="section-label">{t('offerInfo')}</h3>
                <div className="offer-grid">
                  <div className="offer-item">
                    <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="offer-lbl">{t('dailySalary')}</span>
                      <span className="offer-val">{selectedApp.salary}</span>
                    </div>
                  </div>
                  <div className="offer-item">
                    <CalendarIcon className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="offer-lbl">{t('duration')}</span>
                      <span className="offer-val">{selectedApp.duration}</span>
                    </div>
                  </div>
                  <div className="offer-item full-width">
                    <MapPinIcon className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="offer-lbl">{t('location')}</span>
                      <a href={selectedApp.mapsUrl} target="_blank" rel="noreferrer" className="maps-link">
                        {selectedApp.location} ({t('mapsLocation')})
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
              {selectedApp.status === 'accepted' && (
                <button className="chat-btn" onClick={() => { setSelectedApp(null); navigate(`/student/inbox?newChat=${encodeURIComponent(selectedApp.company)}`); }}>
                  <ChatBubbleLeftEllipsisIcon className="w-5 h-5 rtl-flip" />
                  {t('startChat')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── ACTION MODAL ─── */}
      {actionApp && (
        <div className="modal-overlay" onClick={closeAction}>
          <div className="modal-content action-modal" onClick={e => e.stopPropagation()}>

            <div className="modal-header">
              <h2 className="modal-title">Application Action</h2>
              <button className="close-btn" onClick={closeAction}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="action-modal-body">

              {/* ── PENDING: cancel flow ── */}
              {actionApp.status === 'pending' && cancelStep === 'idle' && (
                <>
                  <div className="action-info-block">
                    <div className="action-app-name">{actionApp.role}</div>
                    <div className="action-app-company">{actionApp.company}</div>
                    <div className={`status-pill amber`} style={{ marginTop: 8, width: 'fit-content' }}>
                      {t('statusPending')}
                    </div>
                  </div>
                  <div className="action-divider" />
                  <button className="btn-cancel-app" onClick={confirmCancel}>
                    <NoSymbolIcon className="w-5 h-5" />
                    {t('withdrawBtn')}
                  </button>
                  <p className="action-hint">{t('withdrawHint')}</p>
                </>
              )}

              {actionApp.status === 'pending' && cancelStep === 'confirm' && (
                <div className="confirm-block">
                  <div className="confirm-icon-wrap warn">
                    <ExclamationTriangleIcon className="w-8 h-8" />
                  </div>
                  <h3 className="confirm-title">{t('withdrawTitle')}</h3>
                  <p className="confirm-text">
                    {t('withdrawConfirmText').replace('{role}', actionApp.role).replace('{company}', actionApp.company)}
                  </p>
                  <div className="confirm-actions">
                    <button className="btn-confirm-cancel" onClick={executeCancel}>{t('withdrawApplication')}</button>
                    <button className="btn-keep" onClick={() => setCancelStep('idle')}>{t('keepApplication')}</button>
                  </div>
                </div>
              )}

              {actionApp.status === 'pending' && cancelStep === 'done' && (
                <div className="confirm-block">
                  <div className="confirm-icon-wrap success">
                    <CheckCircleIcon className="w-8 h-8" />
                  </div>
                  <h3 className="confirm-title">{t('withdrawDoneTitle')}</h3>
                  <p className="confirm-text">{t('withdrawDoneText')}</p>
                  <button className="btn-keep" onClick={closeAction}>{t('closeBtn')}</button>
                </div>
              )}

              {/* ── REJECTED: locked ── */}
              {actionApp.status === 'rejected' && (
                <div className="confirm-block">
                  <div className="confirm-icon-wrap rejected">
                    <XMarkIcon className="w-8 h-8" />
                  </div>
                  <h3 className="confirm-title">{t('rejectedDialogTitle')}</h3>
                  <p className="confirm-text">
                    {t('rejectedDialogText').replace('{role}', actionApp.role).replace('{company}', actionApp.company)}
                  </p>
                  <div className={`status-pill rose large`} style={{ margin: '0 auto' }}>
                    {t('statusRejected')}
                  </div>
                  <button className="btn-keep" style={{ marginTop: 8 }} onClick={closeAction}>{t('closeBtn')}</button>
                </div>
              )}

              {/* ── ACCEPTED: go to chat to cancel ── */}
              {actionApp.status === 'accepted' && (
                <div className="confirm-block">
                  <div className="confirm-icon-wrap accepted">
                    <ChatBubbleLeftEllipsisIcon className="w-8 h-8" />
                  </div>
                  <h3 className="confirm-title">{t('acceptedDialogTitle')}</h3>
                  <p className="confirm-text">
                    {t('acceptedDialogText').replace('{role}', actionApp.role).replace('{company}', actionApp.company)}
                  </p>
                  <button className="btn-go-chat" onClick={goToChat}>
                    <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                    {t('openChatWith').replace('{company}', actionApp.company)}
                    <ArrowRightIcon className="w-4 h-4 rtl-flip" />
                  </button>
                  <button className="btn-keep" onClick={closeAction}>{t('closeBtn')}</button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ─── STYLES ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .applications-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .page-header { margin-bottom: 8px; }
        .page-title { font-size: 32px; font-weight: 800; color: var(--text-main); margin-bottom: 8px; }
        .page-subtitle { color: var(--text-muted); font-size: 16px; }

        .filters-bar { display: flex; justify-content: space-between; align-items: center; }
        .filter-group { display: flex; gap: 12px; flex-wrap: wrap; }
        .filter-pill {
          padding: 8px 20px; border-radius: 100px; border: 1px solid #E2E8F0;
          background: white; font-size: 14px; font-weight: 700; color: #64748B;
          cursor: pointer; transition: all 0.2s;
        }
        .filter-pill:hover { border-color: #8B5CF6; color: #8B5CF6; }
        .filter-pill.active { background: #6D28D9; color: white; border-color: #6D28D9; }

        .apps-list { display: flex; flex-direction: column; gap: 20px; }

        .empty-state-card {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          padding: 60px; background: white; border: 1px dashed #E2E8F0; border-radius: 20px;
          color: #94A3B8; font-size: 15px; font-weight: 600;
        }
        .empty-icon { width: 40px; height: 40px; opacity: 0.4; }

        .app-card {
          background: white; border: 1px solid #E2E8F0; border-radius: 20px;
          padding: 24px; display: flex; justify-content: space-between; align-items: center;
          transition: all 0.2s ease; position: relative;
        }
        .app-card:hover {
          box-shadow: 0 12px 32px rgba(91, 33, 182, 0.08);
          transform: translateY(-4px); border-color: #C4B5FD;
        }

        .status-pill.absolute-corner { position: absolute; top: 16px; right: 16px; }
        [dir="rtl"] .status-pill.absolute-corner { right: auto; left: 16px; }

        .app-main-left { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .role-title { font-size: 20px; font-weight: 900; color: #0F172A; margin: 0; }
        .company-name { font-size: 14px; font-weight: 600; color: #64748B; margin: 0; }
        .highlight-company { color: #6D28D9; font-weight: 800; }

        .meta-info { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 12px; }
        .meta-item { display: flex; align-items: flex-start; gap: 6px; color: #475569; font-size: 13px; font-weight: 700; }
        .meta-item svg { flex-shrink: 0; width: 18px; height: 18px; margin-top: 2px; }

        .app-actions-right { display: flex; align-items: center; gap: 8px; }

        .status-pill {
          display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 100px;
          font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .status-pill.large { font-size: 13px; padding: 8px 20px; }
        .status-pill.amber { background: #FEF3C7; color: #D97706; border: 1px solid #FDE68A; }
        .status-pill.emerald { background: #D1FAE5; color: #059669; border: 1px solid #A7F3D0; }
        .status-pill.rose { background: #FFEDD5; color: #EA580C; border: 1px solid #FED7AA; }

        .btn-details {
          padding: 10px 20px; border-radius: 12px; border: none;
          background: #F3E8FF; color: #6D28D9;
          font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-details:hover { background: #6D28D9; color: white; }

        .btn-action {
          padding: 10px 20px; border-radius: 12px;
          border: 1.5px solid #E2E8F0; background: white; color: #475569;
          font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-action:hover { border-color: #EF4444; color: #EF4444; background: #FEF2F2; }

        /* ─── Shared Modal ─── */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px); z-index: 9999;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .modal-content {
          background: #FFFFFF; border-radius: 20px; width: 100%; max-width: 500px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.18); display: flex; flex-direction: column;
        }
        .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 24px; border-bottom: 1px solid #F1F5F9;
        }
        .modal-title { font-size: 18px; font-weight: 900; color: #0F172A; margin: 0; }
        .close-btn {
          background: #F1F5F9; border: none; cursor: pointer; color: #64748B;
          padding: 6px; border-radius: 50%; display: flex; align-items: center;
          justify-content: center; transition: all 0.2s;
        }
        .close-btn:hover { background: #E2E8F0; color: #0F172A; }

        .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
        .modal-section { display: flex; flex-direction: column; gap: 8px; }
        .section-label { font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }

        .employer-card { display: flex; align-items: center; gap: 12px; background: #F8FAFC; padding: 12px; border-radius: 12px; border: 1px solid #F1F5F9; justify-content: space-between; }
        .employer-info-tx { flex: 1; }

        .btn-visit-profile {
          display: flex; align-items: center; gap: 6px; flex-shrink: 0;
          padding: 7px 14px; border-radius: 8px;
          border: 1.5px solid #DDD6FE; background: white; color: #6D28D9;
          font-weight: 800; font-size: 12px; cursor: pointer; transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-visit-profile svg { width: 14px; height: 14px; flex-shrink: 0; }
        .btn-visit-profile:hover { background: #6D28D9; color: white; border-color: #6D28D9; }
        .employer-pfp { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: white; border-radius: 50%; border: 1px solid #CBD5E1; color: #94A3B8; }
        .employer-pfp svg { flex-shrink: 0; width: 28px; height: 28px; }
        .employer-name-lg { font-size: 15px; font-weight: 800; color: #0F172A; margin: 0 0 2px; }
        .employer-rating { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: #64748B; }
        .employer-rating svg { flex-shrink: 0; width: 14px; height: 14px; }

        .divider { border: none; border-top: 1px solid #F1F5F9; margin: 0; }
        .modal-job-title { font-size: 20px; font-weight: 900; color: #0F172A; margin: 0; }
        .tag-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .info-tag { background: #F8FAFC; color: #64748B; border: 1px solid #E2E8F0; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; }
        .job-desc-full { font-size: 14px; line-height: 1.6; color: #475569; margin: 0; }

        .offer-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .offer-item { display: flex; align-items: flex-start; gap: 10px; }
        .offer-item svg { flex-shrink: 0; width: 20px; height: 20px; margin-top: 2px; }
        .offer-lbl { display: block; font-size: 11px; font-weight: 700; color: #94A3B8; margin-bottom: 2px; }
        .offer-val { display: block; font-size: 14px; font-weight: 800; color: #0F172A; }
        .maps-link { color: #5B21B6; text-decoration: none; font-weight: 800; font-size: 13px; }
        .maps-link:hover { text-decoration: underline; }

        .modal-footer {
          padding: 20px 24px; border-top: 1px solid #F1F5F9; background: #F8FAFC;
          display: flex; justify-content: space-between; align-items: center;
          border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;
        }
        .chat-btn {
          display: flex; align-items: center; gap: 6px; padding: 8px 16px;
          border-radius: 8px; border: none; background: #5B21B6; color: white;
          font-weight: 800; font-size: 13px; cursor: pointer; transition: background 0.2s;
        }
        .chat-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
        .chat-btn:hover { background: #4C1D95; }

        /* ─── Action Modal ─── */
        .action-modal { max-width: 440px; }

        .action-modal-body {
          padding: 24px; display: flex; flex-direction: column; gap: 16px;
        }

        .action-info-block {
          background: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 14px;
          padding: 16px 20px;
        }
        .action-app-name { font-size: 16px; font-weight: 900; color: #0F172A; margin-bottom: 4px; }
        .action-app-company { font-size: 13px; font-weight: 600; color: #64748B; }

        .action-divider { height: 1px; background: #F1F5F9; }

        .btn-cancel-app {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px; border-radius: 12px; border: 1.5px solid #FCA5A5;
          background: #FEF2F2; color: #DC2626;
          font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s;
        }
        .btn-cancel-app svg { width: 20px; height: 20px; flex-shrink: 0; }
        .btn-cancel-app:hover { background: #DC2626; color: white; border-color: #DC2626; }

        .action-hint { font-size: 12px; color: #94A3B8; font-weight: 500; text-align: center; line-height: 1.5; }

        /* ─── Confirm block (shared by all three states) ─── */
        .confirm-block {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          text-align: center; padding: 8px 0 4px;
        }
        .confirm-icon-wrap {
          width: 64px; height: 64px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .confirm-icon-wrap.warn    { background: #FEF3C7; color: #D97706; }
        .confirm-icon-wrap.success { background: #D1FAE5; color: #059669; }
        .confirm-icon-wrap.rejected { background: #FFE4E6; color: #E11D48; }
        .confirm-icon-wrap.accepted { background: #EDE9FE; color: #7C3AED; }

        .confirm-title { font-size: 18px; font-weight: 900; color: #0F172A; margin: 0; }
        .confirm-text { font-size: 14px; color: #475569; line-height: 1.6; margin: 0; max-width: 340px; }

        .confirm-actions { display: flex; gap: 10px; width: 100%; margin-top: 4px; }

        .btn-confirm-cancel {
          flex: 1; padding: 12px; border-radius: 12px; border: none;
          background: #DC2626; color: white;
          font-weight: 800; font-size: 14px; cursor: pointer; transition: background 0.2s;
        }
        .btn-confirm-cancel:hover { background: #B91C1C; }

        .btn-keep {
          flex: 1; padding: 12px; border-radius: 12px;
          border: 1.5px solid #E2E8F0; background: white; color: #475569;
          font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s;
        }
        .btn-keep:hover { border-color: #94A3B8; color: #0F172A; }

        .btn-go-chat {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px; border-radius: 12px; border: none;
          background: #6D28D9; color: white;
          font-weight: 800; font-size: 14px; cursor: pointer; transition: background 0.2s;
        }
        .btn-go-chat:hover { background: #5B21B6; }
        .btn-go-chat svg { width: 18px; height: 18px; flex-shrink: 0; }

        .rtl-flip { transform: scaleX(var(--rtl-flip, 1)); }
        [dir="rtl"] .rtl-flip { --rtl-flip: -1; }
        [dir="rtl"] .app-card:hover { transform: translateY(-4px); }

        @media (max-width: 768px) {
          .app-card { flex-direction: column; align-items: flex-start; }
          .app-actions-right { width: 100%; margin-top: 16px; }
          .app-actions-right .btn-details,
          .app-actions-right .btn-action { flex: 1; text-align: center; }
          .meta-info { flex-wrap: wrap; gap: 12px; }
          .modal-footer { flex-direction: column; gap: 16px; align-items: stretch; }
          .modal-footer .status-pill { justify-content: center; }
          .confirm-actions { flex-direction: column; }
        }
      `}} />
    </div>
  );
};

export default Applications;
