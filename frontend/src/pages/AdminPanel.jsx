import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Squares2X2Icon,
  UsersIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  FunnelIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  LockClosedIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  CheckIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckSolid,
  XCircleIcon as XSolid,
} from '@heroicons/react/24/solid';

/* ─── mock data ─────────────────────────────────────── */
const USERS_INIT = [
  { id: 1, name: 'Ahmed Benali',    email: 'ahmed@usthb.dz',          role: 'student',  status: 'active',  joined: '2024-01-10', uni: 'USTHB',                     avatar: 'A', color: '#7c3aed' },
  { id: 2, name: 'Talib Corp',      email: 'hr@talibcorp.dz',         role: 'employer', status: 'active',  joined: '2024-02-14', uni: '—',                          avatar: 'T', color: '#0891b2' },
  { id: 3, name: 'Sara Keddar',     email: 'sara@univ-alger.dz',      role: 'student',  status: 'active',  joined: '2024-03-02', uni: 'University of Algiers',      avatar: 'S', color: '#22c55e' },
  { id: 4, name: 'Mohamed Brahimi', email: 'mo.brahimi@univ-oran.dz', role: 'student',  status: 'banned',  joined: '2023-11-20', uni: 'University of Oran',         avatar: 'M', color: '#ef4444' },
  { id: 5, name: 'Oran Biz Ltd',    email: 'contact@oranbiz.dz',      role: 'employer', status: 'banned',  joined: '2023-12-05', uni: '—',                          avatar: 'O', color: '#f59e0b' },
  { id: 6, name: 'Rania Hadj',      email: 'rania@esi.dz',            role: 'student',  status: 'active',  joined: '2024-04-01', uni: 'ESI Algiers',                avatar: 'R', color: '#ec4899' },
  { id: 7, name: 'Karim Zidane',    email: 'k.zidane@univ-oran.dz',   role: 'student',  status: 'active',  joined: '2024-04-18', uni: 'University of Oran',         avatar: 'K', color: '#8b5cf6' },
  { id: 8, name: 'AlgTech SARL',    email: 'jobs@algtech.dz',         role: 'employer', status: 'active',  joined: '2024-05-03', uni: '—',                          avatar: 'A', color: '#f97316' },
];

const JOBS_INIT = [
  { id: 1, title: 'Customer Support Agent', employer: 'Talib Corp',   salary: '1,200 DZD/day', type: 'Part-Time', status: 'pending',  posted: '2024-06-01', applicants: 45 },
  { id: 2, title: 'Warehouse Assistant',    employer: 'Oran Biz Ltd', salary: '1,500 DZD/day', type: 'Full-Time', status: 'approved', posted: '2024-05-25', applicants: 12 },
  { id: 3, title: 'Event Promoter',         employer: 'AlgTech SARL', salary: '2,000 DZD/day', type: 'Part-Time', status: 'pending',  posted: '2024-06-03', applicants: 8  },
  { id: 4, title: 'Data Entry Clerk',       employer: 'Talib Corp',   salary: '900 DZD/day',   type: 'Part-Time', status: 'approved', posted: '2024-05-20', applicants: 22 },
  { id: 5, title: 'Social Media Manager',   employer: 'AlgTech SARL', salary: '1,800 DZD/day', type: 'Part-Time', status: 'rejected', posted: '2024-05-15', applicants: 5  },
  { id: 6, title: 'Delivery Driver',        employer: 'Oran Biz Ltd', salary: '1,100 DZD/day', type: 'Full-Time', status: 'pending',  posted: '2024-06-05', applicants: 30 },
];

const WARNINGS_INIT = [
  { id: 1, user: 'Mohamed Brahimi', email: 'mo.brahimi@univ-oran.dz', role: 'student', reason: 'Spamming employers with repeated applications', date: '2024-05-30', count: 2, avatar: 'M', color: '#ef4444' },
  { id: 2, user: 'Oran Biz Ltd',    email: 'contact@oranbiz.dz',      role: 'employer', reason: 'Posting misleading salary information', date: '2024-06-01', count: 1, avatar: 'O', color: '#f59e0b' },
  { id: 3, user: 'Unknown Device',  email: 'spam@fake.dz',             role: 'student',  reason: 'Multiple fake account registrations', date: '2024-06-04', count: 3, avatar: '?', color: '#64748b' },
];

const VERIFY_INIT = [
  { id: 1, name: 'Sara Keddar',     email: 'sara@univ-alger.dz',    role: 'student',  uni: 'University of Algiers',   docType: 'Student Card',     submitted: '2024-06-04', status: 'pending', avatar: 'S', color: '#0891b2' },
  { id: 2, name: 'AlgTech SARL',    email: 'jobs@algtech.dz',        role: 'employer', uni: 'Commercial Register',      docType: 'RC Certificate',   submitted: '2024-06-03', status: 'pending', avatar: 'A', color: '#f97316' },
  { id: 3, name: 'Rania Hadj',      email: 'rania@esi.dz',           role: 'student',  uni: 'ESI Algiers',              docType: 'University Letter', submitted: '2024-06-02', status: 'approved', avatar: 'R', color: '#22c55e' },
  { id: 4, name: 'Karim Zidane',    email: 'k.zidane@univ-oran.dz',  role: 'student',  uni: 'University of Oran',       docType: 'Student Card',     submitted: '2024-06-01', status: 'pending', avatar: 'K', color: '#8b5cf6' },
];

/* ─── small shared components ───────────────────────── */
const RolePill = ({ role }) => (
  <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 100, background: role === 'student' ? '#f0f9ff' : '#faf5ff', color: role === 'student' ? '#0891b2' : '#7c3aed', border: `1px solid ${role === 'student' ? '#bae6fd' : '#e9d5ff'}` }}>
    {role === 'student' ? 'Student' : 'Employer'}
  </span>
);

const StatusPill = ({ status, map }) => {
  const cfg = map[status] || { label: status, color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0' };
  return (
    <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 100, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  );
};

const Avatar = ({ letter, color, size = 38 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.42, fontWeight: 900, flexShrink: 0 }}>
    {letter}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 16px', letterSpacing: '-0.3px' }}>{children}</h2>
);

const IconBtn = ({ icon: Icon, color, bg, border, onClick, title }) => (
  <button onClick={onClick} title={title} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${border}`, background: bg, borderRadius: 9, cursor: 'pointer', color, transition: 'all 0.15s', flexShrink: 0 }}>
    <Icon style={{ width: 15, height: 15 }} />
  </button>
);

/* ─── USER STATUS / JOB STATUS maps ─────────────────── */
const USER_STATUS = {
  active: { label: 'Active', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  banned: { label: 'Banned', color: '#ef4444', bg: '#fff5f5', border: '#fecaca' },
};
const JOB_STATUS = {
  pending:  { label: 'Pending',  color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  approved: { label: 'Approved', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  rejected: { label: 'Rejected', color: '#ef4444', bg: '#fff5f5', border: '#fecaca' },
};
const VER_STATUS = {
  pending:  { label: 'Pending',  color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  approved: { label: 'Approved', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  rejected: { label: 'Rejected', color: '#ef4444', bg: '#fff5f5', border: '#fecaca' },
};

/* ═════════════════════════════════════════════════════
   PAGE: OVERVIEW
══════════════════════════════════════════════════════ */
const PageOverview = ({ users, jobs, warnings, verify }) => {
  const totalUsers = users.length;
  const students   = users.filter(u => u.role === 'student').length;
  const employers  = users.filter(u => u.role === 'employer').length;
  const banned     = users.filter(u => u.status === 'banned').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;
  const pendingVer  = verify.filter(v => v.status === 'pending').length;

  const stats = [
    { label: 'Total Users',   value: totalUsers,   icon: UserGroupIcon,        color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
    { label: 'Students',      value: students,     icon: UsersIcon,            color: '#0891b2', bg: '#f0f9ff', border: '#bae6fd' },
    { label: 'Employers',     value: employers,    icon: BriefcaseIcon,        color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
    { label: 'Banned',        value: banned,       icon: NoSymbolIcon,         color: '#ef4444', bg: '#fff5f5', border: '#fecaca' },
    { label: 'Jobs Pending',  value: pendingJobs,  icon: ClockIcon,            color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    { label: 'Verifications', value: pendingVer,   icon: ShieldCheckIcon,      color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: '#fff', border: `1.5px solid ${s.border}`, borderRadius: 20, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 15, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: 22, height: 22, color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.5px' }}>{s.value}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: 0 }}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* recent users + recent jobs side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* recent users */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <SectionTitle>Recent Users</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {users.slice(0, 5).map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                <Avatar letter={u.avatar} color={u.color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{u.email}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <RolePill role={u.role} />
                  <StatusPill status={u.status} map={USER_STATUS} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* recent jobs */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <SectionTitle>Recent Job Posts</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobs.slice(0, 5).map(j => (
              <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BriefcaseIcon style={{ width: 18, height: 18, color: '#7c3aed' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.title}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{j.employer} · {j.salary}</p>
                </div>
                <StatusPill status={j.status} map={JOB_STATUS} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════
   PAGE: USERS
══════════════════════════════════════════════════════ */
const PageUsers = ({ users, setUsers }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const toggle = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u));

  const visible = users
    .filter(u => roleFilter === 'all' || u.role === roleFilter)
    .filter(u => statusFilter === 'all' || u.status === statusFilter)
    .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionTitle>All Users ({users.length})</SectionTitle>

      {/* filters row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320 }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        {[['all','All Roles'],['student','Students'],['employer','Employers']].map(([v,l]) => (
          <button key={v} onClick={() => setRoleFilter(v)} style={{ padding: '9px 18px', borderRadius: 100, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: roleFilter === v ? '#7c3aed' : '#f1f5f9', color: roleFilter === v ? '#fff' : '#475569', transition: 'all 0.15s' }}>{l}</button>
        ))}
        {[['all','All Status'],['active','Active'],['banned','Banned']].map(([v,l]) => (
          <button key={v} onClick={() => setStatusFilter(v)} style={{ padding: '9px 18px', borderRadius: 100, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: statusFilter === v ? '#0f172a' : '#f1f5f9', color: statusFilter === v ? '#fff' : '#475569', transition: 'all 0.15s' }}>{l}</button>
        ))}
      </div>

      {/* table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
              {['User', 'Role', 'Email', 'Joined', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '14px 18px', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < visible.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar letter={u.avatar} color={u.color} />
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>{u.name}</p>
                  </div>
                </td>
                <td style={{ padding: '14px 18px' }}><RolePill role={u.role} /></td>
                <td style={{ padding: '14px 18px', fontSize: 13, color: '#475569', fontWeight: 500 }}>{u.email}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{u.joined}</td>
                <td style={{ padding: '14px 18px' }}><StatusPill status={u.status} map={USER_STATUS} /></td>
                <td style={{ padding: '14px 18px' }}>
                  {u.status === 'active' ? (
                    <button onClick={() => toggle(u.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #fecaca', background: '#fff5f5', color: '#ef4444', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                      <NoSymbolIcon style={{ width: 14, height: 14 }} /> Ban
                    </button>
                  ) : (
                    <button onClick={() => toggle(u.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #bbf7d0', background: '#f0fdf4', color: '#22c55e', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                      <CheckCircleIcon style={{ width: 14, height: 14 }} /> Unban
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>No users match this filter</div>
        )}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════
   PAGE: POSTS & JOBS
══════════════════════════════════════════════════════ */
const PagePosts = ({ jobs, setJobs }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const updateJob = (id, status) => setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));

  const visible = jobs
    .filter(j => filter === 'all' || j.status === filter)
    .filter(j => !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.employer.toLowerCase().includes(search.toLowerCase()));

  const counts = { all: jobs.length, pending: jobs.filter(j => j.status === 'pending').length, approved: jobs.filter(j => j.status === 'approved').length, rejected: jobs.filter(j => j.status === 'rejected').length };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionTitle>Posts & Jobs ({jobs.length})</SectionTitle>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320 }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or employer…" style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        {['all','pending','approved','rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '9px 18px', borderRadius: 100, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: filter === f ? '#7c3aed' : '#f1f5f9', color: filter === f ? '#fff' : '#475569', transition: 'all 0.15s' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} <span style={{ opacity: 0.7, fontSize: 11 }}>({counts[f]})</span>
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
              {['Job Title', 'Employer', 'Salary', 'Type', 'Applicants', 'Posted', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((j, i) => (
              <tr key={j.id} style={{ borderBottom: i < visible.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BriefcaseIcon style={{ width: 16, height: 16, color: '#7c3aed' }} />
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0 }}>{j.title}</p>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', fontWeight: 600 }}>{j.employer}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', fontWeight: 500 }}>{j.salary}</td>
                <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '3px 10px', borderRadius: 8 }}>{j.type}</span></td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{j.applicants}</td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{j.posted}</td>
                <td style={{ padding: '14px 16px' }}><StatusPill status={j.status} map={JOB_STATUS} /></td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {j.status !== 'approved' && (
                      <IconBtn icon={CheckSolid} color="#22c55e" bg="#f0fdf4" border="#bbf7d0" onClick={() => updateJob(j.id, 'approved')} title="Approve" />
                    )}
                    {j.status !== 'rejected' && (
                      <IconBtn icon={XSolid} color="#ef4444" bg="#fff5f5" border="#fecaca" onClick={() => updateJob(j.id, 'rejected')} title="Reject" />
                    )}
                    {j.status !== 'pending' && (
                      <IconBtn icon={ClockIcon} color="#f59e0b" bg="#fffbeb" border="#fde68a" onClick={() => updateJob(j.id, 'pending')} title="Reset to Pending" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>No posts match this filter</div>
        )}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════
   PAGE: WARNINGS
══════════════════════════════════════════════════════ */
const PageWarnings = ({ warnings, setWarnings }) => {
  const remove = (id) => setWarnings(prev => prev.filter(w => w.id !== id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionTitle>Warnings ({warnings.length})</SectionTitle>
      {warnings.length === 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '60px 32px', textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
          <ExclamationTriangleIcon style={{ width: 36, height: 36, margin: '0 auto 12px', color: '#cbd5e1' }} />
          No active warnings
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {warnings.map(w => (
          <div key={w.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <Avatar letter={w.avatar} color={w.color} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <p style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: 0 }}>{w.user}</p>
                <RolePill role={w.role} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', background: '#fff5f5', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: 100 }}>{w.count} warning{w.count > 1 ? 's' : ''}</span>
              </div>
              <p style={{ fontSize: 13, color: '#475569', margin: '0 0 6px', fontWeight: 500 }}>{w.email}</p>
              <div style={{ background: '#fef9ec', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 13, color: '#92400e', margin: 0, fontWeight: 600 }}>⚠️ {w.reason}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{w.date}</span>
              <button onClick={() => remove(w.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                <XMarkIcon style={{ width: 13, height: 13 }} /> Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════
   PAGE: VERIFICATION REQUESTS
══════════════════════════════════════════════════════ */
const PageVerify = ({ verify, setVerify }) => {
  const updateVer = (id, status) => setVerify(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  const [filter, setFilter] = useState('pending');

  const visible = verify.filter(v => filter === 'all' || v.status === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionTitle>Verification Requests ({verify.length})</SectionTitle>

      <div style={{ display: 'flex', gap: 8 }}>
        {['all','pending','approved','rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 18px', borderRadius: 100, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: filter === f ? '#7c3aed' : '#f1f5f9', color: filter === f ? '#fff' : '#475569', transition: 'all 0.15s' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {visible.map(v => {
          const sc = VER_STATUS[v.status];
          return (
            <div key={v.id} style={{ background: '#fff', border: `1.5px solid ${v.status === 'pending' ? '#fde68a' : '#e2e8f0'}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ height: 4, background: sc.color }} />
              <div style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <Avatar letter={v.avatar} color={v.color} size={48} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: '0 0 3px' }}>{v.name}</p>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{v.email}</p>
                  </div>
                  <StatusPill status={v.status} map={VER_STATUS} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                  {[
                    { label: 'Role', value: v.role === 'student' ? 'Student' : 'Employer' },
                    { label: 'Document', value: v.docType },
                    { label: 'Institution', value: v.uni },
                    { label: 'Submitted', value: v.submitted },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: '#f8fafc', borderRadius: 11, padding: '10px 13px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 2px' }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>

                {v.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => updateVer(v.id, 'approved')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(34,197,94,0.25)' }}>
                      <CheckSolid style={{ width: 15, height: 15 }} /> Approve
                    </button>
                    <button onClick={() => updateVer(v.id, 'rejected')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(239,68,68,0.25)' }}>
                      <XSolid style={{ width: 15, height: 15 }} /> Reject
                    </button>
                  </div>
                )}
                {v.status !== 'pending' && (
                  <button onClick={() => updateVer(v.id, 'pending')} style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Reset to Pending
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 600, background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0' }}>
            No requests in this category
          </div>
        )}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════
   PAGE: SEND NOTIFICATION
══════════════════════════════════════════════════════ */
const PageNotifications = () => {
  const [form, setForm] = useState({ target: 'all', title: '', body: '', type: 'info' });
  const [sent, setSent] = useState([]);
  const [sending, setSending] = useState(false);

  const send = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSent(prev => [{ ...form, id: Date.now(), sentAt: new Date().toLocaleTimeString() }, ...prev]);
      setForm(f => ({ ...f, title: '', body: '' }));
      setSending(false);
    }, 800);
  };

  const TYPE_COLORS = { info: '#0891b2', success: '#22c55e', warning: '#f59e0b', alert: '#ef4444' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionTitle>Send Notification</SectionTitle>

      {/* compose card */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 22, padding: '28px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Target */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Target Audience</label>
            <div style={{ position: 'relative' }}>
              <select value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} style={{ width: '100%', padding: '12px 36px 12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', fontFamily: 'inherit', appearance: 'none', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                <option value="all">All Users</option>
                <option value="students">Students Only</option>
                <option value="employers">Employers Only</option>
              </select>
              <ChevronDownIcon style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94a3b8', pointerEvents: 'none' }} />
            </div>
          </div>
          {/* Type */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['info','success','warning','alert'].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{ flex: 1, padding: '11px 0', borderRadius: 11, border: `1.5px solid ${form.type === t ? TYPE_COLORS[t] : '#e2e8f0'}`, background: form.type === t ? `${TYPE_COLORS[t]}12` : '#f8fafc', color: form.type === t ? TYPE_COLORS[t] : '#94a3b8', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize', transition: 'all 0.15s' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* title */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Title</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Notification title…" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#7c3aed'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
        </div>

        {/* body */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Message</label>
          <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write your message here…" rows={4} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#7c3aed'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
        </div>

        <button onClick={send} disabled={sending || !form.title.trim() || !form.body.trim()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', opacity: sending || !form.title.trim() || !form.body.trim() ? 0.6 : 1, transition: 'opacity 0.2s', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}>
          <PaperAirplaneIcon style={{ width: 17, height: 17 }} />
          {sending ? 'Sending…' : 'Send Notification'}
        </button>
      </div>

      {/* sent log */}
      {sent.length > 0 && (
        <div>
          <SectionTitle>Sent History</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sent.map(s => (
              <div key={s.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${TYPE_COLORS[s.type]}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BellIcon style={{ width: 18, height: 18, color: TYPE_COLORS[s.type] }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{s.body}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: TYPE_COLORS[s.type], background: `${TYPE_COLORS[s.type]}14`, padding: '3px 10px', borderRadius: 100 }}>{s.type}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>→ {s.target} · {s.sentAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═════════════════════════════════════════════════════
   PAGE: SETTINGS
══════════════════════════════════════════════════════ */
const SettingSection = ({ icon: Icon, title, children }) => (
  <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '26px 30px', marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ width: 20, height: 20, color: '#fff' }} />
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: 0 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const SettingField = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>{label}</label>
    {children}
  </div>
);

const settingInput = { width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', background: '#f8fafc', fontFamily: 'inherit', boxSizing: 'border-box' };

const SettingToggle = ({ checked, onChange, label, description }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #f8fafc' }}>
    <div>
      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{label}</p>
      {description && <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{description}</p>}
    </div>
    <button onClick={() => onChange(!checked)} style={{ width: 48, height: 26, borderRadius: 100, border: 'none', background: checked ? '#7c3aed' : '#e2e8f0', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: checked ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.18)', transition: 'left 0.2s', display: 'block' }} />
    </button>
  </div>
);

const SaveBtn = ({ saved, onClick }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, border: 'none', background: saved ? '#22c55e' : 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.3s' }}>
      {saved && <CheckIcon style={{ width: 16, height: 16 }} />}
      {saved ? 'Saved!' : 'Save Changes'}
    </button>
  </div>
);

const PageSettings = () => {
  const { lang, toggleLanguage } = useLanguage();

  const [admin, setAdmin] = useState({ name: 'Head Admin', email: 'admin@talibawn.dz', phone: '+213 555 000 001' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [platform, setPlatform] = useState({ fee: '2', maintenanceMode: false, allowRegistrations: true, requireVerification: true, maxJobsPerEmployer: '10' });
  const [adminSaved, setAdminSaved]   = useState(false);
  const [passSaved,  setPassSaved]    = useState(false);
  const [platSaved,  setPlatSaved]    = useState(false);

  const saveAdmin = () => { setAdminSaved(true); setTimeout(() => setAdminSaved(false), 2200); };
  const savePass  = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) return;
    if (passwords.newPass !== passwords.confirm) { alert('Passwords do not match.'); return; }
    setPassSaved(true);
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPassSaved(false), 2200);
  };
  const savePlat  = () => { setPlatSaved(true); setTimeout(() => setPlatSaved(false), 2200); };

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 5px', letterSpacing: '-0.5px' }}>Admin Settings</h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Manage your admin account and platform configuration</p>
      </div>

      {/* Admin Profile */}
      <SettingSection icon={UserCircleIcon} title="Admin Profile">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff' }}>م</div>
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: '#0f172a', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <CameraIcon style={{ width: 12, height: 12, color: '#fff' }} />
            </button>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{admin.name}</p>
            <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#d97706', padding: '3px 10px', borderRadius: 100 }}>ADMIN</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <SettingField label="Display Name">
            <input style={settingInput} value={admin.name} onChange={e => setAdmin(p => ({ ...p, name: e.target.value }))} onFocus={e => e.target.style.borderColor='#7c3aed'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          </SettingField>
          <SettingField label="Email">
            <input style={settingInput} type="email" value={admin.email} onChange={e => setAdmin(p => ({ ...p, email: e.target.value }))} onFocus={e => e.target.style.borderColor='#7c3aed'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          </SettingField>
          <SettingField label="Phone">
            <input style={settingInput} value={admin.phone} onChange={e => setAdmin(p => ({ ...p, phone: e.target.value }))} onFocus={e => e.target.style.borderColor='#7c3aed'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          </SettingField>
        </div>
        <SaveBtn saved={adminSaved} onClick={saveAdmin} />
      </SettingSection>

      {/* Password */}
      <SettingSection icon={LockClosedIcon} title="Password & Security">
        <SettingField label="Current Password">
          <input style={settingInput} type="password" placeholder="••••••••" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} onFocus={e => e.target.style.borderColor='#7c3aed'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
        </SettingField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <SettingField label="New Password">
            <input style={settingInput} type="password" placeholder="••••••••" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} onFocus={e => e.target.style.borderColor='#7c3aed'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          </SettingField>
          <SettingField label="Confirm New Password">
            <input style={settingInput} type="password" placeholder="••••••••" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} onFocus={e => e.target.style.borderColor='#7c3aed'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          </SettingField>
        </div>
        <SaveBtn saved={passSaved} onClick={savePass} />
      </SettingSection>

      {/* Language */}
      <SettingSection icon={GlobeAltIcon} title="Language">
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 18 }}>Choose the language for the admin interface.</p>
        <div style={{ display: 'flex', gap: 14 }}>
          {[{ code: 'en', label: 'English' }, { code: 'ar', label: 'العربية' }].map(opt => {
            const active = lang === opt.code;
            return (
              <button key={opt.code} onClick={() => { if (!active) toggleLanguage(); }} style={{ flex: 1, padding: '16px 18px', borderRadius: 16, border: `2px solid ${active ? '#7c3aed' : '#e2e8f0'}`, background: active ? '#faf5ff' : '#f8fafc', cursor: active ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: 'center', transition: 'all 0.2s', boxShadow: active ? '0 4px 14px rgba(124,58,237,0.14)' : 'none' }}>
                <p style={{ fontSize: 14, fontWeight: 900, color: active ? '#7c3aed' : '#0f172a', margin: '0 0 2px' }}>{opt.label}</p>
                {active && <span style={{ display: 'inline-block', marginTop: 8, fontSize: 11, fontWeight: 800, color: '#7c3aed', background: '#ede9fe', padding: '3px 12px', borderRadius: 100 }}>Active</span>}
              </button>
            );
          })}
        </div>
      </SettingSection>

      {/* Platform Configuration */}
      <SettingSection icon={WrenchScrewdriverIcon} title="Platform Configuration">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 8 }}>
          <SettingField label="Platform Fee (% per day)">
            <input style={settingInput} type="number" min="0" max="100" value={platform.fee} onChange={e => setPlatform(p => ({ ...p, fee: e.target.value }))} onFocus={e => e.target.style.borderColor='#7c3aed'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          </SettingField>
          <SettingField label="Max Jobs per Employer">
            <input style={settingInput} type="number" min="1" value={platform.maxJobsPerEmployer} onChange={e => setPlatform(p => ({ ...p, maxJobsPerEmployer: e.target.value }))} onFocus={e => e.target.style.borderColor='#7c3aed'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          </SettingField>
        </div>
        <SettingToggle checked={platform.allowRegistrations} onChange={v => setPlatform(p => ({ ...p, allowRegistrations: v }))} label="Allow New Registrations" description="Let new users sign up on the platform" />
        <SettingToggle checked={platform.requireVerification} onChange={v => setPlatform(p => ({ ...p, requireVerification: v }))} label="Require Verification for Jobs" description="Employers must be verified before posting jobs" />
        <SettingToggle checked={platform.maintenanceMode} onChange={v => setPlatform(p => ({ ...p, maintenanceMode: v }))} label="Maintenance Mode" description="Take the platform offline for maintenance" />
        <SaveBtn saved={platSaved} onClick={savePlat} />
      </SettingSection>

      {/* Danger Zone */}
      <SettingSection icon={ExclamationTriangleIcon} title="Danger Zone">
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 18 }}>These actions affect the entire platform and cannot be easily undone.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => { if (window.confirm('Clear all warnings? This cannot be undone.')) {} }} style={{ padding: '11px 22px', borderRadius: 12, border: '1.5px solid #fde68a', background: '#fffbeb', color: '#d97706', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
            Clear All Warnings
          </button>
          <button onClick={() => { if (window.confirm('Reset all pending job statuses to pending? This cannot be undone.')) {} }} style={{ padding: '11px 22px', borderRadius: 12, border: '1.5px solid #fecaca', background: '#fff5f5', color: '#ef4444', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
            Reset All Job Statuses
          </button>
        </div>
      </SettingSection>
    </div>
  );
};

/* ═════════════════════════════════════════════════════
   MAIN ADMIN PANEL
══════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: 'home',          label: 'Overview',              labelAr: 'نظرة عامة',         icon: Squares2X2Icon },
  { id: 'users',         label: 'Users',                 labelAr: 'المستخدمون',          icon: UsersIcon,              badge: 'users' },
  { id: 'posts',         label: 'Posts & Jobs',          labelAr: 'المنشورات والوظائف',  icon: BriefcaseIcon,          badge: 'jobs' },
  { id: 'warnings',      label: 'Warnings',              labelAr: 'التحذيرات',           icon: ExclamationTriangleIcon,badge: 'warnings' },
  { id: 'verify',        label: 'Verification Requests', labelAr: 'طلبات التحقق',        icon: CheckBadgeIcon,         badge: 'verify' },
  { id: 'notifications', label: 'Send Notification',     labelAr: 'إرسال إشعار',         icon: BellIcon },
  { id: 'settings',      label: 'Settings',              labelAr: 'الإعدادات',           icon: Cog6ToothIcon },
];

const AdminPanel = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [users,    setUsers]    = useState(USERS_INIT);
  const [jobs,     setJobs]     = useState(JOBS_INIT);
  const [warnings, setWarnings] = useState(WARNINGS_INIT);
  const [verify,   setVerify]   = useState(VERIFY_INIT);

  const badges = {
    users:    users.filter(u => u.status === 'banned').length || null,
    jobs:     jobs.filter(j => j.status === 'pending').length || null,
    warnings: warnings.length || null,
    verify:   verify.filter(v => v.status === 'pending').length || null,
  };

  const pageTitle = NAV_ITEMS.find(n => n.id === activePage)?.[lang === 'ar' ? 'labelAr' : 'label'] ?? '';

  const rtl = lang === 'ar';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Cairo', 'Inter', sans-serif", direction: rtl ? 'rtl' : 'ltr', position: 'relative' }}>

      {/* overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, backdropFilter: 'blur(2px)' }} />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 260, background: 'linear-gradient(180deg,#0f172a 0%,#1e1b4b 100%)', color: '#fff',
        display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0,
        zIndex: 200, flexShrink: 0,
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/assets/logo-07.svg" alt="Logo" style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'contain' }} />
            <div>
              <p style={{ fontSize: 17, fontWeight: 900, color: '#f0ead8', margin: 0 }}>طالب<span style={{ color: '#a78bfa' }}> عون</span></p>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(245,158,11,0.2)', color: '#fcd34d', padding: '2px 8px', borderRadius: 100 }}>ADMIN</span>
            </div>
          </div>
        </div>

        {/* nav */}
        <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', padding: '6px 10px', margin: '0 0 4px' }}>Management</p>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activePage === item.id;
            const badge = item.badge ? badges[item.badge] : null;
            return (
              <button
                key={item.id}
                onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 13, border: 'none', background: active ? 'rgba(124,58,237,0.85)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', textAlign: 'inherit', transition: 'all 0.15s', boxShadow: active ? '0 4px 16px rgba(124,58,237,0.35)' : 'none' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon style={{ width: 19, height: 19, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{lang === 'ar' ? item.labelAr : item.label}</span>
                {badge && (
                  <span style={{ fontSize: 11, fontWeight: 800, background: '#d97706', color: '#fff', padding: '2px 7px', borderRadius: 8 }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* footer */}
        <div style={{ padding: '14px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 13, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900 }}>م</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>{lang === 'ar' ? 'المدير العام' : 'Head Admin'}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>admin@talibawn.dz</p>
            </div>
          </div>
          <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '10px 12px', borderRadius: 11, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <ArrowRightOnRectangleIcon style={{ width: 17, height: 17 }} />
            {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* topbar */}
        <div style={{ height: 64, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <p style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>{pageTitle}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>System Online</span>
          </div>
        </div>

        {/* content */}
        <div style={{ padding: '32px 32px', flex: 1, overflowY: 'auto' }}>
          {activePage === 'home'          && <PageOverview users={users} jobs={jobs} warnings={warnings} verify={verify} />}
          {activePage === 'users'         && <PageUsers users={users} setUsers={setUsers} />}
          {activePage === 'posts'         && <PagePosts jobs={jobs} setJobs={setJobs} />}
          {activePage === 'warnings'      && <PageWarnings warnings={warnings} setWarnings={setWarnings} />}
          {activePage === 'verify'        && <PageVerify verify={verify} setVerify={setVerify} />}
          {activePage === 'notifications' && <PageNotifications />}
          {activePage === 'settings'      && <PageSettings />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
