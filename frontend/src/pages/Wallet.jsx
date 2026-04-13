import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  SendHorizonal,
  CreditCard,
  Layers,
} from 'lucide-react';
import ChargilyTopUpModal from '../components/ChargilyTopUpModal';
import ChargilyWithdrawModal from '../components/ChargilyWithdrawModal';

const ALL_TRANSACTIONS = [
  { id: 1,  type: 'credit', amount: 4500, title: 'Job Completion: Google',            date: '2024-04-01', category: 'Earnings'    },
  { id: 2,  type: 'debit',  amount: 1500, title: 'Withdrawal to Card',                date: '2024-03-28', category: 'Withdrawal'  },
  { id: 3,  type: 'credit', amount: 3200, title: 'Job Completion: Delivery Co.',       date: '2024-03-25', category: 'Earnings'    },
  { id: 4,  type: 'credit', amount: 2800, title: 'Job Completion: Tutor Session',     date: '2024-03-20', category: 'Earnings'    },
  { id: 5,  type: 'debit',  amount: 2000, title: 'Withdrawal to Edahabia',            date: '2024-03-15', category: 'Withdrawal'  },
  { id: 6,  type: 'credit', amount: 6000, title: 'Job Completion: Retail Assistant',  date: '2024-03-10', category: 'Earnings'    },
  { id: 7,  type: 'credit', amount: 1800, title: 'Job Completion: Data Entry',        date: '2024-03-05', category: 'Earnings'    },
  { id: 8,  type: 'debit',  amount: 3500, title: 'Withdrawal to CIB Card',            date: '2024-02-28', category: 'Withdrawal'  },
  { id: 9,  type: 'credit', amount: 4100, title: 'Job Completion: Event Staff',       date: '2024-02-22', category: 'Earnings'    },
  { id: 10, type: 'credit', amount: 2200, title: 'Job Completion: Customer Support',  date: '2024-02-17', category: 'Earnings'    },
  { id: 11, type: 'debit',  amount: 1000, title: 'Withdrawal to Card',                date: '2024-02-10', category: 'Withdrawal'  },
  { id: 12, type: 'credit', amount: 5500, title: 'Job Completion: Logistics Asst.',   date: '2024-02-05', category: 'Earnings'    },
];

const RECENT = ALL_TRANSACTIONS.slice(0, 3);

const totalEarned    = ALL_TRANSACTIONS.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
const totalWithdrawn = ALL_TRANSACTIONS.filter(t => t.type === 'debit').reduce((s, t)  => s + t.amount, 0);

const TxRow = ({ tx }) => (
  <div className="tx-item">
    <div className={`tx-icon ${tx.type}`}>
      {tx.type === 'credit' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
    </div>
    <div className="tx-info">
      <span className="tx-title">{tx.title}</span>
      <span className="tx-date">{tx.date}</span>
    </div>
    <div className="tx-right">
      <div className={`tx-amount ${tx.type}`}>
        {tx.type === 'credit' ? '+' : '-'} Da {tx.amount.toLocaleString()}
      </div>
      <div className="tx-category">{tx.category}</div>
    </div>
  </div>
);

/* ─────────────── BALANCE CARD ─────────────── */
const BalanceCard = ({ isEmployer, onWithdraw, onTopUp }) => {
  const isEmp = isEmployer;

  return (
    <div className={`bc-root ${isEmp ? 'bc-employer' : 'bc-student'}`}>
      <div className="bc-blob bc-blob-1" />
      <div className="bc-blob bc-blob-2" />
      <div className="bc-grid-overlay" />

      <div className="bc-inner" style={{ alignItems: 'center', textAlign: 'center', gap: 32 }}>
        <div className="bc-balance-block">
          <span className="bc-balance-label" style={{ marginBottom: 8 }}>{t('availableBalance') || 'Available Balance'}</span>
          <div className="bc-balance-row" style={{ justifyContent: 'center' }}>
            <span className="bc-currency" style={{ fontSize: 24 }}>Da</span>
            <span className="bc-amount" style={{ fontSize: 64 }}>12,500</span>
          </div>
        </div>

        <div className="bc-actions" style={{ width: '100%', maxWidth: 300 }}>
          <button className="bc-btn-primary" onClick={onWithdraw} style={{ width: '100%' }}>
            <SendHorizonal size={16} />
            <span>{t('withdrawFunds') || 'Withdraw Funds'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────── WALLET ─────────────── */
const Wallet = ({ isEmployer }) => {
  const { t } = useLanguage();
  const [showTopUpModal, setShowTopUpModal]       = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAllTx, setShowAllTx]                 = useState(false);
  const [txSearch, setTxSearch]                   = useState('');
  const [txFilter, setTxFilter]                   = useState('all');

  const filteredTx = ALL_TRANSACTIONS.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(txSearch.toLowerCase());
    const matchesFilter = txFilter === 'all' || tx.type === txFilter;
    return matchesSearch && matchesFilter;
  });

  if (showAllTx) {
    return (
      <div className="wallet-page">
        <div className="tx-page-header">
          <button className="back-btn" onClick={() => { setShowAllTx(false); setTxSearch(''); setTxFilter('all'); }}>
            <ArrowLeft size={18} />
            <span>Back to Wallet</span>
          </button>
          <div className="tx-page-title-group">
            <h1 className="page-title">Transactions</h1>
            <p className="page-subtitle">Full history of your wallet activity</p>
          </div>
        </div>

        <div className="tx-controls">
          <div className="tx-search-wrap">
            <Search size={15} className="tx-search-icon" />
            <input
              className="tx-search-input"
              placeholder="Search transactions…"
              value={txSearch}
              onChange={e => setTxSearch(e.target.value)}
            />
          </div>
          <div className="tx-filter-group">
            {['all', 'credit', 'debit'].map(f => (
              <button
                key={f}
                className={`tx-filter-pill ${txFilter === f ? 'active' : ''}`}
                onClick={() => setTxFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'credit' ? 'Earnings' : 'Withdrawals'}
              </button>
            ))}
          </div>
        </div>

        <div className="card tx-full-card">
          <div className="tx-summary-row">
            <div className="tx-summary-item credit">
              <span className="tx-summary-label">Total Earned</span>
              <span className="tx-summary-val">+ Da {totalEarned.toLocaleString()}</span>
            </div>
            <div className="tx-summary-divider" />
            <div className="tx-summary-item debit">
              <span className="tx-summary-label">Total Withdrawn</span>
              <span className="tx-summary-val">- Da {totalWithdrawn.toLocaleString()}</span>
            </div>
            <div className="tx-summary-divider" />
            <div className="tx-summary-item neutral">
              <span className="tx-summary-label">Total Transactions</span>
              <span className="tx-summary-val">{ALL_TRANSACTIONS.length}</span>
            </div>
          </div>
          <div className="transaction-list">
            {filteredTx.length === 0 ? (
              <div className="tx-empty">
                <SlidersHorizontal size={32} style={{ opacity: 0.25 }} />
                <span>No transactions match your search.</span>
              </div>
            ) : (
              filteredTx.map(tx => <TxRow key={tx.id} tx={tx} />)
            )}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: walletStyles }} />
      </div>
    );
  }

  return (
    <div className="wallet-page">
      <header className="page-header">
        <h1 className="page-title">{t('wallet')}</h1>
        <p className="page-subtitle">{t('walletSubtitle')}</p>
      </header>

      <div className="wallet-grid">

        {/* ── NEW BALANCE CARD ── */}
        <BalanceCard
          isEmployer={isEmployer}
          onWithdraw={() => setShowWithdrawModal(true)}
          onTopUp={() => setShowTopUpModal(true)}
        />

        {/* ── PAYOUT METHODS ── */}
        <div className="card bank-details-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'white' }}>
            <CreditCard size={32} style={{ opacity: 0.5 }} />
            <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.5px' }}>Not Available For Now</span>
            <span style={{ fontSize: 13, opacity: 0.7, fontWeight: 600 }}>Payment system is Chargily Gateway by default</span>
          </div>
          <h3 className="card-title">{t('savedPayoutMethods')}</h3>
          <div className="bank-list">
            <div className="bank-item active">
              <div className="bank-logo chargily"></div>
              <div className="bank-info">
                <span className="bank-name">{t('chargilyGateway')}</span>
                <span className="bank-acc">CIB & Edahabia Processing</span>
              </div>
              <div className="status-tag">{t('primary')}</div>
            </div>
            <div className="bank-item coming-soon">
              <div className="bank-logo dahabia"></div>
              <div className="bank-info">
                <span className="bank-name">{t('edahabiaCard')}</span>
                <span className="bank-acc">Direct Linking</span>
              </div>
              <div className="coming-soon-badge">{t('comingSoon')}</div>
            </div>
          </div>
          <button className="add-method-btn">{t('addNewMethod')}</button>
        </div>

        {/* ── RECENT TRANSACTIONS ── */}
        <div className="card transactions-card">
          <div className="card-header">
            <h3 className="card-title">{t('recentTransactions')}</h3>
            <button className="view-all-btn" onClick={() => setShowAllTx(true)}>
              {t('viewAll')}
            </button>
          </div>
          <div className="transaction-list">
            {RECENT.map(tx => <TxRow key={tx.id} tx={tx} />)}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: walletStyles }} />

      {showTopUpModal    && <ChargilyTopUpModal    onClose={() => setShowTopUpModal(false)}    />}
      {showWithdrawModal && <ChargilyWithdrawModal onClose={() => setShowWithdrawModal(false)} />}
    </div>
  );
};

/* ═══════════════ STYLES ═══════════════ */
const walletStyles = `
  .wallet-page { display: flex; flex-direction: column; gap: 32px; }
  .page-header { margin-bottom: 0; }
  .page-title { font-size: 28px; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
  .page-subtitle { color: var(--text-muted); font-size: 14px; }

  /* ── Grid ── */
  .wallet-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  /* ════════════════════════════════
     BALANCE CARD — new design
  ════════════════════════════════ */
  .bc-root {
    grid-column: span 1;
    border-radius: 24px;
    padding: 2px;
    position: relative;
    overflow: hidden;
  }

  /* student: purple → violet */
  .bc-student {
    background: linear-gradient(135deg, #4C1D95 0%, #6D28D9 40%, #7C3AED 70%, #5B21B6 100%);
    box-shadow: 0 20px 60px -10px rgba(109, 40, 217, 0.45);
  }

  /* employer: ocean blue → teal */
  .bc-employer {
    background: linear-gradient(135deg, #0F4C75 0%, #1B6CA8 40%, #0E7490 70%, #0369A1 100%);
    box-shadow: 0 20px 60px -10px rgba(14, 116, 144, 0.45);
  }

  /* animated noise/mesh blobs */
  .bc-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    opacity: 0.35;
    animation: bc-float 8s ease-in-out infinite;
  }
  .bc-blob-1 {
    width: 320px; height: 320px;
    top: -120px; right: -80px;
    background: rgba(255, 255, 255, 0.2);
    animation-delay: 0s;
  }
  .bc-blob-2 {
    width: 200px; height: 200px;
    bottom: -80px; left: 60px;
    background: rgba(255, 255, 255, 0.12);
    animation-delay: -4s;
  }
  @keyframes bc-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, -20px) scale(1.05); }
  }

  /* dot grid overlay */
  .bc-grid-overlay {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  .bc-inner {
    position: relative;
    z-index: 1;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* top bar */
  .bc-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bc-account-badge {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 100px;
    padding: 5px 14px;
    font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.85);
    letter-spacing: 0.3px;
  }
  .bc-badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #4ADE80;
    box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.25);
    animation: pulse-status 2s infinite;
  }
  .bc-chip {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.10);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 13px; font-weight: 800; color: rgba(255,255,255,0.9);
    letter-spacing: 0.3px;
  }

  /* balance */
  .bc-balance-block { display: flex; flex-direction: column; gap: 6px; }
  .bc-balance-label {
    font-size: 11px; font-weight: 700; letter-spacing: 1.8px;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
  }
  .bc-balance-row { display: flex; align-items: baseline; gap: 10px; }
  .bc-currency {
    font-size: 20px; font-weight: 700; color: rgba(255,255,255,0.55);
  }
  .bc-amount {
    font-size: 52px; font-weight: 900; letter-spacing: -3px; line-height: 1;
    color: #FFFFFF;
    text-shadow: 0 2px 20px rgba(0,0,0,0.2);
  }

  /* divider */
  .bc-divider { height: 1px; background: rgba(255,255,255,0.12); }

  /* stats strip */
  .bc-stats {
    display: flex;
    align-items: center;
    gap: 0;
  }
  .bc-stat {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
  }
  .bc-stat:first-child { padding-left: 0; }
  .bc-stat:last-child  { padding-right: 0; }
  .bc-stat-icon { flex-shrink: 0; }
  .bc-stat-icon.up      { color: #86EFAC; }
  .bc-stat-icon.down    { color: #FCA5A5; }
  .bc-stat-icon.neutral { color: rgba(255,255,255,0.55); }
  .bc-stat div { display: flex; flex-direction: column; gap: 2px; }
  .bc-stat-val { font-size: 14px; font-weight: 800; color: #FFFFFF; }
  .bc-stat-lbl { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.45); letter-spacing: 0.3px; text-transform: uppercase; }
  .bc-stat-sep { width: 1px; height: 36px; background: rgba(255,255,255,0.12); flex-shrink: 0; }

  /* action buttons */
  .bc-actions { display: flex; gap: 12px; }
  .bc-btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    flex: 1; padding: 14px 24px; border-radius: 14px; border: none;
    background: rgba(255,255,255,0.95); color: #4C1D95;
    font-weight: 800; font-size: 14px; cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  .bc-employer .bc-btn-primary { color: #0C4A6E; }
  .bc-btn-primary:hover { background: white; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

  .bc-btn-secondary {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    flex: 1; padding: 14px 24px; border-radius: 14px;
    border: 1.5px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.9);
    font-weight: 800; font-size: 14px; cursor: pointer;
    backdrop-filter: blur(8px);
    transition: all 0.2s;
  }
  .bc-btn-secondary:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.5); transform: translateY(-2px); }

  /* ─────────── Existing card styles ─────────── */
  .card {
    background: white; border-radius: 20px; padding: 24px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    transition: all 0.3s;
  }
  .card:hover { box-shadow: 0 12px 24px rgba(124,58,237,0.08); transform: translateY(-2px); }

  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .card-title { font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 16px; }

  .bank-list { display: flex; flex-direction: column; gap: 12px; }
  .bank-item {
    display: flex; align-items: center; gap: 16px; padding: 16px;
    border-radius: 16px; border: 1px solid var(--border); transition: all 0.2s;
  }
  .bank-item.active { border-color: var(--primary); background: var(--primary-light); }
  .bank-item.coming-soon { opacity: 0.6; pointer-events: none; background: #F8FAFC; }
  .bank-logo { width: 40px; height: 40px; border-radius: 8px; background: var(--bg-hover); }
  .bank-logo.chargily { background: white url('/assets/Chargily-logo.webp') center/contain no-repeat; background-size: 80%; border: 1px solid #E2E8F0; }
  .bank-logo.dahabia  { background: url('/assets/edahabia.webp') center/cover; }
  .bank-info { flex: 1; display: flex; flex-direction: column; }
  .bank-name { font-size: 14px; font-weight: 700; color: var(--text-main); }
  .bank-acc  { font-size: 12px; color: var(--text-muted); }
  .status-tag { font-size: 10px; font-weight: 800; color: var(--primary); background: white; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; }
  .coming-soon-badge { font-size: 10px; font-weight: 800; color: #64748B; background: #E2E8F0; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; }
  .add-method-btn {
    margin-top: 16px; width: 100%; padding: 12px;
    border: 1px dashed var(--border); border-radius: 12px;
    background: transparent; color: var(--text-muted); font-weight: 600; cursor: pointer; transition: all 0.2s;
  }
  .add-method-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }

  .transactions-card { grid-column: span 2; }
  .transaction-list { display: flex; flex-direction: column; }
  .tx-item { display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); }
  .tx-item:last-child { border-bottom: none; }
  .tx-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tx-icon.credit { background: #f0fdf4; color: #16a34a; }
  .tx-icon.debit  { background: #fef2f2; color: #dc2626; }
  .tx-info { flex: 1; display: flex; flex-direction: column; }
  .tx-title { font-size: 14px; font-weight: 700; color: var(--text-main); }
  .tx-date  { font-size: 12px; color: var(--text-muted); }
  .tx-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .tx-amount { font-weight: 700; font-size: 14px; }
  .tx-amount.credit { color: #16a34a; }
  .tx-amount.debit  { color: #dc2626; }
  .tx-category { font-size: 11px; font-weight: 700; color: #94A3B8; background: #F8FAFC; border: 1px solid #F1F5F9; padding: 2px 8px; border-radius: 20px; }
  .view-all-btn { background: none; border: none; color: var(--primary); font-weight: 700; font-size: 14px; cursor: pointer; transition: opacity 0.2s; }
  .view-all-btn:hover { opacity: 0.7; }

  /* ─── Transactions page ─── */
  .tx-page-header { display: flex; flex-direction: column; gap: 12px; }
  .back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: none; border: none; color: var(--primary, #6D28D9);
    font-weight: 700; font-size: 14px; cursor: pointer; padding: 0;
    width: fit-content; transition: opacity 0.2s;
  }
  .back-btn:hover { opacity: 0.7; }
  .tx-page-title-group { display: flex; flex-direction: column; gap: 4px; }
  .tx-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .tx-search-wrap { position: relative; flex: 1; min-width: 200px; }
  .tx-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94A3B8; pointer-events: none; }
  [dir="rtl"] .tx-search-icon { left: auto; right: 14px; }
  .tx-search-input {
    width: 100%; padding: 10px 14px 10px 40px; border: 1px solid #E2E8F0;
    border-radius: 12px; font-size: 14px; font-weight: 500; color: #0F172A;
    background: white; outline: none; transition: border-color 0.2s; box-sizing: border-box;
  }
  [dir="rtl"] .tx-search-input { padding: 10px 40px 10px 14px; }
  .tx-search-input:focus { border-color: #8B5CF6; }
  .tx-filter-group { display: flex; gap: 8px; }
  .tx-filter-pill {
    padding: 8px 16px; border-radius: 100px; border: 1px solid #E2E8F0; background: white;
    font-size: 13px; font-weight: 700; color: #64748B; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .tx-filter-pill:hover { border-color: #8B5CF6; color: #8B5CF6; }
  .tx-filter-pill.active { background: #6D28D9; color: white; border-color: #6D28D9; }
  .tx-full-card { display: flex; flex-direction: column; gap: 0; }
  .tx-summary-row {
    display: flex; align-items: center; gap: 0;
    background: #F8FAFC; border-radius: 14px; border: 1px solid #F1F5F9;
    margin-bottom: 24px; overflow: hidden;
  }
  .tx-summary-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 16px 12px; }
  .tx-summary-label { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.4px; }
  .tx-summary-val { font-size: 17px; font-weight: 900; }
  .tx-summary-item.credit  .tx-summary-val { color: #16a34a; }
  .tx-summary-item.debit   .tx-summary-val { color: #dc2626; }
  .tx-summary-item.neutral .tx-summary-val { color: #0F172A; }
  .tx-summary-divider { width: 1px; height: 40px; background: #E2E8F0; flex-shrink: 0; }
  .tx-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 20px; color: #94A3B8; font-size: 14px; font-weight: 600; }

  /* shared pulse */
  @keyframes pulse-status {
    0%   { box-shadow: 0 0 0 3px rgba(74,222,128,0.25); }
    50%  { box-shadow: 0 0 0 6px rgba(74,222,128,0.05); }
    100% { box-shadow: 0 0 0 3px rgba(74,222,128,0.25); }
  }

  .rtl-flip { transform: scaleX(var(--rtl-flip,1)); }
  [dir="rtl"] .rtl-flip { --rtl-flip: -1; }
  [dir="rtl"] .bc-stat:first-child { padding-left: 16px; padding-right: 0; }
  [dir="rtl"] .bc-stat:last-child  { padding-right: 16px; padding-left: 0; }

  @media (max-width: 768px) {
    .wallet-grid { grid-template-columns: 1fr; }
    .transactions-card { grid-column: span 1; }
    .bc-stats { flex-wrap: wrap; }
    .bc-stat-sep { display: none; }
    .bc-stat { min-width: 40%; padding: 8px 0; }
    .bc-actions { flex-direction: column; }
    .tx-summary-row { flex-direction: column; }
    .tx-summary-divider { width: 80%; height: 1px; }
    .tx-controls { flex-direction: column; align-items: stretch; }
    .tx-filter-group { flex-wrap: wrap; }
  }
`;

export default Wallet;
