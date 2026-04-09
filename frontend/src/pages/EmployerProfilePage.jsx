import React, { useState } from 'react';
import {
  PencilSquareIcon, CheckIcon, XMarkIcon,
  MapPinIcon, EnvelopeIcon, PhoneIcon,
  BriefcaseIcon, BuildingOfficeIcon, GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const STORAGE_KEY = 'ta_employer_profile';

const DEFAULT_PROFILE = {
  name: 'Talib Awn',
  company: 'Tech Solutions DZ',
  category: 'Technology',
  location: 'Algiers, Algeria',
  email: 'contact@techsolutions.dz',
  phone: '+213 555 000 111',
  website: 'https://techsolutions.dz',
  bio: 'Tech Solutions DZ partners with top universities to offer students real-world experience through part-time roles in engineering, design, and data.',
  memberSince: 'Jan 2023',
  jobsPosted: 12,
};

const MOCK_REVIEWS = [
  { id: 1, author: 'Yacine B.', rating: 5, date: 'Mar 2025', text: 'Very professional and organised. Payment was always on time and the team was welcoming.' },
  { id: 2, author: 'Amira K.', rating: 5, date: 'Feb 2025', text: 'Great experience working part-time here. I learned a lot and the flexibility was amazing.' },
  { id: 3, author: 'Mehdi A.', rating: 4, date: 'Jan 2025', text: 'Good environment, though sometimes communication could be faster. Overall recommended.' },
];

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? { ...DEFAULT_PROFILE, ...JSON.parse(s) } : { ...DEFAULT_PROFILE };
  } catch { return { ...DEFAULT_PROFILE }; }
}
function saveToStorage(p) {
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

const EmployerProfilePage = () => {
  const [profile, setProfile] = useState(load);
  const [editing, setEditing]  = useState(false);
  const [draft,   setDraft]    = useState({ ...profile });
  const [saved,   setSaved]    = useState(false);

  const avgRating = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);

  const startEdit  = () => { setDraft({ ...profile }); setEditing(true); };
  const cancelEdit = () => setEditing(false);
  const confirmEdit = () => {
    const updated = { ...draft };
    setProfile(updated);
    saveToStorage(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = (field) => ({
    value: draft[field] || '',
    onChange: e => setDraft(p => ({ ...p, [field]: e.target.value })),
    style: S.input,
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* HEADER CARD */}
      <div style={S.headerCard}>
        <div style={S.avatarWrap}>
          <div style={S.avatar}>{profile.name?.[0]?.toUpperCase() || 'E'}</div>
          <div style={S.onlineDot} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h1 style={S.name}>{profile.name}</h1>
              <span style={S.roleBadge}>Employer</span>
            </div>
            <button style={editing ? S.btnCancel : S.btnEdit} onClick={editing ? cancelEdit : startEdit}>
              {editing
                ? <><XMarkIcon style={S.btnIcon} />Cancel</>
                : <><PencilSquareIcon style={S.btnIcon} />Edit Profile</>}
            </button>
          </div>

          <div style={S.metaRow}>
            {profile.company  && <span style={S.metaItem}><BuildingOfficeIcon style={S.metaIcon}/>{profile.company}</span>}
            {profile.category && <span style={S.metaItem}><BriefcaseIcon style={S.metaIcon}/>{profile.category}</span>}
            {profile.location && <span style={S.metaItem}><MapPinIcon style={S.metaIcon}/>{profile.location}</span>}
            {profile.email    && <span style={S.metaItem}><EnvelopeIcon style={S.metaIcon}/>{profile.email}</span>}
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={S.statsGrid}>
        {[
          { label: 'Jobs Posted',   value: profile.jobsPosted },
          { label: 'Avg. Rating',   value: `${avgRating} / 5` },
          { label: 'Total Reviews', value: MOCK_REVIEWS.length },
          { label: 'Member Since',  value: profile.memberSince },
        ].map(s => (
          <div key={s.label} style={S.statBox}>
            <span style={S.statVal}>{s.value}</span>
            <span style={S.statLbl}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* EDIT FORM */}
      {editing && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <PencilSquareIcon style={{ width: 20, height: 20, color: '#fff' }} />
            <h2 style={S.cardTitle}>Edit Profile</h2>
          </div>

          <div style={S.formGrid}>
            <div style={S.field}>
              <label style={S.label}>Contact Name</label>
              <input {...inp('name')} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Company Name</label>
              <input {...inp('company')} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Industry / Category</label>
              <input {...inp('category')} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Location</label>
              <input {...inp('location')} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Email</label>
              <input {...inp('email')} type="email" />
            </div>
            <div style={S.field}>
              <label style={S.label}>Phone</label>
              <input {...inp('phone')} type="tel" />
            </div>
            <div style={{ ...S.field, gridColumn: '1 / -1' }}>
              <label style={S.label}>Website</label>
              <input {...inp('website')} type="url" placeholder="https://yourcompany.com" />
            </div>
          </div>

          <div style={{ ...S.field, marginTop: 16 }}>
            <label style={S.label}>About / Bio</label>
            <textarea
              rows={4}
              style={{ ...S.input, resize: 'vertical' }}
              value={draft.bio}
              onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))}
              placeholder="Describe your company and what you look for in candidates…"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button style={S.btnCancel} onClick={cancelEdit}><XMarkIcon style={S.btnIcon}/>Cancel</button>
            <button style={S.btnSave}   onClick={confirmEdit}>
              <CheckIcon style={S.btnIcon}/>{saved ? 'Saved ✓' : 'Save Profile'}
            </button>
          </div>
        </div>
      )}

      {/* ABOUT (read mode) */}
      {!editing && (
        <div style={S.card}>
          <h2 style={S.sectionTitle}>About</h2>
          <p style={S.aboutText}>{profile.bio || '—'}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
            {[
              { Icon: EnvelopeIcon,       label: 'Email',    value: profile.email },
              { Icon: PhoneIcon,          label: 'Phone',    value: profile.phone },
              { Icon: MapPinIcon,         label: 'Location', value: profile.location },
              { Icon: GlobeAltIcon,       label: 'Website',  value: profile.website },
              { Icon: BuildingOfficeIcon, label: 'Company',  value: profile.company },
              { Icon: BriefcaseIcon,      label: 'Industry', value: profile.category },
            ].filter(r => r.value).map(({ Icon, label, value }) => (
              <div key={label} style={S.infoRow}>
                <div style={S.infoIconWrap}><Icon style={{ width: 16, height: 16, color: '#7c3aed' }} /></div>
                <div>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, wordBreak: 'break-all' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={S.sectionTitle}>Reviews from Students</h2>
          <span style={S.countBadge}>{MOCK_REVIEWS.length} total</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fffbeb', borderRadius: 14, padding: '14px 18px', marginBottom: 20, border: '1px solid #fde68a' }}>
          <span style={{ fontSize: 42, fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>{avgRating}</span>
          <div>
            <StarsRow rating={parseFloat(avgRating)} size={20} />
            <p style={{ fontSize: 13, color: '#92400e', margin: '4px 0 0', fontWeight: 600 }}>{MOCK_REVIEWS.length} reviews from students</p>
          </div>
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

const S = {
  headerCard: {
    background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)',
    border: '1px solid #ddd6fe', borderRadius: 24,
    padding: '28px 32px', display: 'flex', alignItems: 'flex-start',
    gap: 24, marginBottom: 20,
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
  name:     { fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' },
  roleBadge: {
    display: 'inline-block', background: '#7c3aed', color: '#fff',
    fontSize: 11, fontWeight: 700, padding: '3px 10px',
    borderRadius: 100, marginBottom: 10,
  },
  metaRow:  { display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginTop: 2 },
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
  cardTitle:    { fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 },
  sectionTitle: { fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' },
  aboutText:    { fontSize: 14, color: '#374151', lineHeight: 1.75, margin: 0 },

  infoRow: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    background: '#f8fafc', borderRadius: 12, padding: '12px 14px',
  },
  infoIconWrap: {
    width: 32, height: 32, borderRadius: 9, background: '#faf5ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' },
  field:    { display: 'flex', flexDirection: 'column', gap: 5 },
  label:    { fontSize: 13, fontWeight: 700, color: '#374151' },
  input: {
    border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '11px 14px',
    fontSize: 14, color: '#0f172a', outline: 'none',
    background: '#f8fafc', fontFamily: 'inherit', boxSizing: 'border-box', width: '100%',
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

export default EmployerProfilePage;
