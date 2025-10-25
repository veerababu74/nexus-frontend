import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiMessageCircle, 
  FiPercent, 
  FiUsers, 
  FiHelpCircle, 
  FiClock,
  FiX,
  FiUser,
  FiCpu
} from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { fetchConversations, fetchDoctorDetails, fetchLeads, fetchTopQuestions } from '../../api/analyticsAPI';
import { getDashboardResults } from '../../api/dashboardAPI';
import './Home.css'; // Import Home styles

const Home = () => {
  const { theme } = useTheme();
  const [showConversations, setShowConversations] = useState(false);
  const [showLeads, setShowLeads] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leadsError, setLeadsError] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    LeedsCount: '0',
    ConversationCount: '0',
    SelfServe: '0',
    Incidents: '0'
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [topQuestions, setTopQuestions] = useState([]);
  const [topQuestionsLoading, setTopQuestionsLoading] = useState(true);
  const [topQuestionsError, setTopQuestionsError] = useState(null);

  // Helper function to sort conversations by latest timestamp (newest first)
  const sortConversationsByLatest = (conversationsData) => {
    return (conversationsData || []).sort((a, b) => {
      // Get the latest timestamp from each conversation
      const getLatestTimestamp = (conversation) => {
        if (!conversation || conversation.length === 0) return new Date(0);
        
        const timestamps = conversation
          .map(msg => msg.Timestamp)
          .filter(timestamp => timestamp)
          .map(timestamp => new Date(timestamp));
        
        return timestamps.length > 0 ? Math.max(...timestamps) : new Date(0);
      };
      
      const latestA = getLatestTimestamp(a);
      const latestB = getLatestTimestamp(b);
      
      return latestB - latestA; // Descending order (newest first)
    });
  };

  // Typing animation component
  const TypingAnimation = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <span style={{ 
        display: 'inline-block',
        width: '20px',
        textAlign: 'left'
      }}>
        {dots}
      </span>
    );
  };

  const analyticsData = {
    conversations: dashboardData.ConversationCount,
    selfServePercentage: `${dashboardData.SelfServe}%`,
    leads: dashboardData.LeedsCount,
    topQuestions: topQuestions
  };

  const fetchConversationsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const conversationsData = await fetchConversations();
      const sortedConversations = sortConversationsByLatest(conversationsData);
      setConversations(sortedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations. Please try again.');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadsData = async () => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const leadsData = await fetchLeads();
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeadsError('Failed to load leads. Please try again.');
      setLeads([]);
    } finally {
      setLeadsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    setDashboardError(null);
    try {
      const data = await getDashboardResults();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardError('Failed to load dashboard data. Please try again.');
      setDashboardData({
        LeedsCount: '0',
        ConversationCount: '0',
        SelfServe: '0',
        Incidents: '0'
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleConversationsClick = () => {
    setShowConversations(true);
    fetchConversationsData();
  };

  const handleLeadsClick = () => {
    setShowLeads(true);
    fetchLeadsData();
  };

  // Load conversation count on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('Loading initial data...');
      console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
      
      try {
        // Load dashboard data, conversations, doctor details, leads, and top questions in parallel
        const [dashboardResult, conversationsData, doctorData, leadsData, topQuestionsData] = await Promise.all([
          getDashboardResults().catch(err => {
            console.error('Dashboard API failed:', err);
            return {
              LeedsCount: '0',
              ConversationCount: '0',
              SelfServe: '0',
              Incidents: '0'
            };
          }),
          fetchConversations().catch(err => {
            console.error('Conversations API failed:', err);
            return [];
          }),
          fetchDoctorDetails().catch(err => {
            console.error('Doctor details API failed:', err);
            return null;
          }),
          fetchLeads().catch(err => {
            console.error('Leads API failed:', err);
            return [];
          }),
          fetchTopQuestions().catch(err => {
            console.error('Top questions API failed:', err);
            return [];
          })
        ]);
        
        console.log('Dashboard data loaded:', dashboardResult);
        console.log('Conversations loaded:', conversationsData?.length || 0, 'sessions');
        console.log('Doctor details loaded:', doctorData);
        console.log('Leads loaded:', leadsData?.length || 0, 'leads');
        console.log('Top questions loaded:', topQuestionsData?.length || 0, 'questions');
        
        setDashboardData(dashboardResult);
        
        // Sort conversations by latest timestamp in descending order (newest first)
        const sortedConversations = sortConversationsByLatest(conversationsData);
        setConversations(sortedConversations);
        setDoctorDetails(doctorData);
        setLeads(leadsData || []);
        setTopQuestions(topQuestionsData || []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setDashboardData({
          LeedsCount: '0',
          ConversationCount: '0',
          SelfServe: '0',
          Incidents: '0'
        });
        setConversations([]);
        setLeads([]);
        setTopQuestions([]);
        // Don't set doctor details to null on error, keep loading state
      } finally {
        setDoctorLoading(false);
        setDashboardLoading(false);
        setTopQuestionsLoading(false);
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

  const LeadsModal = () => (
    <div 
      className="leads-modal-overlay"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={() => setShowLeads(false)}
    >
      <div 
        className="leads-modal"
        style={{ 
          backgroundColor: theme.colors.background,
          border: `1px solid ${theme.colors.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="leads-modal-header">
          <div className="modal-header-content">
            <h2 style={{ color: theme.colors.textPrimary }}>Leads</h2>
            <span 
              className="leads-count"
              style={{ color: theme.colors.textSecondary }}
            >
              {leads.length} lead{leads.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button 
            className="close-button"
            onClick={() => setShowLeads(false)}
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
        
        <div className="leads-modal-content" style={{ position: 'relative' }}>
          {leadsLoading && (
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
                loading={leadsLoading}
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
                Loading leads...
              </p>
            </div>
          )}
          {leadsError ? (
            <div 
              className="error-message"
              style={{ color: theme.colors.textSecondary }}
            >
              <FiAlertTriangle size={48} />
              <p>{leadsError}</p>
              <button 
                onClick={fetchLeadsData}
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
          ) : leads.length > 0 ? (
            <div className="leads-list">
              {leads.map((lead, index) => (
                <div 
                  key={lead.Id || index} 
                  className="lead-item"
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '0.75rem'
                  }}
                >
                  <div className="lead-header">
                    <div className="lead-meta">
                      <FiUsers 
                        size={16} 
                        style={{ color: theme.colors.primary }}
                      />
                      <span 
                        className="lead-id"
                        style={{ color: theme.colors.textPrimary, fontWeight: '600' }}
                      >
                        Lead #{lead.Id || index + 1}
                      </span>
                    </div>
                    {lead.Timestamp && (
                      <span 
                        className="lead-timestamp"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {new Date(lead.Timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                  
                  <div className="lead-details" style={{ marginTop: '0.5rem' }}>
                    {lead.UserChatSessionId && (
                      <div className="lead-session">
                        <span 
                          style={{ color: theme.colors.textSecondary, fontSize: '0.9rem' }}
                        >
                          Session: {lead.UserChatSessionId}
                        </span>
                      </div>
                    )}
                    {lead.Click && (
                      <div className="lead-click" style={{ marginTop: '0.25rem' }}>
                        <span 
                          style={{ color: theme.colors.textPrimary }}
                        >
                          Action: {lead.Click}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="no-leads"
              style={{ 
                color: theme.colors.textSecondary,
                textAlign: 'center',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <FiUsers size={48} />
              <p>No leads found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 
            className="hero-title"
            style={{ color: theme.colors.textPrimary }}
          >
            {doctorLoading ? (
              <>
                Welcome to Doctor<TypingAnimation />
              </>
            ) : (
              `Welcome to Doctor ${doctorDetails?.DoctorFirstName || 'Guest'}`
            )}
          </h1>
        </div>
      </section>

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
            onClick={handleLeadsClick}
          />
        </div>

        {/* Bottom Row Info Cards */}
        <div className="info-grid">
          <InfoCard
            title="Top questions"
            content={
              topQuestionsLoading ? (
                <div className="loading-state">
                  <ClipLoader size={20} color={theme.colors.primary} />
                  <span style={{ color: theme.colors.textSecondary }}>Loading questions...</span>
                </div>
              ) : analyticsData.topQuestions.length > 0 ? (
                <ul className="questions-list">
                  {analyticsData.topQuestions.map((question, index) => (
                    <li key={question.ChunkId || index}>
                      {question.AIGeneratedQuestion || question}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-data">
                  <FiHelpCircle size={24} />
                  <span>Top Questions - Coming Soon</span>
                </div>
              )
            }
            className="info-questions"
          />
          {/* Busy hours section is hidden */}
        </div>
      </div>

      {showConversations && <ConversationModal />}
      {showLeads && <LeadsModal />}
    </div>
  );
};

export default Home;
