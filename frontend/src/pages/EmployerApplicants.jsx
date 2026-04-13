import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  AcademicCapIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  UserGroupIcon,
  BriefcaseIcon,
  UserIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckSolid, XCircleIcon as XSolid } from '@heroicons/react/24/solid';

/* ── mock data ── */
const INIT_APPLICANTS = [
  { id: 1, name: 'Ahmed Benali',   slug: 'ahmed-benali',   role: 'Customer Support Agent', uni: 'USTHB',                    status: 'pending',  match: 95, location: 'Algiers',     timeAgo: '5 mins ago',  avatar: 'A', color: '#7c3aed', major: 'Computer Science' },
  { id: 2, name: 'Sara Keddar',    slug: 'sara-keddar',    role: 'Warehouse Assistant',     uni: 'University of Algiers',    status: 'accepted', match: 88, location: 'Blida',       timeAgo: '2 hours ago', avatar: 'S', color: '#0891b2', major: 'Business Admin'  },
  { id: 3, name: 'Mohamed Brahimi',slug: 'mohamed-brahimi',role: 'Event Promoter',          uni: 'University of Oran',       status: 'rejected', match: 42, location: 'Oran',        timeAgo: '1 day ago',   avatar: 'M', color: '#ef4444', major: 'Marketing'       },
  { id: 4, name: 'Rania Hadj',     slug: 'rania-hadj',     role: 'Data Entry Clerk',        uni: 'ESI Algiers',              status: 'pending',  match: 79, location: 'Algiers',     timeAgo: '3 hours ago', avatar: 'R', color: '#f59e0b', major: 'Finance'         },
  { id: 5, name: 'Karim Zidane',   slug: 'karim-zidane',   role: 'Customer Support Agent',  uni: 'University of Oran',       status: 'pending',  match: 91, location: 'Oran',        timeAgo: 'Yesterday',   avatar: 'K', color: '#22c55e', major: 'Logistics'       },
  { id: 6, name: 'Amira Khelil',   slug: 'amira-khelil',   role: 'Warehouse Assistant',     uni: 'University of Annaba',     status: 'accepted', match: 83, location: 'Annaba',      timeAgo: '2 days ago',  avatar: 'A', color: '#ec4899', major: 'Engineering'     },
  { id: 7, name: 'Bilal Rahmouni', slug: 'bilal-rahmouni', role: 'Data Entry Clerk',        uni: 'USTHB',                    status: 'pending',  match: 87, location: 'Algiers',     timeAgo: '4 days ago',  avatar: 'B', color: '#f97316', major: 'Statistics'      },
  { id: 8, name: 'Yacine Boudiaf', slug: 'yacine-boudiaf', role: 'Event Promoter',          uni: 'University of Constantine',status: 'accepted', match: 74, location: 'Constantine', timeAgo: '5 days ago',  avatar: 'Y', color: '#8b5cf6', major: 'Marketing'       },
];

const STATUS_CFG = {
  pending:  { label: 'Pending',  color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  accepted: { label: 'Accepted', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  rejected: { label: 'Rejected', color: '#ef4444', bg: '#fff5f5', border: '#fecaca' },
};

const FILTERS = ['all', 'pending', 'accepted', 'rejected'];

const MatchBar = ({ value }) => {
  const color = value >= 85 ? '#22c55e' : value >= 65 ? '#f59e0b' : '#ef4444';
  const bg    = value >= 85 ? '#f0fdf4' : value >= 65 ? '#fffbeb' : '#fff5f5';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 100, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 800, color, background: bg, minWidth: 38, textAlign: 'center', padding: '2px 6px', borderRadius: 8 }}>{value}%</span>
    </div>
  );
};

/* ── Action modal ── */
const ActionModal = ({ applicant, onClose, onAction }) => {
  const sc = STATUS_CFG[applicant.status];
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 460, boxShadow: '0 32px 80px rgba(0,0,0,0.22)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Coloured top strip */}
        <div style={{ height: 6, background: `linear-gradient(90deg, ${sc.color}, ${sc.color}88)` }} />

        <div style={{ padding: '28px 28px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: `${applicant.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: applicant.color }}>
                {applicant.avatar}
              </div>
              <div>
                <h2 style={{ fontSize: 19, fontWeight: 900, color: '#0f172a', margin: '0 0 3px' }}>{applicant.name}</h2>
                <p style={{ fontSize: 13, color: '#7c3aed', fontWeight: 700, margin: '0 0 6px' }}>{applicant.role}</p>
                <span style={{ fontSize: 11, fontWeight: 800, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: '3px 10px', borderRadius: 100 }}>{sc.label}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            >
              <XMarkIcon style={{ width: 18, height: 18 }} />
            </button>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { icon: AcademicCapIcon, label: 'University', value: applicant.uni },
              { icon: MapPinIcon,      label: 'Location',   value: applicant.location },
              { icon: BriefcaseIcon,   label: 'Major',      value: applicant.major },
              { icon: ClockIcon,       label: 'Applied',    value: applicant.timeAgo },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon style={{ width: 16, height: 16, color: '#7c3aed', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 1px' }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Match */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Match Score</p>
            <MatchBar value={applicant.match} />
          </div>

          {/* Visit Profile Link */}
          <div style={{ padding: '0 0 24px', textAlign: 'center' }}>
            <button
              onClick={() => { onClose(); navigate(`/employer/profile/${applicant.slug}`); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '12px', borderRadius: 12, border: '1.5px solid #e9d5ff',
                background: '#faf5ff', color: '#6d28d9', fontWeight: 800, fontSize: 14,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.borderColor = '#c084fc'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#faf5ff'; e.currentTarget.style.borderColor = '#e9d5ff'; }}
            >
              <UserIcon style={{ width: 18, height: 18 }} />
              Visit Full Profile
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '0 28px 28px', display: 'flex', gap: 10 }}>
          {applicant.status === 'pending' && (
            <>
              <button onClick={() => onAction(applicant.id, 'accepted')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(34,197,94,0.3)' }}>
                <CheckSolid style={{ width: 18, height: 18 }} /> Accept
              </button>
              <button onClick={() => onAction(applicant.id, 'rejected')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}>
                <XSolid style={{ width: 18, height: 18 }} /> Reject
              </button>
            </>
          )}
          {applicant.status === 'accepted' && (
            <button onClick={() => onAction(applicant.id, 'pending')} style={{ flex: 1, padding: '14px', borderRadius: 14, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Reset to Pending
            </button>
          )}
          {applicant.status === 'rejected' && (
            <button onClick={() => onAction(applicant.id, 'pending')} style={{ flex: 1, padding: '14px', borderRadius: 14, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Reset to Pending
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════ */
const EmployerApplicants = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState(INIT_APPLICANTS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const handleAction = (id, status) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setSelected(prev => prev ? { ...prev, status } : null);
  };

  const counts = {
    all: applicants.length,
    pending:  applicants.filter(a => a.status === 'pending').length,
    accepted: applicants.filter(a => a.status === 'accepted').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
  };

  const visible = applicants
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Applicants</h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0, fontWeight: 500 }}>Review and manage candidates for your jobs</p>
      </div>

      {/* ── Summary stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { key: 'all',      label: 'Total',    color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', icon: UserGroupIcon },
          { key: 'pending',  label: 'Pending',  color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: ClockIcon },
          { key: 'accepted', label: 'Accepted', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', icon: CheckCircleIcon },
          { key: 'rejected', label: 'Rejected', color: '#ef4444', bg: '#fff5f5', border: '#fecaca', icon: XCircleIcon },
        ].map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              style={{ background: filter === s.key ? s.bg : '#fff', border: `1.5px solid ${filter === s.key ? s.color : '#e2e8f0'}`, borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s', boxShadow: filter === s.key ? `0 4px 16px ${s.color}22` : '0 2px 6px rgba(0,0,0,0.03)' }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: 20, height: 20, color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 1px', letterSpacing: '-0.5px' }}>{counts[s.key]}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: 0 }}>{s.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <MagnifyingGlassIcon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search by name or job…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#7c3aed'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* ── Cards grid ── */}
      {visible.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', padding: '60px 32px', textAlign: 'center' }}>
          <UserIcon style={{ width: 40, height: 40, color: '#cbd5e1', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', margin: 0 }}>No applicants match this filter</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {visible.map(app => {
            const sc = STATUS_CFG[app.status];
            return (
              <div
                key={app.id}
                style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 22, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
              >
                {/* Top colour strip */}
                <div style={{ height: 5, background: `linear-gradient(90deg, ${sc.color}, ${sc.color}66)` }} />

                <div style={{ padding: '22px 22px 0' }}>
                  {/* Top row: avatar + status + time */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 16, background: `${app.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: app.color, flexShrink: 0 }}>
                        {app.avatar}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: '0 0 2px' }}>{app.name}</h3>
                        <p style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700, margin: 0 }}>{app.role}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Match bar */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Match Score</span>
                    </div>
                    <MatchBar value={app.match} />
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
                    {[
                      { icon: AcademicCapIcon, text: `${app.major} · ${app.uni}` },
                      { icon: MapPinIcon,      text: app.location },
                      { icon: ClockIcon,       text: `Applied ${app.timeAgo}` },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon style={{ width: 15, height: 15, color: '#94a3b8', flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '14px 22px 18px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, marginTop: 'auto' }}>
                  {/* Profile button */}
                  <button
                    onClick={() => navigate(`profile/${app.slug}`)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#7c3aed'; e.currentTarget.style.background = '#faf5ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <UserIcon style={{ width: 15, height: 15 }} />
                    Profile
                  </button>

                  {/* Action button */}
                  <button
                    onClick={() => setSelected(app)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 14px', borderRadius: 12, border: 'none', background: app.status === 'pending' ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : '#f1f5f9', color: app.status === 'pending' ? '#fff' : '#475569', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', boxShadow: app.status === 'pending' ? '0 4px 14px rgba(124,58,237,0.25)' : 'none', transition: 'all 0.15s' }}
                  >
                    {app.status === 'pending' ? (
                      <><CheckCircleIcon style={{ width: 15, height: 15 }} /> Review</>
                    ) : (
                      <><UserIcon style={{ width: 15, height: 15 }} /> Actions</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal ── */}
      {selected && (
        <ActionModal
          applicant={selected}
          onClose={() => setSelected(null)}
          onAction={(id, status) => { handleAction(id, status); setTimeout(() => setSelected(null), 600); }}
        />
      )}
    </div>
  );
};

export default EmployerApplicants;
