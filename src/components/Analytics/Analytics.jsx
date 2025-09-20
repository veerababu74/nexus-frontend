import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiMessageCircle, 
  FiPercent, 
  FiUsers, 
  FiAlertTriangle, 
  FiHelpCircle, 
  FiClock,
  FiX,
  FiUser,
  FiCpu
} from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { fetchConversations, fetchAnalyticsSummary } from '../../api/analyticsAPI';
import './Analytics.css';

const Analytics = () => {
  const { theme } = useTheme();
  const [showConversations, setShowConversations] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyticsData = {
    conversations: conversations.length,
    selfServePercentage: '0%',
    leads: 0,
    incidents: 0,
    topQuestions: [],
    busyHours: '— wireframe —'
  };

  const fetchConversationsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const conversationsData = await fetchConversations();
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations. Please try again.');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationsClick = () => {
    setShowConversations(true);
    fetchConversationsData();
  };

  // Load conversation count on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const conversationsData = await fetchConversations();
        setConversations(conversationsData);
      } catch (error) {
        console.error('Error fetching initial conversation data:', error);
        setConversations([]);
      }
    };

    loadInitialData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, className = '', onClick }) => (
    <div 
      className={`stat-card ${className} ${onClick ? 'stat-card-clickable' : ''}`}
      style={{ 
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
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

  const ConversationModal = () => (
    <div 
      className="conversation-modal-overlay"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={() => setShowConversations(false)}
    >
      <div 
        className="conversation-modal"
        style={{ 
          backgroundColor: theme.colors.background,
          border: `1px solid ${theme.colors.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="conversation-modal-header">
          <div className="modal-header-content">
            <h2 style={{ color: theme.colors.textPrimary }}>Conversations</h2>
            <span 
              className="conversation-count"
              style={{ color: theme.colors.textSecondary }}
            >
              {conversations.length} session{conversations.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button 
            className="close-button"
            onClick={() => setShowConversations(false)}
            style={{ 
              background: 'none',
              border: 'none',
              color: theme.colors.textSecondary,
              cursor: 'pointer'
            }}
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="conversation-modal-content" style={{ position: 'relative' }}>
          {loading && (
            <div 
              className="loading-overlay"
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <ClipLoader
                color={theme.colors.primary}
                loading={loading}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <p style={{ 
                marginTop: '1rem', 
                textAlign: 'center',
                color: theme.colors.textPrimary,
                fontSize: '1rem'
              }}>
                Loading conversations...
              </p>
            </div>
          )}
          {error ? (
            <div 
              className="error-message"
              style={{ color: theme.colors.textSecondary }}
            >
              <FiAlertTriangle size={48} />
              <p>{error}</p>
              <button 
                onClick={fetchConversationsData}
                className="retry-button"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.onPrimary,
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          ) : conversations.length > 0 ? (
            <div className="conversations-list">
              {conversations.map((conversation, sessionIndex) => (
                <div 
                  key={sessionIndex} 
                  className="conversation-session"
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  <div className="session-header">
                    <h4 
                      className="session-title"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      Session {conversation[0]?.UserChatSessionId}
                    </h4>
                    {conversation[0]?.Timestamp && (
                      <span 
                        className="session-date"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {new Date(conversation[0].Timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                  <div className="messages-container">
                    {conversation.map((message, messageIndex) => (
                      <div 
                        key={message.Id} 
                        className={`message-item ${message.MessageType?.toLowerCase() || 'unknown'}`}
                        style={{ 
                          backgroundColor: message.MessageType === 'User' 
                            ? theme.colors.primary + '20' 
                            : theme.colors.surface,
                          border: `1px solid ${theme.colors.border}`
                        }}
                      >
                        <div className="message-header">
                          <div className="message-meta">
                            {message.MessageType === 'User' ? (
                              <FiUser 
                                size={16} 
                                style={{ color: theme.colors.primary }}
                              />
                            ) : (
                              <FiCpu 
                                size={16} 
                                style={{ color: theme.colors.secondary }}
                              />
                            )}
                            <span 
                              className="message-type"
                              style={{ color: theme.colors.textSecondary }}
                            >
                              {message.MessageType || 'Unknown'}
                            </span>
                          </div>
                          {message.Timestamp && (
                            <span 
                              className="message-timestamp"
                              style={{ color: theme.colors.textSecondary }}
                            >
                              {new Date(message.Timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          )}
                        </div>
                        <p 
                          className="message-text"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {message.Message}
                        </p>
                        {message.Reaction !== 'None' && (
                          <span 
                            className="message-reaction"
                            style={{ color: theme.colors.textSecondary }}
                          >
                            Reaction: {message.Reaction}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="no-conversations"
              style={{ color: theme.colors.textSecondary }}
            >
              <FiMessageCircle size={48} />
              <p>No conversations found</p>
            </div>
          )}
        </div>
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
            onClick={handleConversationsClick}
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

      {showConversations && <ConversationModal />}
    </div>
  );
};

export default Analytics;
