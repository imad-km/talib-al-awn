import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PencilSquareIcon, CheckIcon, XMarkIcon, ArrowUpTrayIcon,
  DocumentTextIcon, LinkIcon, TrashIcon, StarIcon,
  MapPinIcon, AcademicCapIcon, EnvelopeIcon, PhoneIcon,
  BriefcaseIcon, EyeIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useLanguage } from '../context/LanguageContext';

const STORAGE_KEY = 'ta_my_profile';

const DEFAULT_PROFILE = {
  name: 'Ahmed Benali',
  university: 'USTHB – Algiers',
  specialty: 'Computer Science',
  wilaya: 'Algiers',
  email: 'ahmed@usthb.dz',
  phone: '+213 555 123 456',
  bio: 'Computer science student at USTHB, passionate about web development and startups. Open to part-time opportunities in tech and data.',
  skills: ['JavaScript', 'React', 'Python', 'UI Design'],
  memberSince: 'Jan 2024',
  cvUrl: '',
  cvName: '',
};

const MOCK_STATS = [
  { key: 'completedJobs', value: 6 },
  { key: 'totalEarnings', value: '18,400 DA' },
  { key: 'avgRating', value: '4.7 / 5' },
  { key: 'activeApps', value: 3 },
];

const MOCK_REVIEWS = [
  { id: 1, author: 'Google Team', rating: 5, date: 'Mar 2025', text: 'Ahmed was punctual, professional and delivered great work throughout the internship.' },
  { id: 2, author: 'Yassir Logistics', rating: 4, date: 'Feb 2025', text: 'Quick learner and very reliable. Would hire again.' },
  { id: 3, author: 'Ooredoo HQ', rating: 5, date: 'Jan 2025', text: 'Excellent communication skills and always on time. Highly recommended.' },
];

function loadProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : { ...DEFAULT_PROFILE };
  } catch { return { ...DEFAULT_PROFILE }; }
}
function saveProfile(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

function StarsRow({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <StarSolid key={s} style={{ width: size, height: size, color: s <= Math.round(rating) ? '#f59e0b' : '#e2e8f0' }} />
      ))}
    </div>
  );
}

const MyProfilePage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(loadProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...profile });
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);
  const [cvTab, setCvTab] = useState('link'); // 'link' | 'upload'
  const [cvLink, setCvLink] = useState(profile.cvUrl || '');
  const [cvSaved, setCvSaved] = useState(false);

  const startEdit = () => { setDraft({ ...profile }); setEditing(true); };
  const cancelEdit = () => setEditing(false);

  const confirmEdit = () => {
    const updated = { ...draft };
    setProfile(updated);
    saveProfile(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s || draft.skills.includes(s)) return;
    setDraft(p => ({ ...p, skills: [...p.skills, s] }));
    setNewSkill('');
  };

  const removeSkill = (sk) => setDraft(p => ({ ...p, skills: p.skills.filter(x => x !== sk) }));

  const saveCV = () => {
    const updated = { ...profile, cvUrl: cvLink, cvName: cvLink ? (cvLink.split('/').pop() || 'CV') : '' };
    setProfile(updated);
    saveProfile(updated);
    setCvSaved(true);
    setTimeout(() => setCvSaved(false), 2000);
  };

  const removeCV = () => {
    const updated = { ...profile, cvUrl: '', cvName: '' };
    setProfile(updated);
    saveProfile(updated);
    setCvLink('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const updated = { ...profile, cvUrl: url, cvName: file.name };
    setProfile(updated);
    saveProfile(updated);
    setCvLink(url);
    setCvSaved(true);
    setTimeout(() => setCvSaved(false), 2000);
  };

  const inp = (field) => ({
    value: draft[field] || '',
    onChange: e => setDraft(p => ({ ...p, [field]: e.target.value })),
    style: S.input,
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }} dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── HEADER CARD ─────────────────────────────────────────── */}
      <div style={S.headerCard}>
        <div style={S.avatarWrap}>
          <div style={S.avatar}>{profile.name?.[0]?.toUpperCase() || 'A'}</div>
          <div style={S.onlineDot} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h1 style={S.name}>{profile.name}</h1>
              <span style={S.roleBadge}>{t('studentRole')}</span>
            </div>
            <button style={editing ? S.btnCancel : S.btnEdit} onClick={editing ? cancelEdit : startEdit}>
              {editing
                ? <><XMarkIcon style={S.btnIcon} />{t('cancelEdit')}</>
                : <><PencilSquareIcon style={S.btnIcon} />{t('editProfile')}</>}
            </button>
          </div>

          <div style={S.metaRow}>
            {profile.university && <span style={S.metaItem}><AcademicCapIcon style={S.metaIcon} />{profile.university}</span>}
            {profile.wilaya && <span style={S.metaItem}><MapPinIcon style={S.metaIcon} />{profile.wilaya}</span>}
            {profile.email && <span style={S.metaItem}><EnvelopeIcon style={S.metaIcon} />{profile.email}</span>}
            {profile.memberSince && <span style={S.metaItem}><BriefcaseIcon style={S.metaIcon} />{t('memberSince')} {profile.memberSince}</span>}
          </div>
        </div>
      </div>

      {/* ── STATS ROW ───────────────────────────────────────────── */}
      <div style={S.statsGrid}>
        {MOCK_STATS.map(s => (
          <div key={s.key} style={S.statBox}>
            <span style={S.statVal}>{s.value}</span>
            <span style={S.statLbl}>{t(s.key)}</span>
          </div>
        ))}
      </div>

      {/* ── EDIT FORM ───────────────────────────────────────────── */}
      {editing && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <PencilSquareIcon style={{ width: 20, height: 20, color: '#fff' }} />
            <h2 style={S.cardTitle}>{t('editProfile')}</h2>
          </div>

          <div style={S.formGrid}>
            <div style={S.field}>
              <label style={S.label}>{t('regFirstName')} {t('regLastName')}</label>
              <input {...inp('name')} />
            </div>
            <div style={S.field}>
              <label style={S.label}>{t('regPhone')}</label>
              <input {...inp('phone')} type="tel" />
            </div>
            <div style={S.field}>
              <label style={S.label}>{t('regUniversity')}</label>
              <input {...inp('university')} />
            </div>
            <div style={S.field}>
              <label style={S.label}>{t('specialty')}</label>
              <input {...inp('specialty')} />
            </div>
          </div>

          <div style={{ ...S.field, marginTop: 16 }}>
            <label style={S.label}>{t('aboutMe')}</label>
            <textarea
              rows={4}
              style={{ ...S.input, resize: 'vertical' }}
              value={draft.bio}
              onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))}
              placeholder={t('bioPh')}
            />
          </div>

          {/* Skills editor */}
          <div style={{ ...S.field, marginTop: 16 }}>
            <label style={S.label}>{t('mySkills')}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {draft.skills.map(sk => (
                <span key={sk} style={S.skillEdit}>
                  {sk}
                  <button style={S.skillRemove} onClick={() => removeSkill(sk)}>
                    <XMarkIcon style={{ width: 12, height: 12 }} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ ...S.input, flex: 1 }}
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder={t('skillPh')}
              />
              <button style={S.addSkillBtn} onClick={addSkill}>{t('addSkill')}</button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button style={S.btnCancel} onClick={cancelEdit}><XMarkIcon style={S.btnIcon} />{t('cancelEdit')}</button>
            <button style={S.btnSave} onClick={confirmEdit}><CheckIcon style={S.btnIcon} />{t('saveProfile')}</button>
          </div>
        </div>
      )}

      {/* ── ABOUT (read mode) ──────────────────────────────────── */}
      {!editing && (
        <div style={S.card}>
          <h2 style={S.sectionTitle}>{t('aboutMe')}</h2>
          <p style={S.aboutText}>{profile.bio || '—'}</p>
          {profile.skills?.length > 0 && (
            <>
              <h3 style={{ ...S.sectionTitle, fontSize: 14, marginTop: 20 }}>{t('mySkills')}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {profile.skills.map(sk => <span key={sk} style={S.skillBadge}>{sk}</span>)}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── CV SECTION ─────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <DocumentTextIcon style={{ width: 20, height: 20, color: '#fff' }} />
          <h2 style={S.cardTitle}>{t('cvSection')}</h2>
        </div>

        {profile.cvUrl ? (
          /* CV exists */
          <div style={S.cvExist}>
            <div style={S.cvFileIcon}><DocumentTextIcon style={{ width: 28, height: 28, color: '#7c3aed' }} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 2px', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.cvName || t('cvSection')}
              </p>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('cvUploaded')}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <a href={profile.cvUrl} target="_blank" rel="noreferrer" style={S.cvBtn}>
                <EyeIcon style={{ width: 15, height: 15 }} />{t('viewCV')}
              </a>
              <button style={{ ...S.cvBtn, background: '#fee2e2', color: '#dc2626' }} onClick={removeCV}>
                <TrashIcon style={{ width: 15, height: 15 }} />{t('removeCV')}
              </button>
            </div>
          </div>
        ) : (
          /* No CV — show upload UI */
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{t('cvHint')}</p>
        )}

        {/* Upload / Link tabs */}
        <div style={{ borderTop: profile.cvUrl ? '1px solid #f1f5f9' : 'none', paddingTop: profile.cvUrl ? 20 : 0, marginTop: profile.cvUrl ? 20 : 0 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
            {['link', 'upload'].map(tab => (
              <button
                key={tab}
                style={{ ...S.tab, ...(cvTab === tab ? S.tabActive : {}) }}
                onClick={() => setCvTab(tab)}
              >
                {tab === 'link' ? <><LinkIcon style={{ width: 14, height: 14 }} />{t('cvByLink')}</> : <><ArrowUpTrayIcon style={{ width: 14, height: 14 }} />{t('cvByUpload')}</>}
              </button>
            ))}
          </div>

          {cvTab === 'link' ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                style={{ ...S.input, flex: 1 }}
                value={cvLink}
                onChange={e => setCvLink(e.target.value)}
                placeholder={t('cvLinkPh')}
                type="url"
              />
              <button style={{ ...S.btnSave, padding: '11px 20px' }} onClick={saveCV}>
                {cvSaved ? <><CheckIcon style={S.btnIcon} />{t('cvSaved')}</> : t('saveCV')}
              </button>
            </div>
          ) : (
            <>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFileUpload} />
              <button style={S.uploadArea} onClick={() => fileRef.current?.click()}>
                <ArrowUpTrayIcon style={{ width: 24, height: 24, color: '#7c3aed' }} />
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{t('uploadCV')}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>{t('cvFormats')}</span>
              </button>
              {cvSaved && <p style={{ fontSize: 13, color: '#22c55e', marginTop: 10, fontWeight: 700 }}>✓ {t('cvSaved')}</p>}
            </>
          )}
        </div>
      </div>

      {/* ── REVIEWS ─────────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={S.sectionTitle}>{t('reviewsTitle') || 'Reviews'}</h2>
          <span style={S.countBadge}>{MOCK_REVIEWS.length} {t('total') || 'total'}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {MOCK_REVIEWS.map(r => (
            <div key={r.id} style={S.reviewCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={S.reviewAvatar}>{r.author[0]}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{r.author}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{r.date}</p>
                </div>
                <StarsRow rating={r.rating} />
              </div>
              <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

/* ── Styles ─────────────────────────────────────────────────────── */
const S = {
  headerCard: {
    background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)',
    border: '1px solid #ddd6fe',
    borderRadius: 24,
    padding: '28px 32px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 24,
    marginBottom: 20,
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: 80, height: 80, borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    color: '#fff', fontSize: 30, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
  },
  onlineDot: {
    position: 'absolute', bottom: 3, right: 3,
    width: 16, height: 16, borderRadius: '50%',
    background: '#22c55e', border: '3px solid #ede9fe',
  },
  name: { fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' },
  roleBadge: {
    display: 'inline-block', background: '#7c3aed', color: '#fff',
    fontSize: 11, fontWeight: 700, padding: '3px 10px',
    borderRadius: 100, marginBottom: 10,
  },
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginTop: 2 },
  metaItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#475569', fontWeight: 500 },
  metaIcon: { width: 14, height: 14, color: '#7c3aed' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 },
  statBox: {
    background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0',
    padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 4,
    boxShadow: '0 2px 12px rgba(15,23,42,0.04)',
  },
  statVal: { fontSize: 22, fontWeight: 900, color: '#7c3aed' },
  statLbl: { fontSize: 12, color: '#64748b', fontWeight: 600 },

  card: {
    background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0',
    padding: '28px 32px', marginBottom: 20,
    boxShadow: '0 2px 12px rgba(15,23,42,0.04)',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
    paddingBottom: 16, borderBottom: '1px solid #f1f5f9',
  },
  cardTitle: { fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 },
  sectionTitle: { fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' },
  aboutText: { fontSize: 14, color: '#374151', lineHeight: 1.75, margin: 0 },

  skillBadge: {
    background: '#f5f3ff', color: '#7c3aed', borderRadius: 100,
    padding: '5px 14px', fontSize: 13, fontWeight: 700,
    border: '1.5px solid #ddd6fe',
  },
  skillEdit: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: '#ede9fe', color: '#5b21b6', borderRadius: 100,
    padding: '5px 12px', fontSize: 13, fontWeight: 700,
  },
  skillRemove: { background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', display: 'flex', padding: 0 },
  addSkillBtn: {
    padding: '10px 18px', borderRadius: 10, border: 'none',
    background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 13,
    cursor: 'pointer', fontFamily: 'inherit',
  },

  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 700, color: '#374151' },
  input: {
    border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '11px 14px',
    fontSize: 14, color: '#0f172a', outline: 'none',
    background: '#f8fafc', fontFamily: 'inherit', boxSizing: 'border-box',
    width: '100%',
  },

  btnEdit: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '9px 18px', borderRadius: 12, border: '1.5px solid #7c3aed',
    background: '#fff', color: '#7c3aed', fontWeight: 700, fontSize: 13,
    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
  },
  btnCancel: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '9px 18px', borderRadius: 12, border: '1.5px solid #e2e8f0',
    background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 13,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  btnSave: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '9px 20px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff',
    fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
  },
  btnIcon: { width: 15, height: 15 },

  cvExist: {
    display: 'flex', alignItems: 'center', gap: 14,
    background: '#f5f3ff', borderRadius: 14, padding: '14px 18px',
    border: '1.5px solid #ddd6fe', marginBottom: 0,
  },
  cvFileIcon: {
    width: 52, height: 52, background: '#ede9fe', borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cvBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '8px 14px', borderRadius: 10, border: 'none',
    background: '#ede9fe', color: '#7c3aed', fontWeight: 700, fontSize: 12,
    cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none',
  },
  tab: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '7px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0',
    background: '#f8fafc', color: '#64748b', fontWeight: 600, fontSize: 12,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  tabActive: { background: '#7c3aed', color: '#fff', border: '1.5px solid #7c3aed' },
  uploadArea: {
    width: '100%', borderRadius: 14, border: '2px dashed #ddd6fe',
    background: '#faf5ff', padding: '28px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    cursor: 'pointer', fontFamily: 'inherit', boxSizing: 'border-box',
  },

  reviewCard: {
    background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18,
  },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff',
    fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  countBadge: {
    background: '#f1f5f9', color: '#64748b', fontSize: 12,
    fontWeight: 700, padding: '4px 12px', borderRadius: 100,
  },
};

export default MyProfilePage;
