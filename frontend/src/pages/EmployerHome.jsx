import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseIcon,
  UserGroupIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useLanguage } from '../context/LanguageContext';

/* ── load employer profile from localStorage ── */
const EMP_KEY = 'ta_employer_profile';
const EMP_DEFAULT = { name: 'Employer', company: '', location: '', avatarColor: '#7c3aed' };
function loadEmployer() {
  try {
    const s = localStorage.getItem(EMP_KEY);
    return s ? { ...EMP_DEFAULT, ...JSON.parse(s) } : { ...EMP_DEFAULT };
  } catch { return { ...EMP_DEFAULT }; }
}

const STATS = [
  { label: 'Total Applications', value: 16, delta: '+4 this week', icon: UserGroupIcon, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  { label: 'Active Job Posts', value: 4, delta: '2 expiring soon', icon: BriefcaseIcon, color: '#0891b2', bg: '#f0f9ff', border: '#bae6fd' },
  { label: 'Average Rating', value: '4.8', delta: 'Based on 34 reviews', icon: StarIcon, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { label: 'Unread Messages', value: 15, delta: '3 new since yesterday', icon: ChatBubbleLeftRightIcon, color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
];

const APPLICANTS = [
  { id: 1, name: 'Ahmed Benali', job: 'Customer Support Agent', uni: 'USTHB', match: 95, status: 'pending', avatar: 'A', color: '#7c3aed', time: '5 min ago' },
  { id: 2, name: 'Sara Keddar', job: 'Warehouse Assistant', uni: 'University of Algiers', match: 88, status: 'accepted', avatar: 'S', color: '#0891b2', time: '2h ago' },
  { id: 3, name: 'Mohamed Brahimi', job: 'Event Promoter', uni: 'University of Oran', match: 72, status: 'pending', avatar: 'M', color: '#059669', time: '4h ago' },
  { id: 4, name: 'Rania Hadj', job: 'Data Entry Clerk', uni: 'ESI Algiers', match: 64, status: 'rejected', avatar: 'R', color: '#f59e0b', time: 'Yesterday' },
  { id: 5, name: 'Karim Zidane', job: 'Customer Support Agent', uni: 'USTHB', match: 91, status: 'pending', avatar: 'K', color: '#ef4444', time: 'Yesterday' },
];

/* Applications per day this week (Mon → Sun) */
const WEEK_DATA = [
  { day: 'Mon', count: 2 },
  { day: 'Tue', count: 5 },
  { day: 'Wed', count: 3 },
  { day: 'Thu', count: 7 },
  { day: 'Fri', count: 4 },
  { day: 'Sat', count: 1 },
  { day: 'Sun', count: 6 },
];
const WEEK_TOTAL = WEEK_DATA.reduce((s, d) => s + d.count, 0);
const WEEK_MAX = Math.max(...WEEK_DATA.map(d => d.count));

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  color: '#f59e0b', bg: '#fffbeb', icon: ClockIcon },
  accepted: { label: 'Accepted', color: '#22c55e', bg: '#f0fdf4', icon: CheckBadgeIcon },
  rejected: { label: 'Rejected', color: '#ef4444', bg: '#fff5f5', icon: XCircleIcon },
};

/* ── Chart helpers ── */
const CHART_W = 480;
const CHART_H = 200;
const PAD_L = 36;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 32;
const PLOT_W = CHART_W - PAD_L - PAD_R;
const PLOT_H = CHART_H - PAD_T - PAD_B;

function xAt(i) { return PAD_L + (i / (WEEK_DATA.length - 1)) * PLOT_W; }
function yAt(v) { return PAD_T + PLOT_H - (v / (WEEK_MAX || 1)) * PLOT_H; }

const linePath = WEEK_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(d.count)}`).join(' ');
const areaPath = `${linePath} L ${xAt(WEEK_DATA.length - 1)} ${PAD_T + PLOT_H} L ${xAt(0)} ${PAD_T + PLOT_H} Z`;

const yTicks = Array.from({ length: WEEK_MAX + 1 }, (_, i) => i).filter((_, i) => i % 2 === 0 || WEEK_MAX <= 4);

const EmployerHome = () => {
  const { t } = useLanguage();
  const [employer] = useState(loadEmployer);
  const navigate = useNavigate();
  const [hoveredBar, setHoveredBar] = useState(null);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Avatar */}
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff', boxShadow: '0 8px 24px rgba(124,58,237,0.25)', flexShrink: 0 }}>
            {employer.name?.[0]?.toUpperCase() || 'E'}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Welcome back</p>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>👋 {employer.name}</h1>
            {/* Company + location pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 2 }}>
              {employer.company && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#7c3aed', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '3px 10px', borderRadius: 100 }}>
                  <BuildingOfficeIcon style={{ width: 13, height: 13 }} />{employer.company}
                </span>
              )}
              {employer.location && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#0891b2', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '3px 10px', borderRadius: 100 }}>
                  <MapPinIcon style={{ width: 13, height: 13 }} />{employer.location}
                </span>
              )}
              <span style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', alignSelf: 'center' }}>{today}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/employer/jobs')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(124,58,237,0.3)', whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(124,58,237,0.38)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.3)'; }}
        >
          <PlusIcon style={{ width: 18, height: 18 }} />
          {t('postNewJob') || 'Post New Job'}
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{ background: '#fff', border: `1.5px solid ${stat.border}`, borderRadius: 20, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.09)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 22, height: 22, color: stat.color }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: stat.color, background: stat.bg, padding: '4px 10px', borderRadius: 100, border: `1px solid ${stat.border}` }}>
                  <ArrowTrendingUpIcon style={{ width: 11, height: 11, display: 'inline', marginInlineEnd: 4, verticalAlign: 'middle' }} />
                  Live
                </span>
              </div>
              <div>
                <p style={{ fontSize: 34, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', lineHeight: 1, letterSpacing: '-1px' }}>{stat.value}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', margin: '0 0 4px' }}>{stat.label}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 500 }}>{stat.delta}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Two Big Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Recent Applications */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '28px 28px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 2px' }}>Recent Applications</h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontWeight: 500 }}>Latest candidates for your posts</p>
            </div>
            <button
              onClick={() => navigate('/employer/applicants')}
              style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f0ff'}
              onMouseLeave={e => e.currentTarget.style.background = '#faf5ff'}
            >
              See All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {APPLICANTS.map((app) => {
              const sc = STATUS_CONFIG[app.status];
              const StatusIcon = sc.icon;
              return (
                <div
                  key={app.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16, border: '1px solid #f1f5f9', background: '#fafafa', transition: 'background 0.15s, border-color 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f5f0ff'; e.currentTarget.style.borderColor = '#e9d5ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                >
                  {/* Avatar */}
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: `${app.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: app.color, flexShrink: 0 }}>
                    {app.avatar}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.name}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ fontWeight: 700 }}>{app.job}</span> · {app.uni}
                    </p>
                  </div>
                  {/* Match */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: sc.color, background: sc.bg, padding: '3px 10px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <StatusIcon style={{ width: 11, height: 11 }} />
                      {sc.label}
                    </span>
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{app.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Applications Chart */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '28px 28px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 2px' }}>Applications This Week</h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontWeight: 500 }}>Daily breakdown · current week</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#7c3aed', margin: '0 0 2px', letterSpacing: '-1px' }}>{WEEK_TOTAL}</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 500 }}>total applications</p>
            </div>
          </div>

          {/* SVG chart */}
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            style={{ width: '100%', height: 'auto', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Y grid lines */}
            {yTicks.map(v => (
              <g key={v}>
                <line
                  x1={PAD_L} y1={yAt(v)} x2={CHART_W - PAD_R} y2={yAt(v)}
                  stroke="#f1f5f9" strokeWidth="1"
                />
                <text x={PAD_L - 8} y={yAt(v) + 4} textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="600">{v}</text>
              </g>
            ))}

            {/* X axis baseline */}
            <line x1={PAD_L} y1={PAD_T + PLOT_H} x2={CHART_W - PAD_R} y2={PAD_T + PLOT_H} stroke="#e2e8f0" strokeWidth="1.5" />

            {/* Area fill */}
            <path d={areaPath} fill="url(#areaGrad)" />

            {/* Line */}
            <path d={linePath} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Day bars (invisible, for hover) + dots + labels */}
            {WEEK_DATA.map((d, i) => {
              const cx = xAt(i);
              const cy = yAt(d.count);
              const isHovered = hoveredBar === i;
              return (
                <g key={i}>
                  {/* Hover area */}
                  <rect
                    x={cx - 22} y={PAD_T} width={44} height={PLOT_H}
                    fill="transparent"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                    style={{ cursor: 'default' }}
                  />
                  {/* Vertical indicator on hover */}
                  {isHovered && (
                    <line x1={cx} y1={PAD_T} x2={cx} y2={PAD_T + PLOT_H} stroke="#e9d5ff" strokeWidth="1.5" strokeDasharray="4 3" />
                  )}
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <g>
                      <rect x={cx - 26} y={cy - 34} width={52} height={26} rx="8" fill="#7c3aed" />
                      <text x={cx} y={cy - 17} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">{d.count} apps</text>
                    </g>
                  )}
                  {/* Dot */}
                  <circle cx={cx} cy={cy} r={isHovered ? 6 : 4} fill="#7c3aed" stroke="#fff" strokeWidth="2" style={{ transition: 'r 0.15s' }} />
                  {/* Day label */}
                  <text x={cx} y={PAD_T + PLOT_H + 20} textAnchor="middle" fontSize="11" fill={isHovered ? '#7c3aed' : '#94a3b8'} fontWeight={isHovered ? '800' : '600'}>{d.day}</text>
                </g>
              );
            })}
          </svg>

          {/* Weekly summary pills */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 100, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#7c3aed', margin: '0 0 2px' }}>{WEEK_MAX}</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 600 }}>Best day</p>
            </div>
            <div style={{ flex: 1, minWidth: 100, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#22c55e', margin: '0 0 2px' }}>{(WEEK_TOTAL / WEEK_DATA.length).toFixed(1)}</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 600 }}>Daily avg</p>
            </div>
            <div style={{ flex: 1, minWidth: 100, background: '#fff7ed', border: '1px solid #fde68a', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b', margin: '0 0 2px' }}>{WEEK_DATA.filter(d => d.count > 0).length}</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 600 }}>Active days</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployerHome;
