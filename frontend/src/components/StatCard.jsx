import React from 'react';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="stat-info">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .stat-card {
          background: #FFFFFF;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
          flex: 1;
        }
        .stat-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #1E293B;
          line-height: 1.2;
        }
        .stat-title {
          font-size: 12px;
          font-weight: 600;
          color: #64748B;
        }
      `}} />
    </div>
  );
};

export default StatCard;
