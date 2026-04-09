import React, { useState } from 'react';
import {
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const NOTIF_DATA = [
  {
    id: 1,
    type: 'deal',
    icon: BriefcaseIcon,
    iconBg: '#faf5ff',
    iconColor: '#7c3aed',
    title: 'New Deal Proposal',
    body: 'Google Team sent you a deal proposal for "Frontend Developer" — 2,000 DZD/day',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'deal_accepted',
    icon: CheckCircleIcon,
    iconBg: '#f0fdf4',
    iconColor: '#22c55e',
    title: 'Deal Accepted',
    body: 'Yassir Logistics accepted your deal for "Delivery Coordinator" starting May 1.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'message',
    icon: ChatBubbleLeftRightIcon,
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    title: 'New Message',
    body: 'Ooredoo HQ sent you a message: "The orientation starts at 9 AM sharp."',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 4,
    type: 'deal_rejected',
    icon: XCircleIcon,
    iconBg: '#fff5f5',
    iconColor: '#ef4444',
    title: 'Deal Rejected',
    body: 'Unfortunately, your deal proposal for "Data Entry Clerk" was rejected.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 5,
    type: 'system',
    icon: InformationCircleIcon,
    iconBg: '#fff7ed',
    iconColor: '#f97316',
    title: 'Application Shortlisted',
    body: 'You have been shortlisted for "Customer Support Agent" at Djezzy Group.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 6,
    type: 'message',
    icon: ChatBubbleLeftRightIcon,
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    title: 'New Message',
    body: 'Google Team: "Please bring your laptop to the first session."',
    time: '2 days ago',
    read: true,
  },
  {
    id: 7,
    type: 'system',
    icon: BellIcon,
    iconBg: '#f8fafc',
    iconColor: '#64748b',
    title: 'Weekly Summary',
    body: 'You applied to 3 jobs, received 2 messages, and earned 0 DZD this week.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 8,
    type: 'deal',
    icon: BriefcaseIcon,
    iconBg: '#faf5ff',
    iconColor: '#7c3aed',
    title: 'Deal Completed',
    body: 'Your deal with Mobilis for "Event Promoter" has been marked as complete. Payment released.',
    time: '1 week ago',
    read: true,
  },
];

const FILTERS = ['All', 'Unread', 'Deals', 'Messages', 'System'];

const NotificationsPage = () => {
  const [notifs, setNotifs] = useState(NOTIF_DATA);
  const [filter, setFilter] = useState('All');

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const deleteNotif = (id) => setNotifs(n => n.filter(x => x.id !== id));

  const filtered = notifs.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    if (filter === 'Deals') return n.type === 'deal' || n.type === 'deal_accepted' || n.type === 'deal_rejected';
    if (filter === 'Messages') return n.type === 'message';
    if (filter === 'System') return n.type === 'system';
    return true;
  });

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>Notifications</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{ padding: '10px 20px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', color: '#7c3aed', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 18px', borderRadius: 100, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              background: filter === f ? '#7c3aed' : '#f1f5f9',
              color: filter === f ? '#fff' : '#475569',
              transition: 'all 0.15s',
            }}
          >
            {f}
            {f === 'Unread' && unreadCount > 0 && (
              <span style={{ marginLeft: 6, background: filter === f ? 'rgba(255,255,255,0.3)' : '#7c3aed', color: filter === f ? '#fff' : '#fff', borderRadius: 100, padding: '1px 7px', fontSize: 11 }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 32px', textAlign: 'center' }}>
            <BellIcon style={{ width: 40, height: 40, color: '#cbd5e1', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', margin: 0 }}>No notifications here</p>
          </div>
        ) : (
          filtered.map((notif, i) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  padding: '18px 24px',
                  borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
                  background: notif.read ? '#fff' : '#faf5ff',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={e => e.currentTarget.style.background = notif.read ? '#f8fafc' : '#f5f0ff'}
                onMouseLeave={e => e.currentTarget.style.background = notif.read ? '#fff' : '#faf5ff'}
              >
                {!notif.read && (
                  <span style={{ position: 'absolute', top: 22, left: 8, width: 7, height: 7, borderRadius: '50%', background: '#7c3aed' }} />
                )}
                <div style={{ width: 44, height: 44, borderRadius: 14, background: notif.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 22, height: 22, color: notif.iconColor }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: notif.read ? 600 : 800, color: '#0f172a', margin: 0 }}>{notif.title}</p>
                    <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>{notif.time}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>{notif.body}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 4, borderRadius: 8, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                >
                  <TrashIcon style={{ width: 16, height: 16 }} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
