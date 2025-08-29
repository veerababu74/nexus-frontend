import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiMessageCircle, 
  FiPercent, 
  FiUsers, 
  FiAlertTriangle, 
  FiHelpCircle, 
  FiClock 
} from 'react-icons/fi';
import './Analytics.css';

const Analytics = () => {
  const { theme } = useTheme();

  const analyticsData = {
    conversations: 0,
    selfServePercentage: '0%',
    leads: 0,
    incidents: 0,
    topQuestions: [],
    busyHours: '— wireframe —'
  };

  const StatCard = ({ icon: Icon, title, value, className = '' }) => (
    <div 
      className={`stat-card ${className}`}
      style={{ 
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px'
      }}
    >
      <div className="stat-header">
        <Icon 
          size={20} 
          style={{ color: theme.colors.primary }}
        />
        <span 
          className="stat-title"
          style={{ color: theme.colors.textSecondary }}
        >
          {title}
        </span>
      </div>
      <div 
        className="stat-value"
        style={{ color: theme.colors.textPrimary }}
      >
        {value}
      </div>
    </div>
  );

  const InfoCard = ({ title, content, className = '' }) => (
    <div 
      className={`info-card ${className}`}
      style={{ 
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px'
      }}
    >
      <h3 
        className="info-card-title"
        style={{ color: theme.colors.textPrimary }}
      >
        {title}
      </h3>
      <div 
        className="info-card-content"
        style={{ color: theme.colors.textSecondary }}
      >
        {content}
      </div>
    </div>
  );

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1 
          className="analytics-title"
          style={{ color: theme.colors.textPrimary }}
        >
          Analytics
        </h1>
      </div>

      <div className="analytics-content">
        {/* Top Row Stats */}
        <div className="stats-grid">
          <StatCard
            icon={FiMessageCircle}
            title="Conversations"
            value={analyticsData.conversations}
            className="stat-conversations"
          />
          <StatCard
            icon={FiPercent}
            title="Self-serve %"
            value={analyticsData.selfServePercentage}
            className="stat-self-serve"
          />
          <StatCard
            icon={FiUsers}
            title="Leads"
            value={analyticsData.leads}
            className="stat-leads"
          />
          <StatCard
            icon={FiAlertTriangle}
            title="Incidents"
            value={analyticsData.incidents}
            className="stat-incidents"
          />
        </div>

        {/* Bottom Row Info Cards */}
        <div className="info-grid">
          <InfoCard
            title="Top questions"
            content={
              analyticsData.topQuestions.length > 0 ? (
                <ul className="questions-list">
                  {analyticsData.topQuestions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              ) : (
                <div className="no-data">
                  <FiHelpCircle size={24} />
                  <span>No data</span>
                </div>
              )
            }
            className="info-questions"
          />
          <InfoCard
            title="Busy hours"
            content={
              <div className="busy-hours">
                <FiClock size={24} />
                <span>{analyticsData.busyHours}</span>
              </div>
            }
            className="info-busy-hours"
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
