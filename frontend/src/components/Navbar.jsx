import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Briefcase, 
  FileText, 
  Wallet, 
  Inbox, 
  Bell, 
  Settings, 
  User,
  LogOut,
} from 'lucide-react';
import {
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

const NOTIF_PREVIEW = [
  {
    id: 1,
    icon: BriefcaseIcon,
    iconBg: '#faf5ff',
    iconColor: '#7c3aed',
    title: 'New Deal Proposal',
    body: 'Google Team sent you a deal for "Frontend Developer"',
    time: '5m ago',
    read: false,
  },
  {
    id: 2,
    icon: CheckCircleIcon,
    iconBg: '#f0fdf4',
    iconColor: '#22c55e',
    title: 'Deal Accepted',
    body: 'Yassir Logistics accepted your deal proposal.',
    time: '1h ago',
    read: false,
  },
  {
    id: 3,
    icon: ChatBubbleLeftRightIcon,
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    title: 'New Message',
    body: 'Ooredoo HQ: "The orientation starts at 9 AM sharp."',
    time: '2h ago',
    read: true,
  },
];

const Navbar = ({ role = 'student' }) => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIF_PREVIEW);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      // Defensive check for e.target and refs
      if (!e.target || !(e.target instanceof Node)) return;

      if (notifRef.current && notifRef.current.contains && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && profileRef.current.contains && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const base = role === 'student' ? '/student' : '/employer';

  const navLinks = role === 'student' ? [
    { name: t('home'), icon: Home, path: '/student' },
    { name: t('findJob'), icon: Search, path: '/student/find-jobs' },
    { name: t('applications'), icon: FileText, path: '/student/applications' },
    { name: t('wallet'), icon: Wallet, path: '/student/wallet' },
    { name: t('inbox'), icon: Inbox, path: '/student/inbox' },
  ] : [
    { name: t('home'), icon: Home, path: '/employer' },
    { name: t('manageJobs'), icon: Briefcase, path: '/employer/jobs' },
    { name: t('applicants'), icon: User, path: '/employer/applicants' },
    { name: t('wallet'), icon: Wallet, path: '/employer/wallet' },
    { name: t('inbox'), icon: Inbox, path: '/employer/inbox' },
  ];

  return (
    <nav className="navbar" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="nav-container">
        <div className="nav-right">
          <Link to="/" className="logo">
            <img src="/assets/logo-07.svg" alt="Talib Awn Logo" style={{ width: 44, height: 44 }} />
            <span className="logo-text">
              {t('landing.footer.footerTitle1')} <span className="logo-alt">{t('landing.footer.footerTitle2')}</span>
            </span>
          </Link>
        </div>

        <div className="nav-center">
          <div className="nav-links">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end={link.path === '/student' || link.path === '/employer'}
              >
                <link.icon size={20} />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="nav-left">
          <div className="nav-actions">

            {/* Notifications bell */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                className="nav-action-btn"
                onClick={() => setNotifOpen(p => !p)}
                style={{ background: notifOpen ? 'rgba(124,58,237,0.08)' : undefined, borderColor: notifOpen ? '#7c3aed' : undefined, color: notifOpen ? '#7c3aed' : undefined }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notif-badge" style={{ top: -4, right: -4 }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>

              {notifOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: 360,
                  background: '#fff',
                  borderRadius: 20,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.14)',
                  zIndex: 2000,
                  overflow: 'hidden',
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{t('notifications')}</span>
                      {unreadCount > 0 && (
                        <span style={{ background: '#7c3aed', color: '#fff', borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>{unreadCount}</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
                        style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>

                  {/* Notif items */}
                  {notifs.map((notif, i) => {
                    const Icon = notif.icon;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => markRead(notif.id)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 12,
                          padding: '14px 20px',
                          borderBottom: i < notifs.length - 1 ? '1px solid #f8fafc' : 'none',
                          background: notif.read ? '#fff' : '#faf5ff',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                          position: 'relative',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = notif.read ? '#fff' : '#faf5ff'}
                      >
                        {!notif.read && (
                          <span style={{ position: 'absolute', top: 18, left: 7, width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
                        )}
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: notif.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon style={{ width: 18, height: 18, color: notif.iconColor }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                            <p style={{ fontSize: 13, fontWeight: notif.read ? 600 : 800, color: '#0f172a', margin: '0 0 2px' }}>{notif.title}</p>
                            <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>{notif.time}</span>
                          </div>
                          <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notif.body}</p>
                        </div>
                      </div>
                    );
                  })}

                  {/* View more */}
                  <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      onClick={() => { setNotifOpen(false); navigate(`${base}/notifications`); }}
                      style={{
                        width: '100%', padding: '10px', borderRadius: 12, border: 'none',
                        background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                        color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {t('viewAllNotifs')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings button */}
            <button className="nav-action-btn" onClick={() => navigate(`${base}/settings`)}>
              <Settings size={20} />
            </button>

            {/* Profile picture */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <div 
                className="user-profile" 
                onClick={() => setProfileOpen(p => !p)}
                style={{ borderColor: profileOpen ? '#7c3aed' : 'white', boxShadow: profileOpen ? '0 0 0 2px #7c3aed' : '0 0 0 1.5px var(--border)' }}
              >
                <User size={20} />
              </div>

              {profileOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: 200,
                  background: '#fff',
                  borderRadius: 18,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                  zIndex: 2000,
                  overflow: 'hidden',
                  padding: '8px',
                }}>
                  <button
                    onClick={() => { setProfileOpen(false); navigate(role === 'student' ? '/student/my-profile' : `${base}/my-profile`); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                      borderRadius: 12, border: 'none', background: 'none', color: '#475569',
                      fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s', textAlign: 'start'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#7c3aed'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#475569'; }}
                  >
                    <User size={18} />
                    {t('profile')}
                  </button>
                  <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
                  <button
                    onClick={() => { /* Handle logout logic */ setProfileOpen(false); navigate('/login'); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                      borderRadius: 12, border: 'none', background: 'none', color: '#ef4444',
                      fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s', textAlign: 'start'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fff5f5'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                  >
                    <LogOut size={18} />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .navbar {
          height: 80px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 0 40px;
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-right {
          display: flex;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          text-decoration: none;
        }

        .logo-text {
          font-family: 'Cairo', sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0F172A;
        }
        .logo-alt {
          color: var(--primary);
        }
        .nav-links {
          display: flex;
          gap: 8px;
          background: transparent;
          padding: 4px;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 8px 20px;
          border-radius: 12px;
          text-decoration: none;
          min-width: 90px;
        }
        .nav-item span {
          font-size: 11px;
          font-weight: 700;
        }
        .nav-item:hover {
          color: var(--primary);
          background: var(--primary-light, rgba(124, 58, 237, 0.05));
        }
        .nav-item.active {
          color: var(--primary);
          background: var(--primary-light, rgba(124, 58, 237, 0.1));
        }
        .nav-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nav-action-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          background: #F8FAFC;
          border: 1.5px solid var(--border);
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-action-btn:hover {
          color: var(--primary);
          border-color: var(--primary);
        }
        .notif-badge {
          position: absolute;
          top: 9px;
          right: 9px;
          min-width: 18px;
          height: 18px;
          background: #EF4444;
          border-radius: 100px;
          border: 2px solid white;
          font-size: 10px;
          font-weight: 800;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          font-family: inherit;
        }
        .user-profile {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          background: #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 0 1.5px var(--border);
          transition: box-shadow 0.2s;
        }
        .user-profile:hover {
          box-shadow: 0 0 0 2px #7c3aed;
        }
      `}} />
    </nav>
  );
};

export default Navbar;
