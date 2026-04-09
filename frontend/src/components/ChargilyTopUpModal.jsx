import React, { useState } from 'react';
import { create_payement } from 'chargily-epay-react-js/dist/chargily-epay-react-js.esm.js';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

const ChargilyTopUpModal = ({ onClose }) => {
  const { lang } = useLanguage();
  const [amount, setAmount] = useState(1000);
  const [mode, setMode] = useState('EDAHABIA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isRtl = lang === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const invoice = {
      amount: Number(amount),
      invoice_number: Math.floor(Math.random() * 1000000),
      client: "Employer Name", // Can be wired up using a global auth state
      mode: mode,
      webhook_url: import.meta.env.CHARGILY_WEBHOOK_URL,
      back_url: window.location.href, // Redirects user automatically back to their wallet
      discount: 0
    };

    try {
      await create_payement(invoice);
    } catch (err) {
      setError(err.message || 'Payment initiation failed.');
      setLoading(false);
    }
  };

  return (
    <div className="chargily-modal-overlay">
      <div className={`chargily-modal-content ${isRtl ? 'rtl' : 'ltr'}`}>
        <button className="close-btn" onClick={onClose}>
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="modal-header">
          <h2>{isRtl ? 'شحن الرصيد' : 'Top up Balance'}</h2>
          <p>{isRtl ? 'اختر طريقة الدفع والمبلغ للإيداع في محفظتك.' : 'Select a payment method and amount to deposit to your wallet.'}</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{isRtl ? 'المبلغ (دج)' : 'Amount (Da)'}</label>
            <input 
              type="number" 
              min="100"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required
              className="amount-input"
            />
          </div>

          <div className="form-group">
            <label>{isRtl ? 'طريقة الدفع' : 'Payment Method'}</label>
            <div className="payment-modes">
              <button 
                type="button" 
                className={`mode-btn ${mode === 'EDAHABIA' ? 'selected' : ''}`}
                onClick={() => setMode('EDAHABIA')}
              >
                <div className="logo-placeholder edahabia" />
                <span>{isRtl ? 'البطاقة الذهبية' : 'Edahabia'}</span>
              </button>
              <button 
                type="button" 
                className={`mode-btn ${mode === 'CIB' ? 'selected' : ''}`}
                onClick={() => setMode('CIB')}
              >
                <div className="logo-placeholder cib">CIB</div>
                <span>CIB</span>
              </button>
            </div>
          </div>

          <button type="submit" className="submit-pay-btn" disabled={loading}>
            {loading ? (isRtl ? 'جاري التحويل...' : 'Redirecting...') : (isRtl ? 'متابعة للدفع' : 'Proceed to Checkout')}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .chargily-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .chargily-modal-content {
          background: white;
          width: 90%;
          max-width: 440px;
          border-radius: 20px;
          padding: 32px;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .chargily-modal-content.rtl {
          direction: rtl;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          border-radius: 50%;
          padding: 4px;
          transition: all 0.2s;
        }

        .chargily-modal-content.rtl .close-btn {
          right: auto;
          left: 20px;
        }

        .close-btn:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        .modal-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
        }

        .modal-header p {
          margin: 0 0 24px 0;
          color: #64748B;
          font-size: 14px;
          line-height: 1.5;
        }

        .error-alert {
          background: #FEF2F2;
          color: #DC2626;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          border: 1px solid #FECACA;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 700;
          color: #334155;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .amount-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #E2E8F0;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          outline: none;
          transition: border-color 0.2s;
        }

        .amount-input:focus {
          border-color: #5B21B6;
        }

        .payment-modes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .mode-btn {
          background: white;
          border: 2px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn.selected {
          border-color: #5B21B6;
          background: #F5F3FF;
        }

        .mode-btn span {
          font-weight: 700;
          color: #475569;
          font-size: 14px;
        }

        .mode-btn.selected span {
          color: #5B21B6;
        }

        .logo-placeholder {
          width: 48px;
          height: 32px;
          border-radius: 6px;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
        }

        .logo-placeholder.edahabia {
          background-image: url('/assets/edahabia.png');
          background-color: #f1f5f9;
        }

        .logo-placeholder.cib {
          background-color: #0c4a6e;
          color: white;
        }

        .submit-pay-btn {
          width: 100%;
          padding: 16px;
          background: #5B21B6;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          margin-top: 12px;
          transition: background 0.2s;
        }

        .submit-pay-btn:hover:not(:disabled) {
          background: #4C1D95;
        }

        .submit-pay-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}} />
    </div>
  );
};

export default ChargilyTopUpModal;
