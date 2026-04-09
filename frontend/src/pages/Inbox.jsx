import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  ArrowLeftIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { BriefcaseIcon as BriefcaseSolid, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

/* ─────────────────────────────── helpers ─────────────────────────────── */

const AVATAR_COLORS = [
  '#7c3aed', '#0891b2', '#059669', '#dc2626', '#d97706', '#2563eb', '#7c3aed',
];

function avatarColor(name = '') {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function Avatar({ name, size = 44 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: avatarColor(name),
      color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700,
      fontSize: size * 0.38,
      flexShrink: 0,
      letterSpacing: 0,
    }}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

/* ─────────────────────────────── data ─────────────────────────────────── */

const INIT_CHATS = [
  { id: 1, name: 'Google Team', role: 'Employer · Tech', lastMsg: 'We reviewed your profile. Ready for a quick call?', time: '10:30 AM', unread: 2, online: true, blocked: false },
  { id: 2, name: 'Yassir Logistics', role: 'Employer · Delivery', lastMsg: 'Please bring your student ID tomorrow.', time: 'Yesterday', unread: 0, online: false, blocked: false },
  { id: 3, name: 'Ooredoo HQ', role: 'Employer · Telecom', lastMsg: 'The orientation starts at 9 AM sharp.', time: 'Monday', unread: 0, online: true, blocked: false },
];

const INIT_MESSAGES = {
  1: [
    { id: 1, text: 'Hello! I am interested in the Part-time Developer role.', time: '9:00 AM', sender: 'me' },
    { id: 2, text: 'Hi! Thanks for applying. We reviewed your profile. Ready for a quick call?', time: '10:30 AM', sender: 'other' },
  ],
  2: [
    { id: 1, text: 'Hi, when should I start?', time: 'Yesterday 9:00 AM', sender: 'me' },
    { id: 2, text: 'Please bring your student ID tomorrow.', time: 'Yesterday 10:00 AM', sender: 'other' },
  ],
  3: [
    { id: 1, text: 'Is orientation mandatory?', time: 'Monday 8:00 AM', sender: 'me' },
    { id: 2, text: 'The orientation starts at 9 AM sharp.', time: 'Monday 8:30 AM', sender: 'other' },
  ],
};

const DEAL_STATUS_LABEL = { idle: 'Pending', accepted: 'Accepted', rejected: 'Rejected' };
const DEAL_STATUS_COLOR = { idle: '#f59e0b', accepted: '#22c55e', rejected: '#ef4444' };

/* ─── helpers ─── */
function inputStyle(focused) {
  return {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: `1.5px solid ${focused ? '#7c3aed' : '#e2e8f0'}`,
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', background: '#fff', transition: 'border-color 0.2s',
  };
}

function FormField({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function FocusInput({ type, placeholder, value, onChange, required, min, max }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={onChange} required={required} min={min} max={max}
      style={inputStyle(focused)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function paymentLabel(months, days) {
  const m = parseInt(months) || 0;
  const d = parseInt(days) || 0;
  if (m >= 1) return 'At the end of each month';
  if (d > 0) return 'When the job is finished';
  return '—';
}

function durationLabel(months, days) {
  const m = parseInt(months) || 0;
  const d = parseInt(days) || 0;
  if (m > 0 && d > 0) return `${m} month${m > 1 ? 's' : ''} and ${d} day${d > 1 ? 's' : ''}`;
  if (m > 0) return `${m} month${m > 1 ? 's' : ''}`;
  if (d > 0) return `${d} day${d > 1 ? 's' : ''}`;
  return '—';
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  DEAL POPUP                                                             */
/* ═══════════════════════════════════════════════════════════════════════ */
function DealPopup({ deal, onClose, onAccept, onReject, onSubmit, isOpen, role }) {
  const [form, setForm] = useState({
    jobTitle: '', dailySalary: '',
    durationMonths: '0', durationDays: '0',
    startDate: '', workStart: '08:00', workEnd: '17:00',
    instructions: '',
  });

  if (!isOpen) return null;

  const months = parseInt(form.durationMonths) || 0;
  const days = parseInt(form.durationDays) || 0;
  const hasMonths = months >= 1;
  const hasDuration = months > 0 || days > 0;

  const totalDays = months * 30 + days;
  const salary = parseFloat(form.dailySalary) || 0;
  const studentTotal = salary * totalDays;
  const platformFee = Math.round(salary * 0.02 * totalDays);
  const employerTotal = studentTotal + platformFee;
  const showBreakdown = hasDuration && salary > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasDuration) { alert('Please enter at least 1 month or 1 day for the duration.'); return; }
    onSubmit({ ...form, durationMonths: months, durationDays: days });
  };

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  /* ─── read-only deal view ─── */
  if (deal) {
    const dMonths = parseInt(deal.durationMonths) || 0;
    const dDays = parseInt(deal.durationDays) || 0;
    const dTotalDays = dMonths * 30 + dDays;
    const dSalary = parseFloat(deal.dailySalary) || 0;
    const dStudentTotal = dSalary * dTotalDays;
    const dPlatformFee = Math.round(dSalary * 0.02 * dTotalDays);
    const dEmployerTotal = dStudentTotal + dPlatformFee;
    const dHasMonths = dMonths >= 1;

    const rows = [
      ['Job Title', deal.jobTitle],
      ['Daily Salary', `${deal.dailySalary} DZD`],
      ['Duration', durationLabel(dMonths, dDays)],
      ['Work Hours', `${deal.workStart} → ${deal.workEnd}`],
      ['Start Date', deal.startDate],
    ];
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={onClose}>
        <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.22)', padding: '32px' }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BriefcaseSolid style={{ width: 22, height: 22, color: '#fff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Deal Proposal</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>Status: {DEAL_STATUS_LABEL[deal.status]}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
              <XMarkIcon style={{ width: 18, height: 18 }} />
            </button>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: '4px 20px', marginBottom: 16, border: '1px solid #e2e8f0' }}>
            {rows.map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 700 }}>{value}</span>
              </div>
            ))}
            {deal.instructions && (
              <div style={{ padding: '12px 0' }}>
                <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, margin: '0 0 4px' }}>Instructions</p>
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0 }}>{deal.instructions}</p>
              </div>
            )}
          </div>

          {/* Payment breakdown */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>Payment</p>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>
              {dHasMonths ? 'Released at the end of each month.' : 'Released when the job is finished.'}
            </p>
            {role === 'student' ? (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#374151' }}>{dSalary.toLocaleString()} DZD × {dTotalDays} days</span>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{dStudentTotal.toLocaleString()} DZD</span>
                </div>
                <div style={{ height: 1, background: '#bbf7d0', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#15803d' }}>You receive</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#15803d' }}>{dStudentTotal.toLocaleString()} DZD</span>
                </div>
              </div>
            ) : (
              <div style={{ background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#374151' }}>Student salary ({dSalary.toLocaleString()} × {dTotalDays} days)</span>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{dStudentTotal.toLocaleString()} DZD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: '#7c3aed' }}>Platform fee (2%/day × {dTotalDays} days)</span>
                  <span style={{ fontSize: 13, color: '#7c3aed', fontWeight: 600 }}>+ {dPlatformFee.toLocaleString()} DZD</span>
                </div>
                <div style={{ height: 1, background: '#e9d5ff', margin: '0 0 10px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#6d28d9' }}>You pay total</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#6d28d9' }}>{dEmployerTotal.toLocaleString()} DZD</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${DEAL_STATUS_COLOR[deal.status]}18`, color: DEAL_STATUS_COLOR[deal.status], padding: '8px 16px', borderRadius: 100, fontWeight: 700, fontSize: 13, marginBottom: 20 }}>
            {deal.status === 'accepted' && <CheckCircleIcon style={{ width: 16, height: 16 }} />}
            {deal.status === 'rejected' && <XCircleIcon style={{ width: 16, height: 16 }} />}
            {deal.status === 'idle' && <ClockIcon style={{ width: 16, height: 16 }} />}
            {DEAL_STATUS_LABEL[deal.status]}
          </div>
          {deal.status === 'idle' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={onReject} style={{ flex: 1, padding: '14px', borderRadius: 14, border: '2px solid #fca5a5', background: '#fff5f5', color: '#ef4444', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Reject</button>
              <button onClick={onAccept} style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Accept Deal</button>
            </div>
          )}
          {deal.status !== 'idle' && (
            <button onClick={onClose} style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
          )}
        </div>
      </div>
    );
  }

  /* ─── new deal form ─── */
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '540px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.22)', padding: '32px' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BriefcaseSolid style={{ width: 22, height: 22, color: '#fff' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', margin: 0 }}>Start a Deal</h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>Fill in the job details to propose a deal</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <XMarkIcon style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Job title */}
          <FormField label="Job Title">
            <FocusInput type="text" placeholder="e.g. Barista, Delivery Driver…" value={form.jobTitle} onChange={set('jobTitle')} required />
          </FormField>

          {/* Daily salary */}
          <FormField label="Daily Salary (DZD)">
            <FocusInput type="number" placeholder="1500" value={form.dailySalary} onChange={set('dailySalary')} required min="1" />
          </FormField>

          {/* Duration */}
          <FormField label="Duration" hint="Both can be 0, but at least one must be > 0">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Months</div>
                <FocusInput type="number" placeholder="0" value={form.durationMonths} onChange={set('durationMonths')} min="0" max="60" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Days</div>
                <FocusInput type="number" placeholder="0" value={form.durationDays} onChange={set('durationDays')} min="0" max="30" />
              </div>
            </div>
            {/* Live duration preview */}
            {hasDuration && (
              <div style={{ marginTop: 8, padding: '8px 14px', background: '#f5f3ff', borderRadius: 10, fontSize: 13, color: '#7c3aed', fontWeight: 600 }}>
                Duration: {durationLabel(months, days)}
              </div>
            )}
          </FormField>

          {/* Work hours */}
          <FormField label="Daily Work Hours">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Start Time</div>
                <FocusInput type="time" value={form.workStart} onChange={set('workStart')} required />
              </div>
              <div style={{ fontSize: 18, color: '#94a3b8', fontWeight: 300, marginTop: 20, textAlign: 'center' }}>→</div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>End Time</div>
                <FocusInput type="time" value={form.workEnd} onChange={set('workEnd')} required />
              </div>
            </div>
          </FormField>

          {/* Start date */}
          <FormField label="Start Date">
            <FocusInput type="date" value={form.startDate} onChange={set('startDate')} required />
          </FormField>

          {/* Payment — auto calculated breakdown */}
          {showBreakdown && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>Payment</p>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>
                {hasMonths ? 'Released at the end of each month.' : 'Released when the job is finished.'}
              </p>
              {role === 'student' ? (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#374151' }}>{salary.toLocaleString()} DZD × {totalDays} days</span>
                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{studentTotal.toLocaleString()} DZD</span>
                  </div>
                  <div style={{ height: 1, background: '#bbf7d0', margin: '10px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#15803d' }}>You receive</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#15803d' }}>{studentTotal.toLocaleString()} DZD</span>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#374151' }}>Student salary ({salary.toLocaleString()} × {totalDays} days)</span>
                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{studentTotal.toLocaleString()} DZD</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: '#7c3aed' }}>Platform fee (2%/day × {totalDays} days)</span>
                    <span style={{ fontSize: 13, color: '#7c3aed', fontWeight: 600 }}>+ {platformFee.toLocaleString()} DZD</span>
                  </div>
                  <div style={{ height: 1, background: '#e9d5ff', margin: '0 0 10px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#6d28d9' }}>You pay total</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#6d28d9' }}>{employerTotal.toLocaleString()} DZD</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <FormField label="Instructions" hint="optional">
            <textarea
              placeholder="Any special notes for the worker…"
              value={form.instructions}
              onChange={set('instructions')}
              rows={3}
              style={{ ...inputStyle(false), resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </FormField>

          <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
            Send Deal Proposal
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  INBOX PAGE                                                             */
/* ═══════════════════════════════════════════════════════════════════════ */

const Inbox = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [chats, setChats] = useState(INIT_CHATS);
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dealOpen, setDealOpen] = useState(false);
  const [activeDeal, setActiveDeal] = useState(null); // deal object or null
  const [deals, setDeals] = useState({}); // chatId -> deal object

  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const activeChat = chats.find(c => c.id === selectedChat);
  const chatMessages = messages[selectedChat] || [];

  /* scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  /* close menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* handle ?newChat= param */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('newChat');
    if (!name) return;
    const existing = chats.find(c => c.name === name);
    if (existing) {
      setSelectedChat(existing.id);
    } else {
      const nc = { id: Date.now(), name, role: 'Contact', lastMsg: 'New conversation', time: 'Just now', unread: 0, online: true, blocked: false };
      setChats(p => [nc, ...p]);
      setMessages(p => ({ ...p, [nc.id]: [] }));
      setSelectedChat(nc.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  /* send message */
  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    const msg = { id: Date.now(), text: message.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sender: 'me' };
    setMessages(p => ({ ...p, [selectedChat]: [...(p[selectedChat] || []), msg] }));
    setChats(p => p.map(c => c.id === selectedChat ? { ...c, lastMsg: msg.text, time: msg.time } : c));
    setMessage('');
  };

  /* deal */
  const openDeal = () => {
    const existingDeal = deals[selectedChat];
    setActiveDeal(existingDeal || null);
    setDealOpen(true);
    setMenuOpen(false);
  };

  const submitDeal = (form) => {
    const deal = { ...form, status: 'idle' };
    setDeals(p => ({ ...p, [selectedChat]: deal }));
    setDealOpen(false);
    const dur = durationLabel(form.durationMonths, form.durationDays);
    const pay = paymentLabel(form.durationMonths, form.durationDays);
    const sys = { id: Date.now(), text: `📋 Deal proposed: "${form.jobTitle}" — ${form.dailySalary} DZD/day · ${dur} · ${form.workStart}–${form.workEnd} · Payment: ${pay}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sender: 'me', isSystem: true };
    setMessages(p => ({ ...p, [selectedChat]: [...(p[selectedChat] || []), sys] }));
  };

  const acceptDeal = () => {
    setDeals(p => ({ ...p, [selectedChat]: { ...p[selectedChat], status: 'accepted' } }));
    setDealOpen(false);
    const sys = { id: Date.now(), text: '✅ Deal accepted! The agreement is now active.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sender: 'other', isSystem: true };
    setMessages(p => ({ ...p, [selectedChat]: [...(p[selectedChat] || []), sys] }));
  };

  const rejectDeal = () => {
    setDeals(p => ({ ...p, [selectedChat]: { ...p[selectedChat], status: 'rejected' } }));
    setDealOpen(false);
    const sys = { id: Date.now(), text: '❌ Deal rejected. You can propose a new one.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sender: 'other', isSystem: true };
    setMessages(p => ({ ...p, [selectedChat]: [...(p[selectedChat] || []), sys] }));
  };

  /* block */
  const blockUser = () => {
    setChats(p => p.map(c => c.id === selectedChat ? { ...c, blocked: !c.blocked } : c));
    setMenuOpen(false);
  };

  /* delete chat */
  const deleteChat = () => {
    setChats(p => p.filter(c => c.id !== selectedChat));
    setMessages(p => { const n = { ...p }; delete n[selectedChat]; return n; });
    setSelectedChat(null);
    setMenuOpen(false);
  };

  /* navigate to profile */
  const goToProfile = () => {
    const slug = activeChat?.name?.toLowerCase().replace(/\s+/g, '-');
    const base = location.pathname.startsWith('/employer') ? '/employer' : '/student';
    navigate(`${base}/profile/${slug}`);
  };

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const currentDeal = deals[selectedChat];

  return (
    <div className="inbox-root">
      {/* SIDEBAR */}
      <aside className="inbox-sidebar">
        <div className="sidebar-top">
          <h1 className="sidebar-heading">Messages</h1>
          <div className="search-bar">
            <MagnifyingGlassIcon className="search-ico" />
            <input placeholder="Search conversations…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="chat-list-wrap">
          {filteredChats.length === 0 && (
            <div className="empty-list">No conversations found</div>
          )}
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              className={`chat-row${selectedChat === chat.id ? ' active' : ''}${chat.blocked ? ' blocked' : ''}`}
              onClick={() => { setSelectedChat(chat.id); setMenuOpen(false); }}
            >
              <div className="av-wrap">
                <Avatar name={chat.name} size={48} />
                {chat.online && !chat.blocked && <span className="dot-online" />}
              </div>
              <div className="chat-row-body">
                <div className="chat-row-top">
                  <span className="chat-row-name">{chat.name}</span>
                  <span className="chat-row-time">{chat.time}</span>
                </div>
                <div className="chat-row-bottom">
                  <span className="chat-row-preview">{chat.blocked ? 'Blocked' : chat.lastMsg}</span>
                  {chat.unread > 0 && <span className="unread-pill">{chat.unread}</span>}
                  {deals[chat.id] && (
                    <span className="deal-badge" style={{ background: `${DEAL_STATUS_COLOR[deals[chat.id].status]}22`, color: DEAL_STATUS_COLOR[deals[chat.id].status] }}>
                      Deal
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* CHAT PANEL */}
      <main className="chat-panel">
        {!selectedChat ? (
          <div className="no-chat-state">
            <div className="no-chat-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 64, height: 64 }}>
                <rect width="64" height="64" rx="32" fill="#f1f5f9" />
                <path d="M16 20h32a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H36l-4 4-4-4H16a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z" fill="#cbd5e1" />
                <circle cx="24" cy="32" r="2" fill="#fff" />
                <circle cx="32" cy="32" r="2" fill="#fff" />
                <circle cx="40" cy="32" r="2" fill="#fff" />
              </svg>
            </div>
            <h2 className="no-chat-title">Select a conversation</h2>
            <p className="no-chat-sub">Choose a chat from the left to start messaging</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <header className="chat-header">
              <button className="back-btn" onClick={() => setSelectedChat(null)} title="Back">
                <ArrowLeftIcon style={{ width: 20, height: 20 }} />
              </button>

              <button className="header-identity" onClick={goToProfile}>
                <div className="av-wrap" style={{ position: 'relative' }}>
                  <Avatar name={activeChat?.name} size={40} />
                  {activeChat?.online && <span className="dot-online" style={{ width: 10, height: 10 }} />}
                </div>
                <div className="header-text">
                  <span className="header-name">{activeChat?.name}</span>
                  <span className="header-sub">{activeChat?.online ? '🟢 Online' : '⚫ Offline'} · {activeChat?.role}</span>
                </div>
              </button>

              <div className="header-actions">
                {/* Deal button */}
                <button className={`deal-btn${currentDeal ? ' deal-active' : ''}`} onClick={openDeal}>
                  <BriefcaseSolid style={{ width: 16, height: 16 }} />
                  {currentDeal ? `Deal · ${DEAL_STATUS_LABEL[currentDeal.status]}` : 'Start Deal'}
                </button>

                {/* 3-dot menu */}
                <div className="menu-wrap" ref={menuRef}>
                  <button className="dots-btn" onClick={() => setMenuOpen(p => !p)}>
                    <EllipsisVerticalIcon style={{ width: 22, height: 22 }} />
                  </button>
                  {menuOpen && (
                    <div className="dropdown-menu">
                      <button className="dropdown-item" onClick={blockUser}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                          <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                        {activeChat?.blocked ? 'Unblock User' : 'Block User'}
                      </button>
                      <div className="dropdown-divider" />
                      <button className="dropdown-item danger" onClick={deleteChat}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                        </svg>
                        Delete Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Deal status banner */}
            {currentDeal && (
              <div className="deal-banner" style={{ borderLeftColor: DEAL_STATUS_COLOR[currentDeal.status] }} onClick={openDeal}>
                <BriefcaseSolid style={{ width: 15, height: 15, color: DEAL_STATUS_COLOR[currentDeal.status] }} />
                <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
                  Active deal: <strong>{currentDeal.jobTitle}</strong> — {currentDeal.dailySalary} DZD/day
                </span>
                <span style={{ fontSize: 12, color: DEAL_STATUS_COLOR[currentDeal.status], fontWeight: 700, marginInlineStart: 'auto' }}>
                  {DEAL_STATUS_LABEL[currentDeal.status]}
                </span>
              </div>
            )}

            {/* MESSAGES */}
            <div className="messages-scroll">
              <div className="date-chip">Today</div>
              {activeChat?.blocked ? (
                <div className="blocked-notice">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 32, height: 32, color: '#94a3b8' }}>
                    <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                  <p>You have blocked this user. <button onClick={blockUser} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Unblock</button></p>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`bubble-row ${msg.sender}${msg.isSystem ? ' system' : ''}`}>
                    {msg.isSystem ? (
                      <div className="system-msg">{msg.text}</div>
                    ) : (
                      <div className={`bubble ${msg.sender}`}>
                        <p>{msg.text}</p>
                        <div className="bubble-meta">
                          <span>{msg.time}</span>
                          {msg.sender === 'me' && <CheckIcon style={{ width: 12, height: 12 }} />}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            {!activeChat?.blocked && (
              <footer className="msg-input-bar">
                <button className="attach-btn">
                  <PaperClipIcon style={{ width: 20, height: 20 }} />
                </button>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Type a message…"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  />
                  <button className="send-btn" onClick={sendMessage} disabled={!message.trim()}>
                    <PaperAirplaneIcon style={{ width: 20, height: 20 }} />
                  </button>
                </div>
              </footer>
            )}
          </>
        )}
      </main>

      {/* DEAL POPUP */}
      <DealPopup
        isOpen={dealOpen}
        deal={currentDeal || null}
        onClose={() => setDealOpen(false)}
        onSubmit={submitDeal}
        onAccept={acceptDeal}
        onReject={rejectDeal}
        role={location.pathname.startsWith('/employer') ? 'employer' : 'student'}
      />

      <style>{`
        .inbox-root {
          display: grid;
          grid-template-columns: 340px 1fr;
          height: calc(100vh - 80px);
          background: #f8fafc;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 32px rgba(15,23,42,0.06);
          border: 1px solid #e2e8f0;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ── SIDEBAR ── */
        .inbox-sidebar {
          background: #fff;
          border-inline-end: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar-top {
          padding: 22px 20px 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .sidebar-heading {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 14px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 14px;
        }

        .search-ico {
          width: 17px;
          height: 17px;
          color: #94a3b8;
          flex-shrink: 0;
        }

        .search-bar input {
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
          width: 100%;
          font-family: inherit;
          color: #334155;
        }

        .chat-list-wrap {
          flex: 1;
          overflow-y: auto;
        }

        .empty-list {
          padding: 40px 20px;
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
        }

        .chat-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          width: 100%;
          border: none;
          background: transparent;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
          text-align: start;
          transition: background 0.15s;
          position: relative;
        }

        .chat-row:hover { background: #f8fafc; }
        .chat-row.active {
          background: #f5f3ff;
          border-inline-start: 3px solid #7c3aed;
        }
        .chat-row.blocked { opacity: 0.55; }

        .av-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .dot-online {
          position: absolute;
          bottom: 1px;
          inset-inline-end: 1px;
          width: 11px;
          height: 11px;
          background: #22c55e;
          border: 2px solid #fff;
          border-radius: 50%;
        }

        .chat-row-body {
          flex: 1;
          overflow: hidden;
        }

        .chat-row-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .chat-row-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .chat-row-time {
          font-size: 11px;
          color: #94a3b8;
          white-space: nowrap;
        }

        .chat-row-bottom {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-row-preview {
          font-size: 12.5px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .unread-pill {
          background: #7c3aed;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          min-width: 19px;
          height: 19px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          flex-shrink: 0;
        }

        .deal-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 100px;
          flex-shrink: 0;
        }

        /* ── CHAT PANEL ── */
        .chat-panel {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #f8fafc;
        }

        /* Empty state */
        .no-chat-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .no-chat-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .no-chat-sub {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }

        /* Header */
        .chat-header {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .back-btn {
          background: #f1f5f9;
          border: none;
          border-radius: 10px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #475569;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .back-btn:hover { background: #e2e8f0; }

        .header-identity {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          cursor: pointer;
          flex: 1;
          text-align: start;
          padding: 4px 8px;
          border-radius: 12px;
          transition: background 0.15s;
          min-width: 0;
        }
        .header-identity:hover { background: #f8fafc; }

        .header-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .header-name {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          text-decoration: underline;
          text-underline-offset: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-sub {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
          white-space: nowrap;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .deal-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: 2px solid #7c3aed;
          color: #7c3aed;
          background: #fff;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .deal-btn:hover { background: #f5f3ff; }
        .deal-btn.deal-active {
          background: #7c3aed;
          color: #fff;
          border-color: #7c3aed;
        }
        .deal-btn.deal-active:hover { background: #6d28d9; }

        .menu-wrap {
          position: relative;
        }

        .dots-btn {
          background: #f1f5f9;
          border: none;
          border-radius: 10px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #475569;
          transition: background 0.15s;
        }
        .dots-btn:hover { background: #e2e8f0; }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          inset-inline-end: 0;
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 12px 40px rgba(15,23,42,0.14);
          min-width: 180px;
          padding: 6px;
          z-index: 50;
          animation: dropDown 0.15s ease;
        }

        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 14px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          border-radius: 10px;
          text-align: start;
          font-family: inherit;
          transition: background 0.15s;
        }
        .dropdown-item:hover { background: #f8fafc; }
        .dropdown-item.danger { color: #ef4444; }
        .dropdown-item.danger:hover { background: #fff5f5; }

        .dropdown-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 4px 0;
        }

        /* Deal banner */
        .deal-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: #fffbeb;
          border-bottom: 1px solid #fde68a;
          border-inline-start: 4px solid #f59e0b;
          cursor: pointer;
          transition: background 0.15s;
        }
        .deal-banner:hover { background: #fef3c7; }

        /* Messages */
        .messages-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .date-chip {
          text-align: center;
          font-size: 11.5px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .bubble-row {
          display: flex;
          width: 100%;
        }
        .bubble-row.me { justify-content: flex-end; }
        .bubble-row.other { justify-content: flex-start; }
        .bubble-row.system { justify-content: center; }

        .system-msg {
          background: #f1f5f9;
          color: #475569;
          font-size: 12.5px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid #e2e8f0;
        }

        .bubble {
          max-width: 65%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.55;
        }

        .bubble p { margin: 0; }

        .bubble.me {
          background: #7c3aed;
          color: #fff;
          border-bottom-right-radius: 4px;
          box-shadow: 0 2px 12px rgba(124,58,237,0.25);
        }

        .bubble.other {
          background: #fff;
          color: #0f172a;
          border-bottom-left-radius: 4px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(15,23,42,0.05);
        }

        .bubble-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          margin-top: 5px;
          opacity: 0.65;
        }

        .bubble.me .bubble-meta { justify-content: flex-end; }

        .blocked-notice {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #94a3b8;
          font-size: 14px;
          padding: 40px;
          text-align: center;
        }

        /* Input bar */
        .msg-input-bar {
          background: #fff;
          border-top: 1px solid #e2e8f0;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .attach-btn {
          background: #f1f5f9;
          border: none;
          border-radius: 10px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .attach-btn:hover { background: #e2e8f0; }

        .input-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 6px 6px 6px 16px;
          transition: border-color 0.2s;
        }
        .input-box:focus-within { border-color: #7c3aed; }

        .input-box input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          color: #0f172a;
        }

        .send-btn {
          width: 42px;
          height: 42px;
          background: #7c3aed;
          color: #fff;
          border: none;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .send-btn:hover:not(:disabled) { background: #6d28d9; transform: scale(1.05); }
        .send-btn:disabled { background: #cbd5e1; cursor: not-allowed; }

        /* Scrollbars */
        .chat-list-wrap::-webkit-scrollbar,
        .messages-scroll::-webkit-scrollbar { width: 4px; }
        .chat-list-wrap::-webkit-scrollbar-thumb,
        .messages-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

        /* Responsive */
        @media (max-width: 768px) {
          .inbox-root { grid-template-columns: 1fr; height: calc(100vh - 60px); }
          .inbox-sidebar { ${selectedChat ? 'display: none;' : ''} }
          .chat-panel { ${!selectedChat ? 'display: none;' : ''} }
          .deal-btn span { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Inbox;
