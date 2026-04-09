import React, { useState } from 'react';
import {
  UserCircleIcon,
  LockClosedIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  TrashIcon,
  CheckIcon,
  CameraIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

const Section = ({ icon: Icon, title, children }) => (
  <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '28px 32px', marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon style={{ width: 20, height: 20, color: '#fff' }} />
      </div>
      <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const Field = ({ label, hint, children }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{label}</label>
    {hint && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: -4, marginBottom: 8 }}>{hint}</p>}
    {children}
  </div>
);

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1.5px solid #e2e8f0',
  fontSize: 14,
  color: '#0f172a',
  outline: 'none',
  background: '#f8fafc',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const Toggle = ({ checked, onChange, label, description }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
    <div>
      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{label}</p>
      {description && <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 48,
        height: 26,
        borderRadius: 100,
        border: 'none',
        background: checked ? '#7c3aed' : '#e2e8f0',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: 3,
        left: checked ? 25 : 3,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        transition: 'left 0.2s',
        display: 'block',
      }} />
    </button>
  </div>
);

const SaveBtn = ({ saved, onClick }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '11px 24px', borderRadius: 12, border: 'none',
        background: saved ? '#22c55e' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
        color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        fontFamily: 'inherit', transition: 'background 0.3s',
      }}
    >
      {saved && <CheckIcon style={{ width: 16, height: 16 }} />}
      {saved ? 'Saved!' : 'Save Changes'}
    </button>
  </div>
);

const SettingsPage = () => {
  const { lang, toggleLanguage } = useLanguage();
  const [profile, setProfile] = useState({
    name: 'Ahmed Benali',
    username: 'ahmed.benali',
    email: 'ahmed@usthb.dz',
    phone: '+213 555 123 456',
    location: 'Algiers, Algeria',
    bio: 'Computer science student at USTHB, passionate about web development and startups.',
  });

  const [notifToggles, setNotifToggles] = useState({
    newDeal: true,
    dealAccepted: true,
    newMessage: true,
    appUpdate: false,
    weeklyDigest: true,
    marketingEmails: false,
  });

  const [privacy, setPrivacy] = useState({
    showPhone: false,
    showEmail: true,
    publicProfile: true,
    showOnline: true,
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const saveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2200);
  };

  const savePassword = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) return;
    if (passwords.newPass !== passwords.confirm) { alert('Passwords do not match.'); return; }
    setPasswordSaved(true);
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPasswordSaved(false), 2200);
  };

  const setNotif = (key) => (val) => setNotifToggles(p => ({ ...p, [key]: val }));
  const setPriv = (key) => (val) => setPrivacy(p => ({ ...p, [key]: val }));

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>Settings</h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Manage your account, preferences and privacy</p>
      </div>

      {/* Profile */}
      <Section icon={UserCircleIcon} title="Profile">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff' }}>
              {profile.name.charAt(0)}
            </div>
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#0f172a', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <CameraIcon style={{ width: 13, height: 13, color: '#fff' }} />
            </button>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{profile.name}</p>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>@{profile.username}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Full Name">
            <input
              style={inputStyle}
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </Field>
          <Field label="Username">
            <input
              style={inputStyle}
              value={profile.username}
              onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </Field>
          <Field label="Email">
            <input
              style={inputStyle}
              type="email"
              value={profile.email}
              onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </Field>
          <Field label="Phone">
            <input
              style={inputStyle}
              value={profile.phone}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </Field>
          <Field label="Location">
            <input
              style={inputStyle}
              value={profile.location}
              onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </Field>
        </div>
        <Field label="Bio" hint="Short description visible on your profile">
          <textarea
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            value={profile.bio}
            onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </Field>
        <SaveBtn saved={profileSaved} onClick={saveProfile} />
      </Section>

      {/* Password */}
      <Section icon={LockClosedIcon} title="Password & Security">
        <Field label="Current Password">
          <input
            style={inputStyle} type="password" placeholder="••••••••"
            value={passwords.current}
            onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="New Password">
            <input
              style={inputStyle} type="password" placeholder="••••••••"
              value={passwords.newPass}
              onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </Field>
          <Field label="Confirm New Password">
            <input
              style={inputStyle} type="password" placeholder="••••••••"
              value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </Field>
        </div>
        <SaveBtn saved={passwordSaved} onClick={savePassword} />
      </Section>

      {/* Notifications */}
      <Section icon={BellIcon} title="Notification Preferences">
        <Toggle checked={notifToggles.newDeal} onChange={setNotif('newDeal')} label="New Deal Proposals" description="When someone sends you a deal proposal" />
        <Toggle checked={notifToggles.dealAccepted} onChange={setNotif('dealAccepted')} label="Deal Status Updates" description="When a deal is accepted or rejected" />
        <Toggle checked={notifToggles.newMessage} onChange={setNotif('newMessage')} label="New Messages" description="When you receive a new chat message" />
        <Toggle checked={notifToggles.appUpdate} onChange={setNotif('appUpdate')} label="Application Updates" description="Changes to your job applications" />
        <Toggle checked={notifToggles.weeklyDigest} onChange={setNotif('weeklyDigest')} label="Weekly Summary" description="A weekly digest of your activity" />
        <Toggle checked={notifToggles.marketingEmails} onChange={setNotif('marketingEmails')} label="Promotions & News" description="Platform news, offers, and announcements" />
      </Section>

      {/* Privacy */}
      <Section icon={ShieldCheckIcon} title="Privacy">
        <Toggle checked={privacy.publicProfile} onChange={setPriv('publicProfile')} label="Public Profile" description="Allow anyone to view your profile page" />
        <Toggle checked={privacy.showEmail} onChange={setPriv('showEmail')} label="Show Email" description="Display your email on your profile" />
        <Toggle checked={privacy.showPhone} onChange={setPriv('showPhone')} label="Show Phone Number" description="Display your phone number on your profile" />
        <Toggle checked={privacy.showOnline} onChange={setPriv('showOnline')} label="Show Online Status" description="Let others see when you're active" />
      </Section>

      {/* Language */}
      <Section icon={GlobeAltIcon} title="Language">
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>
          Choose the language used throughout the platform.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { code: 'en', label: 'English' },
            { code: 'ar', label: 'العربية' },
          ].map(opt => {
            const active = lang === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => { if (!active) toggleLanguage(); }}
                style={{
                  flex: 1,
                  padding: '18px 20px',
                  borderRadius: 16,
                  border: `2px solid ${active ? '#7c3aed' : '#e2e8f0'}`,
                  background: active ? '#faf5ff' : '#f8fafc',
                  cursor: active ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: active ? '0 4px 16px rgba(124,58,237,0.14)' : 'none',
                }}
              >
                <p style={{ fontSize: 15, fontWeight: 900, color: active ? '#7c3aed' : '#0f172a', margin: '0 0 2px' }}>{opt.label}</p>
                {active && (
                  <span style={{ display: 'inline-block', marginTop: 8, fontSize: 11, fontWeight: 800, color: '#7c3aed', background: '#ede9fe', padding: '3px 12px', borderRadius: 100 }}>
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Danger Zone */}
      <Section icon={TrashIcon} title="Danger Zone">
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>These actions are permanent and cannot be undone. Please be careful.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            style={{ padding: '11px 22px', borderRadius: 12, border: '1.5px solid #fca5a5', background: '#fff5f5', color: '#ef4444', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => { if (window.confirm('Deactivate your account? You can reactivate later by logging in.')) alert('Account deactivated.'); }}
          >
            Deactivate Account
          </button>
          <button
            style={{ padding: '11px 22px', borderRadius: 12, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => { if (window.confirm('Delete your account permanently? This cannot be undone.')) alert('Account deleted.'); }}
          >
            Delete Account
          </button>
        </div>
      </Section>
    </div>
  );
};

export default SettingsPage;
