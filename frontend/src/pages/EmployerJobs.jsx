import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  XMarkIcon,
  MapPinIcon,
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  TagIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckSolid, XCircleIcon as XSolid } from '@heroicons/react/24/solid';

/* ── mock data ── */
const JOBS_INIT = [
  {
    id: 1,
    title: 'Customer Support Agent',
    status: 'active',
    salary: '1,200 DZD/day',
    posted: '3 days ago',
    type: 'Part-Time',
    location: 'Algiers',
    description: 'Handle inbound customer calls and emails for our support centre. Must be fluent in Arabic and French.',
    requirements: ['Fluent Arabic & French', 'Communication skills', 'Basic computer literacy', 'Available weekends'],
    applicants: [
      { id: 'a1', slug: 'ahmed-benali', name: 'Ahmed Benali', uni: 'USTHB', major: 'Computer Science', match: 95, phone: '+213 555 123 456', email: 'ahmed@usthb.dz', location: 'Algiers', avatar: 'A', color: '#7c3aed', status: 'pending', appliedAgo: '5 min ago' },
      { id: 'a2', slug: 'sara-keddar', name: 'Sara Keddar', uni: 'University of Algiers', major: 'Business Admin', match: 88, phone: '+213 555 789 012', email: 'sara@univ-alger.dz', location: 'Blida', avatar: 'S', color: '#0891b2', status: 'accepted', appliedAgo: '2h ago' },
      { id: 'a3', slug: 'farouk-messaoud', name: 'Farouk Messaoud', uni: 'ESI Algiers', major: 'Management Info', match: 76, phone: '+213 555 345 678', email: 'farouk@esi.dz', location: 'Algiers', avatar: 'F', color: '#059669', status: 'pending', appliedAgo: '1 day ago' },
    ],
  },
  {
    id: 2,
    title: 'Warehouse Assistant',
    status: 'active',
    salary: '1,500 DZD/day',
    posted: '1 week ago',
    type: 'Full-Time',
    location: 'Oran',
    description: 'Assist in managing inventory, loading/unloading deliveries, and maintaining a clean and organised warehouse.',
    requirements: ['Physical fitness', 'Reliability & punctuality', 'Teamwork', 'Forklift training (preferred)'],
    applicants: [
      { id: 'b1', name: 'Karim Zidane', uni: 'University of Oran', major: 'Logistics', match: 91, phone: '+213 555 901 234', email: 'karim@univ-oran.dz', location: 'Oran', avatar: 'K', color: '#ef4444', status: 'pending', appliedAgo: 'Yesterday' },
      { id: 'b2', name: 'Rania Hadj', uni: 'ESI Algiers', major: 'Engineering', match: 64, phone: '+213 555 567 890', email: 'rania@esi.dz', location: 'Algiers', avatar: 'R', color: '#f59e0b', status: 'rejected', appliedAgo: '2 days ago' },
    ],
  },
  {
    id: 3,
    title: 'Event Promoter',
    status: 'closed',
    salary: '2,000 DZD/day',
    posted: '2 weeks ago',
    type: 'Part-Time',
    location: 'Constantine',
    description: 'Promote our events across university campuses. Hand out flyers, manage social media posts, and coordinate on-site event logistics.',
    requirements: ['Social media proficiency', 'Outgoing personality', 'Own transportation (preferred)', 'Flexible schedule'],
    applicants: [
      { id: 'c1', name: 'Yacine Boudiaf', uni: 'University of Constantine', major: 'Marketing', match: 83, phone: '+213 555 234 567', email: 'yacine@univ-const.dz', location: 'Constantine', avatar: 'Y', color: '#8b5cf6', status: 'accepted', appliedAgo: '5 days ago' },
    ],
  },
  {
    id: 4,
    title: 'Data Entry Clerk',
    status: 'active',
    salary: '900 DZD/day',
    posted: '5 days ago',
    type: 'Part-Time',
    location: 'Remote',
    description: 'Accurately enter and maintain data in our internal databases. Attention to detail is critical for this role.',
    requirements: ['Fast typing (50+ wpm)', 'Excel / Google Sheets', 'Attention to detail', 'Reliable internet'],
    applicants: [
      { id: 'd1', name: 'Amira Khelil', uni: 'University of Annaba', major: 'Finance', match: 79, phone: '+213 555 678 901', email: 'amira@univ-annaba.dz', location: 'Annaba', avatar: 'A', color: '#ec4899', status: 'pending', appliedAgo: '3 days ago' },
      { id: 'd2', name: 'Bilal Rahmouni', uni: 'USTHB', major: 'Statistics', match: 87, phone: '+213 555 432 109', email: 'bilal@usthb.dz', location: 'Algiers', avatar: 'B', color: '#f97316', status: 'pending', appliedAgo: '4 days ago' },
      { id: 'd3', name: 'Nassim Tebbal', uni: 'University of Tizi Ouzou', major: 'Computer Science', match: 92, phone: '+213 555 876 543', email: 'nassim@univ-tizi.dz', location: 'Tizi Ouzou', avatar: 'N', color: '#0891b2', status: 'accepted', appliedAgo: '5 days ago' },
    ],
  },
];

const STATUS_CFG = {
  active: { label: 'Active', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  closed: { label: 'Closed', color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0' },
};

const APP_STATUS_CFG = {
  pending:  { label: 'Pending',  color: '#f59e0b', bg: '#fffbeb' },
  accepted: { label: 'Accepted', color: '#22c55e', bg: '#f0fdf4' },
  rejected: { label: 'Rejected', color: '#ef4444', bg: '#fff5f5' },
};

/* ── helpers ── */
const Pill = ({ status }) => {
  const c = APP_STATUS_CFG[status];
  return (
    <span style={{ fontSize: 11, fontWeight: 800, color: c.color, background: c.bg, padding: '3px 10px', borderRadius: 100 }}>
      {c.label}
    </span>
  );
};

const MatchBar = ({ value }) => {
  const color = value >= 85 ? '#22c55e' : value >= 65 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 100 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color, minWidth: 32 }}>{value}%</span>
    </div>
  );
};

/* ── View popup (applicant details) ── */
const ViewPopup = ({ job, onClose }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(job.applicants[0]);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 780, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.22)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '28px 28px 0' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Applicants — {job.title}</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{job.applicants.length} candidate{job.applicants.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', flexShrink: 0 }}>
            <XMarkIcon style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0, padding: '20px 28px 28px', flex: 1 }}>
          {/* Sidebar list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderRight: '1px solid #f1f5f9', paddingRight: 16 }}>
            {job.applicants.map(app => (
              <button
                key={app.id}
                onClick={() => setSelected(app)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 14,
                  border: selected?.id === app.id ? '1.5px solid #e9d5ff' : '1.5px solid transparent',
                  background: selected?.id === app.id ? '#faf5ff' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 11, background: `${app.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: app.color, flexShrink: 0 }}>{app.avatar}</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.name}</p>
                  <Pill status={app.status} />
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ paddingLeft: 24 }}>
              {/* Avatar & name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: `${selected.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: selected.color }}>
                  {selected.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>{selected.name}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 6px' }}>{selected.major} · {selected.uni}</p>
                  <Pill status={selected.status} />
                </div>
              </div>

              {/* Match */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Match Score</p>
                <MatchBar value={selected.match} />
              </div>

              {/* Contact info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { icon: EnvelopeIcon, label: 'Email', value: selected.email },
                  { icon: PhoneIcon, label: 'Phone', value: selected.phone },
                  { icon: MapPinIcon, label: 'Location', value: selected.location },
                  { icon: AcademicCapIcon, label: 'University', value: selected.uni },
                  { icon: ClockIcon, label: 'Applied', value: selected.appliedAgo },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', borderRadius: 12, padding: '12px 14px' }}>
                    <Icon style={{ width: 16, height: 16, color: '#7c3aed', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visit Profile Button */}
              <button
                onClick={() => { onClose(); navigate(`/employer/profile/${selected.slug}`); }}
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
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Actions popup (accept / reject per applicant) ── */
const ActionsPopup = ({ job, onClose, onUpdate }) => {
  const [applicants, setApplicants] = useState(job.applicants);

  const update = (id, status) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    onUpdate(job.id, id, status);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.22)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '28px 28px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Manage Applicants</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{job.title} — accept or reject candidates</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', flexShrink: 0 }}>
            <XMarkIcon style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Applicant rows */}
        <div style={{ padding: '16px 28px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {applicants.map(app => (
            <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 16, border: '1px solid #f1f5f9', background: '#fafafa' }}>
              {/* Avatar */}
              <div style={{ width: 46, height: 46, borderRadius: 13, background: `${app.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: app.color, flexShrink: 0 }}>
                {app.avatar}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{app.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{app.uni}</p>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }} />
                  <MatchBar value={app.match} />
                </div>
              </div>
              {/* Status + Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <Pill status={app.status} />
                {app.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => update(app.id, 'accepted')}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, border: 'none', background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      <CheckSolid style={{ width: 13, height: 13 }} /> Accept
                    </button>
                    <button
                      onClick={() => update(app.id, 'rejected')}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      <XSolid style={{ width: 13, height: 13 }} /> Reject
                    </button>
                  </div>
                )}
                {app.status !== 'pending' && (
                  <button
                    onClick={() => update(app.id, 'pending')}
                    style={{ padding: '6px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Post New Job popup ── */
const EMPTY_FORM = { title: '', type: 'Part-Time', location: '', salary: '', description: '', requirements: '' };

const PostJobPopup = ({ onClose, onPost }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(prev => ({ ...prev, [key]: e.target.value })),
  });

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Job title is required';
    if (!form.location.trim())    e.location    = 'Location is required';
    if (!form.salary.trim())      e.salary      = 'Salary is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const reqs = form.requirements.split('\n').map(r => r.trim()).filter(Boolean);
    onPost({
      title:       form.title.trim(),
      type:        form.type,
      location:    form.location.trim(),
      salary:      form.salary.trim(),
      description: form.description.trim(),
      requirements: reqs,
      status:      'active',
      posted:      'Just now',
      applicants:  [],
    });
    onClose();
  };

  const inputStyle = (key) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px', borderRadius: 12,
    border: `1.5px solid ${errors[key] ? '#ef4444' : '#e2e8f0'}`,
    fontSize: 14, fontFamily: 'inherit', color: '#0f172a',
    background: errors[key] ? '#fff5f5' : '#f8fafc',
    outline: 'none', transition: 'border-color 0.15s',
  });

  const labelStyle = { fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 600, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.22)', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusIcon style={{ width: 22, height: 22, color: '#fff' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>Post New Job</h2>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Fill in the details to publish a new opening</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', flexShrink: 0 }}>
            <XMarkIcon style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ margin: '20px 28px 0', height: 1, background: '#f1f5f9' }} />

        {/* Body */}
        <div style={{ padding: '22px 28px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>Job Title *</label>
            <input {...field('title')} placeholder="e.g. Customer Support Agent" style={inputStyle('title')}
              onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.background = '#faf5ff'; }}
              onBlur={e => { e.target.style.borderColor = errors.title ? '#ef4444' : '#e2e8f0'; e.target.style.background = errors.title ? '#fff5f5' : '#f8fafc'; }}
            />
            {errors.title && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0', fontWeight: 600 }}>{errors.title}</p>}
          </div>

          {/* Type + Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Job Type</label>
              <select {...field('type')} style={{ ...inputStyle('type'), cursor: 'pointer', appearance: 'none' }}
                onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.background = '#faf5ff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              >
                {['Part-Time', 'Full-Time', 'Internship', 'Freelance'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Location *</label>
              <input {...field('location')} placeholder="e.g. Algiers, Remote" style={inputStyle('location')}
                onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.background = '#faf5ff'; }}
                onBlur={e => { e.target.style.borderColor = errors.location ? '#ef4444' : '#e2e8f0'; e.target.style.background = errors.location ? '#fff5f5' : '#f8fafc'; }}
              />
              {errors.location && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0', fontWeight: 600 }}>{errors.location}</p>}
            </div>
          </div>

          {/* Salary */}
          <div>
            <label style={labelStyle}>Salary *</label>
            <input {...field('salary')} placeholder="e.g. 1,200 DZD/day" style={inputStyle('salary')}
              onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.background = '#faf5ff'; }}
              onBlur={e => { e.target.style.borderColor = errors.salary ? '#ef4444' : '#e2e8f0'; e.target.style.background = errors.salary ? '#fff5f5' : '#f8fafc'; }}
            />
            {errors.salary && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0', fontWeight: 600 }}>{errors.salary}</p>}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Job Description *</label>
            <textarea {...field('description')} rows={4} placeholder="Describe the role, responsibilities, and expectations…" style={{ ...inputStyle('description'), resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.background = '#faf5ff'; }}
              onBlur={e => { e.target.style.borderColor = errors.description ? '#ef4444' : '#e2e8f0'; e.target.style.background = errors.description ? '#fff5f5' : '#f8fafc'; }}
            />
            {errors.description && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0', fontWeight: 600 }}>{errors.description}</p>}
          </div>

          {/* Requirements */}
          <div>
            <label style={labelStyle}>Requirements <span style={{ fontWeight: 500, textTransform: 'none', letterSpacing: 0, color: '#94a3b8' }}>(one per line)</span></label>
            <textarea {...field('requirements')} rows={4} placeholder={`Fluent Arabic & French\nCommunication skills\nBasic computer literacy`} style={{ ...inputStyle('requirements'), resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => { e.target.style.borderColor = '#7c3aed'; e.target.style.background = '#faf5ff'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
            />
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
            <button
              onClick={onClose}
              style={{ padding: '11px 22px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 22px rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.3)'; }}
            >
              <PlusIcon style={{ width: 16, height: 16 }} />
              Publish Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmDeletePopup = ({ job, onClose, onConfirm }) => {
  if (!job) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 400, padding: 32, textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 64, height: 64, background: '#ffefef', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#ef4444' }}>
          <TrashIcon style={{ width: 32, height: 32 }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>Delete Job Post?</h3>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: '0 0 24px' }}>
          Are you sure you want to delete <strong>"{job.title}"</strong>? This action cannot be undone and all applicant data will be lost.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={() => { onConfirm(job.id); onClose(); }} style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════ */
/*  MAIN PAGE                                             */
/* ══════════════════════════════════════════════════════ */
const EmployerJobs = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(JOBS_INIT);
  const [viewJob, setViewJob] = useState(null);
  const [actJob, setActJob] = useState(null);
  const [delJob, setDelJob] = useState(null);
  const [postOpen, setPostOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleStatusUpdate = (jobId, applicantId, status) => {
    setJobs(prev => prev.map(j => j.id !== jobId ? j : {
      ...j,
      applicants: j.applicants.map(a => a.id === applicantId ? { ...a, status } : a),
    }));
  };

  const handlePostJob = (newJob) => {
    setJobs(prev => [{ ...newJob, id: Date.now() }, ...prev]);
  };

  const handleDeleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  const totalActive = jobs.filter(j => j.status === 'active').length;
  const totalApplicants = jobs.reduce((s, j) => s + j.applicants.length, 0);
  const totalPending = jobs.flatMap(j => j.applicants).filter(a => a.status === 'pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Manage Jobs</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0, fontWeight: 500 }}>Post openings and review applicants</p>
        </div>
        <button
          onClick={() => setPostOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(124,58,237,0.28)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(124,58,237,0.38)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.28)'; }}
        >
          <PlusIcon style={{ width: 18, height: 18 }} />
          {t('postNewJob') || 'Post New Job'}
        </button>
      </div>

      {/* ── Summary pills ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Active Listings', value: totalActive, icon: BriefcaseIcon, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
          { label: 'Total Applicants', value: totalApplicants, icon: UserGroupIcon, color: '#0891b2', bg: '#f0f9ff', border: '#bae6fd' },
          { label: 'Awaiting Review', value: totalPending, icon: ClockIcon, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: '#fff', border: `1.5px solid ${s.border}`, borderRadius: 18, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: 22, height: 22, color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.5px' }}>{s.value}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: 0 }}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['all', 'active', 'closed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ padding: '8px 20px', borderRadius: 100, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: filter === f ? '#7c3aed' : '#f1f5f9', color: filter === f ? '#fff' : '#475569', transition: 'all 0.15s' }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.8 }}>({jobs.filter(j => j.status === f).length})</span>}
          </button>
        ))}
      </div>

      {/* ── Jobs table ── */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
              {['Job Title', 'Status', 'Applicants', 'Salary', 'Type', 'Posted', 'Actions'].map(h => (
                <th key={h} style={{ padding: '15px 20px', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((job, i) => {
              const sc = STATUS_CFG[job.status];
              const pending = job.applicants.filter(a => a.status === 'pending').length;
              return (
                <tr key={job.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  {/* Title */}
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BriefcaseIcon style={{ width: 18, height: 18, color: '#7c3aed' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{job.title}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 500 }}>#{1000 + job.id} · {job.location}</p>
                      </div>
                    </div>
                  </td>
                  {/* Status */}
                  <td style={{ padding: '18px 20px' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: '5px 12px', borderRadius: 100 }}>
                      {sc.label}
                    </span>
                  </td>
                  {/* Applicants */}
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{job.applicants.length}</span>
                      {pending > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', background: '#fffbeb', padding: '2px 8px', borderRadius: 100 }}>
                          {pending} pending
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Salary */}
                  <td style={{ padding: '18px 20px' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{job.salary}</span>
                  </td>
                  {/* Type */}
                  <td style={{ padding: '18px 20px' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '4px 10px', borderRadius: 8 }}>{job.type}</span>
                  </td>
                  {/* Posted */}
                  <td style={{ padding: '18px 20px' }}>
                    <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{job.posted}</span>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {/* View icon */}
                      <button
                        onClick={() => setViewJob(job)}
                        title="View applicants"
                        style={{ width: 36, height: 36, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#7c3aed'; e.currentTarget.style.background = '#faf5ff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#f8fafc'; }}
                      >
                        <EyeIcon style={{ width: 16, height: 16 }} />
                      </button>
                      {/* Manage (pen) icon */}
                      <button
                        onClick={() => setActJob(job)}
                        title="Manage applicants"
                        style={{ width: 36, height: 36, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e'; e.currentTarget.style.background = '#f0fdf4'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#f8fafc'; }}
                      >
                        <PencilSquareIcon style={{ width: 16, height: 16 }} />
                      </button>
                      {/* Delete icon */}
                      <button
                        onClick={() => setDelJob(job)}
                        title="Delete job"
                        style={{ width: 36, height: 36, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#f8fafc'; }}
                      >
                        <TrashIcon style={{ width: 16, height: 16 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: '60px 32px', textAlign: 'center' }}>
            <BriefcaseIcon style={{ width: 40, height: 40, color: '#cbd5e1', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', margin: 0 }}>No jobs match this filter</p>
          </div>
        )}
      </div>

      {/* ── Popups ── */}
      {viewJob && (
        <ViewPopup
          job={viewJob}
          onClose={() => setViewJob(null)}
        />
      )}
      {actJob && (
        <ActionsPopup
          job={actJob}
          onClose={() => setActJob(null)}
          onUpdate={handleStatusUpdate}
        />
      )}
      {delJob && (
        <ConfirmDeletePopup
          job={delJob}
          onClose={() => setDelJob(null)}
          onConfirm={handleDeleteJob}
        />
      )}
      {postOpen && (
        <PostJobPopup
          onClose={() => setPostOpen(false)}
          onPost={handlePostJob}
        />
      )}
    </div>
  );
};

export default EmployerJobs;
