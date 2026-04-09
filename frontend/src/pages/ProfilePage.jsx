import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon, MapPinIcon, BriefcaseIcon, AcademicCapIcon, PhoneIcon, EnvelopeIcon, DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const STORAGE_KEY = 'ta_my_profile';
function getStudentCV() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const p = JSON.parse(saved);
    return p.cvUrl ? { url: p.cvUrl, name: p.cvName || 'CV' } : null;
  } catch { return null; }
}

/* ─── Mock profile data keyed by slug ─── */
const PROFILES = {
  'google-team': {
    name: 'Google Team',
    role: 'Employer',
    category: 'Technology',
    location: 'Algiers, Algeria',
    email: 'jobs@google-dz.com',
    phone: '+213 555 100 200',
    bio: 'Google Algeria partners with top universities to offer students real-world experience through part-time roles in engineering, design, and data.',
    avatar: 'G',
    avatarColor: '#0891b2',
    rating: 4.8,
    totalReviews: 34,
    memberSince: 'Jan 2023',
    jobsPosted: 12,
    reviews: [
      { id: 1, author: 'Yacine B.', rating: 5, date: 'Mar 2025', text: 'Very professional and organized. Payment was always on time and the team was welcoming.' },
      { id: 2, author: 'Amira K.', rating: 5, date: 'Feb 2025', text: 'Great experience working part-time here. I learned a lot and the flexibility was amazing.' },
      { id: 3, author: 'Mehdi A.', rating: 4, date: 'Jan 2025', text: 'Good environment, though sometimes communication could be faster. Overall recommended.' },
    ],
  },
  'yassir-logistics': {
    name: 'Yassir Logistics',
    role: 'Employer',
    category: 'Delivery & Logistics',
    location: 'Oran, Algeria',
    email: 'hr@yassir.dz',
    phone: '+213 555 300 400',
    bio: 'Yassir is Algeria\'s leading delivery platform offering flexible part-time delivery and dispatch roles to university students.',
    avatar: 'Y',
    avatarColor: '#059669',
    rating: 4.2,
    totalReviews: 58,
    memberSince: 'Jun 2022',
    jobsPosted: 28,
    reviews: [
      { id: 1, author: 'Farouk M.', rating: 4, date: 'Apr 2025', text: 'Good pay and very flexible schedule. Perfect for a student.' },
      { id: 2, author: 'Sana L.', rating: 5, date: 'Mar 2025', text: 'Always paid on time. Great app to manage shifts.' },
      { id: 3, author: 'Bilal R.', rating: 4, date: 'Feb 2025', text: 'Solid employer. The routes could be better optimized but overall a good experience.' },
    ],
  },
  'ooredoo-hq': {
    name: 'Ooredoo HQ',
    role: 'Employer',
    category: 'Telecommunications',
    location: 'Constantine, Algeria',
    email: 'parttime@ooredoo.dz',
    phone: '+213 555 500 600',
    bio: 'Ooredoo Algeria offers students part-time positions in customer support, retail, and data entry across its regional offices.',
    avatar: 'O',
    avatarColor: '#7c3aed',
    rating: 4.5,
    totalReviews: 21,
    memberSince: 'Sep 2022',
    jobsPosted: 9,
    reviews: [
      { id: 1, author: 'Rania H.', rating: 5, date: 'Mar 2025', text: 'Wonderful people to work with. Highly professional environment.' },
      { id: 2, author: 'Djamel B.', rating: 4, date: 'Jan 2025', text: 'Orientation was very thorough. Felt prepared from day one.' },
    ],
  },
  'me': {
    name: 'Ahmed Benali',
    role: 'Student',
    category: 'Computer Science',
    location: 'Algiers, Algeria',
    email: 'ahmed@usthb.dz',
    phone: '+213 555 123 456',
    bio: 'Computer science student at USTHB, passionate about web development and startups. Open to part-time opportunities in tech and data.',
    avatar: 'A',
    avatarColor: '#7c3aed',
    rating: 4.7,
    totalReviews: 8,
    memberSince: 'Jan 2024',
    jobsPosted: 0,
    reviews: [
      { id: 1, author: 'Google Team', rating: 5, date: 'Mar 2025', text: 'Ahmed was punctual, professional and delivered great work throughout the internship.' },
      { id: 2, author: 'Yassir Logistics', rating: 4, date: 'Feb 2025', text: 'Quick learner and very reliable. Would hire again.' },
      { id: 3, author: 'Ooredoo HQ', rating: 5, date: 'Jan 2025', text: 'Excellent communication skills and always on time. Highly recommended.' },
    ],
  },
};

function StarsDisplay({ rating, size = 16 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <StarSolid
          key={s}
          style={{
            width: size, height: size,
            color: s <= Math.round(rating) ? '#f59e0b' : '#e2e8f0',
          }}
        />
      ))}
    </div>
  );
}

const ProfilePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const profile = PROFILES[slug] || {
    name: slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown',
    role: 'User',
    category: '',
    location: 'Algeria',
    email: '',
    phone: '',
    bio: 'No profile information available yet.',
    avatar: slug?.[0]?.toUpperCase() || '?',
    avatarColor: '#7c3aed',
    rating: 0,
    totalReviews: 0,
    memberSince: '',
    jobsPosted: 0,
    reviews: [],
  };

  const fullStars = Math.floor(profile.rating);
  const hasHalf = profile.rating - fullStars >= 0.5;

  return (
    <div className="profile-page">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeftIcon style={{ width: 18, height: 18 }} />
        Back
      </button>

      <div className="profile-grid">
        {/* ── LEFT CARD ── */}
        <aside className="profile-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar" style={{ background: profile.avatarColor }}>
              {profile.avatar}
            </div>
            <div className="profile-online-dot" />
          </div>

          <h1 className="profile-name">{profile.name}</h1>
          <span className="profile-role-badge">{profile.role}</span>
          {profile.category && <p className="profile-category">{profile.category}</p>}

          {/* Rating summary */}
          {profile.rating > 0 && (
            <div className="rating-summary">
              <span className="rating-number">{profile.rating.toFixed(1)}</span>
              <div>
                <StarsDisplay rating={profile.rating} size={18} />
                <p className="rating-count">{profile.totalReviews} reviews</p>
              </div>
            </div>
          )}

          <div className="profile-divider" />

          {/* Details */}
          <div className="profile-details">
            {profile.location && (
              <div className="detail-row">
                <MapPinIcon style={{ width: 16, height: 16, color: '#7c3aed' }} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.email && (
              <div className="detail-row">
                <EnvelopeIcon style={{ width: 16, height: 16, color: '#7c3aed' }} />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="detail-row">
                <PhoneIcon style={{ width: 16, height: 16, color: '#7c3aed' }} />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.memberSince && (
              <div className="detail-row">
                <AcademicCapIcon style={{ width: 16, height: 16, color: '#7c3aed' }} />
                <span>Member since {profile.memberSince}</span>
              </div>
            )}
            {profile.jobsPosted > 0 && (
              <div className="detail-row">
                <BriefcaseIcon style={{ width: 16, height: 16, color: '#7c3aed' }} />
                <span>{profile.jobsPosted} jobs posted</span>
              </div>
            )}
          </div>

          <button className="msg-btn" onClick={() => navigate(-1)}>
            Send Message
          </button>
        </aside>

        {/* ── RIGHT COLUMN ── */}
        <div className="profile-main">
          {/* About */}
          <section className="profile-section">
            <h2 className="section-title">About</h2>
            <p className="about-text">{profile.bio}</p>
          </section>

          {/* Stats row */}
          {profile.role === 'Employer' && (
            <div className="stats-row">
              {[
                { label: 'Jobs Posted', value: profile.jobsPosted },
                { label: 'Avg. Rating', value: profile.rating > 0 ? `${profile.rating.toFixed(1)} / 5` : 'N/A' },
                { label: 'Total Reviews', value: profile.totalReviews },
                { label: 'Member Since', value: profile.memberSince || '—' },
              ].map(s => (
                <div key={s.label} className="stat-box">
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* CV — shown for student profiles */}
          {profile.role === 'Student' && (() => {
            const cv = getStudentCV();
            return cv ? (
              <section className="profile-section" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: '#f5f3ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <DocumentTextIcon style={{ width: 24, height: 24, color: '#7c3aed' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 2px', fontSize: 15 }}>CV / Resume</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cv.name}</p>
                </div>
                <a
                  href={cv.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '10px 18px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    color: '#fff', fontWeight: 700, fontSize: 13,
                    textDecoration: 'none', flexShrink: 0,
                  }}
                >
                  <ArrowDownTrayIcon style={{ width: 15, height: 15 }} />
                  View CV
                </a>
              </section>
            ) : null;
          })()}

          {/* Reviews */}
          <section className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Reviews</h2>
              {profile.totalReviews > 0 && (
                <span className="review-count-badge">{profile.totalReviews} total</span>
              )}
            </div>

            {profile.reviews.length === 0 ? (
              <div className="no-reviews">
                <StarIcon style={{ width: 32, height: 32, color: '#cbd5e1' }} />
                <p>No reviews yet</p>
              </div>
            ) : (
              <div className="reviews-list">
                {profile.reviews.map(r => (
                  <div key={r.id} className="review-card">
                    <div className="review-top">
                      <div className="reviewer-avatar">{r.author[0]}</div>
                      <div className="reviewer-info">
                        <span className="reviewer-name">{r.author}</span>
                        <span className="review-date">{r.date}</span>
                      </div>
                      <div className="review-stars">
                        <StarsDisplay rating={r.rating} size={14} />
                      </div>
                    </div>
                    <p className="review-text">"{r.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <style>{`
        .profile-page {
          max-width: 1100px;
          margin: 0 auto;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          margin-bottom: 28px;
          font-family: inherit;
          transition: all 0.15s;
        }
        .back-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
          align-items: start;
        }

        /* ── CARD ── */
        .profile-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: sticky;
          top: 20px;
          box-shadow: 0 4px 20px rgba(15,23,42,0.05);
        }

        .profile-avatar-wrap {
          position: relative;
          margin-bottom: 16px;
        }

        .profile-avatar {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          color: #fff;
          font-size: 34px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        }

        .profile-online-dot {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          background: #22c55e;
          border: 3px solid #fff;
          border-radius: 50%;
        }

        .profile-name {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
        }

        .profile-role-badge {
          display: inline-block;
          background: #f5f3ff;
          color: #7c3aed;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px;
          margin-bottom: 6px;
        }

        .profile-category {
          font-size: 13px;
          color: #64748b;
          margin: 4px 0 16px;
        }

        .rating-summary {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fffbeb;
          border-radius: 14px;
          padding: 12px 16px;
          margin-bottom: 4px;
          width: 100%;
          box-sizing: border-box;
        }

        .rating-number {
          font-size: 32px;
          font-weight: 900;
          color: #f59e0b;
          line-height: 1;
        }

        .rating-count {
          font-size: 12px;
          color: #92400e;
          margin: 3px 0 0;
        }

        .profile-divider {
          width: 100%;
          height: 1px;
          background: #f1f5f9;
          margin: 20px 0;
        }

        .profile-details {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #374151;
          font-weight: 500;
          text-align: start;
        }

        .msg-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 16px rgba(124,58,237,0.3);
          transition: transform 0.15s;
        }
        .msg-btn:hover { transform: translateY(-1px); }

        /* ── MAIN ── */
        .profile-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .profile-section {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(15,23,42,0.04);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 16px;
        }

        .section-header .section-title { margin: 0; }

        .review-count-badge {
          background: #f1f5f9;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px;
        }

        .about-text {
          font-size: 14px;
          color: #374151;
          line-height: 1.75;
          margin: 0;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .stat-box {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 2px 8px rgba(15,23,42,0.04);
        }

        .stat-value {
          font-size: 22px;
          font-weight: 900;
          color: #7c3aed;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .no-reviews {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 40px;
          color: #94a3b8;
          font-size: 14px;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-card {
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 20px;
          transition: border-color 0.15s;
        }
        .review-card:hover { border-color: #c4b5fd; }

        .review-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .reviewer-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .reviewer-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .reviewer-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .review-date {
          font-size: 12px;
          color: #94a3b8;
        }

        .review-stars {
          display: flex;
          align-items: center;
        }

        .review-text {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.65;
          margin: 0;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr; }
          .profile-card { position: static; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
