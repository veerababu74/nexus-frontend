import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiUsers, 
  FiPlus, 
  FiFileText, 
  FiDownload,
  FiMail,
  FiPhone,
  FiCalendar,
  FiClock,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import './LeadsLogs.css';

const LeadsLogs = () => {
  const { theme } = useTheme();
  const [leads] = useState([]);
  const [logs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddLead, setShowAddLead] = useState(false);

  const EmptyState = ({ icon: Icon, title, description, actionButton }) => (
    <div className="empty-state">
      <Icon 
        size={48} 
        style={{ color: theme.colors.textSecondary, opacity: 0.5 }}
      />
      <h3 
        className="empty-title"
        style={{ color: theme.colors.textPrimary }}
      >
        {title}
      </h3>
      <p 
        className="empty-description"
        style={{ color: theme.colors.textSecondary }}
      >
        {description}
      </p>
      {actionButton}
    </div>
  );

  const LeadCard = ({ lead }) => (
    <div 
      className="lead-card"
      style={{ 
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px'
      }}
    >
      <div className="lead-header">
        <div className="lead-info">
          <h4 
            className="lead-name"
            style={{ color: theme.colors.textPrimary }}
          >
            {lead.name}
          </h4>
          <div className="lead-contact">
            {lead.email && (
              <span 
                className="contact-item"
                style={{ color: theme.colors.textSecondary }}
              >
                <FiMail size={14} />
                {lead.email}
              </span>
            )}
            {lead.phone && (
              <span 
                className="contact-item"
                style={{ color: theme.colors.textSecondary }}
              >
                <FiPhone size={14} />
                {lead.phone}
              </span>
            )}
          </div>
        </div>
        <span 
          className={`lead-status ${lead.status}`}
          style={{
            backgroundColor: lead.status === 'new' ? '#10B981' : 
                           lead.status === 'contacted' ? '#F59E0B' : '#6B7280',
            color: 'white'
          }}
        >
          {lead.status}
        </span>
      </div>
      <div className="lead-meta">
        <span 
          className="lead-date"
          style={{ color: theme.colors.textSecondary }}
        >
          <FiCalendar size={14} />
          {lead.date}
        </span>
        <span 
          className="lead-source"
          style={{ color: theme.colors.textSecondary }}
        >
          Source: {lead.source}
        </span>
      </div>
    </div>
  );

  const LogEntry = ({ log }) => (
    <div 
      className="log-entry"
      style={{ 
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px'
      }}
    >
      <div className="log-header">
        <div className="log-icon">
          <FiFileText 
            size={16} 
            style={{ color: theme.colors.primary }}
          />
        </div>
        <div className="log-info">
          <h4 
            className="log-title"
            style={{ color: theme.colors.textPrimary }}
          >
            {log.title}
          </h4>
          <div className="log-meta">
            <span 
              className="log-time"
              style={{ color: theme.colors.textSecondary }}
            >
              <FiClock size={12} />
              {log.timestamp}
            </span>
            <span 
              className={`log-level ${log.level}`}
              style={{
                backgroundColor: log.level === 'error' ? '#EF4444' : 
                               log.level === 'warning' ? '#F59E0B' : '#10B981',
                color: 'white'
              }}
            >
              {log.level}
            </span>
          </div>
        </div>
      </div>
      <p 
        className="log-description"
        style={{ color: theme.colors.textSecondary }}
      >
        {log.description}
      </p>
    </div>
  );

  const AddLeadButton = () => (
    <button
      className="add-lead-btn"
      onClick={() => setShowAddLead(true)}
      style={{
        backgroundColor: theme.colors.primary,
        color: theme.colors.onPrimary
      }}
    >
      <FiPlus size={16} />
      Add Lead
    </button>
  );

  return (
    <div className="leads-logs-container">
      <div className="leads-logs-header">
        <h1 
          className="leads-logs-title"
          style={{ color: theme.colors.textPrimary }}
        >
          Leads & Logs
        </h1>
      </div>

      <div className="leads-logs-content">
        <div className="leads-logs-grid">
          {/* Leads Section */}
          <div 
            className="section-card leads-section"
            style={{ 
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '12px'
            }}
          >
            <div className="section-header">
              <div className="section-title-group">
                <h2 
                  className="section-title"
                  style={{ color: theme.colors.textPrimary }}
                >
                  <FiUsers size={20} />
                  Leads
                </h2>
                <AddLeadButton />
              </div>
              
              {leads.length > 0 && (
                <div className="section-controls">
                  <div 
                    className="search-box"
                    style={{ 
                      backgroundColor: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`
                    }}
                  >
                    <FiSearch size={16} style={{ color: theme.colors.textSecondary }} />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                      style={{
                        backgroundColor: 'transparent',
                        color: theme.colors.textPrimary
                      }}
                    />
                  </div>
                  <button
                    className="filter-btn"
                    style={{
                      backgroundColor: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                      color: theme.colors.textPrimary
                    }}
                  >
                    <FiFilter size={16} />
                  </button>
                  <button
                    className="export-btn"
                    style={{
                      backgroundColor: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                      color: theme.colors.textPrimary
                    }}
                  >
                    <FiDownload size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="section-content">
              {leads.length === 0 ? (
                <EmptyState
                  icon={FiUsers}
                  title="No leads yet."
                  description="Start capturing leads from your conversations"
                  actionButton={<AddLeadButton />}
                />
              ) : (
                <div className="leads-list">
                  {leads.map((lead, index) => (
                    <LeadCard key={index} lead={lead} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logs Section */}
          <div 
            className="section-card logs-section"
            style={{ 
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '12px'
            }}
          >
            <div className="section-header">
              <h2 
                className="section-title"
                style={{ color: theme.colors.textPrimary }}
              >
                <FiFileText size={20} />
                Logs
              </h2>
              
              {logs.length > 0 && (
                <div className="section-controls">
                  <button
                    className="export-btn"
                    style={{
                      backgroundColor: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                      color: theme.colors.textPrimary
                    }}
                  >
                    <FiDownload size={16} />
                    Export
                  </button>
                </div>
              )}
            </div>

            <div className="section-content">
              {logs.length === 0 ? (
                <EmptyState
                  icon={FiFileText}
                  title="No logs yet."
                  description="System logs and activities will appear here"
                />
              ) : (
                <div className="logs-list">
                  {logs.map((log, index) => (
                    <LogEntry key={index} log={log} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsLogs;
