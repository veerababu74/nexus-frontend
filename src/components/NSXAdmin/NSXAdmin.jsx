import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiUsers, 
  FiAlertTriangle, 
  FiShield, 
  FiCpu, 
  FiLayers, 
  FiFileText,
  FiSettings
} from 'react-icons/fi';
import './NSXAdmin.css';

const NSXAdmin = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('tenants');

  // Static tenant data based on the image
  const tenants = [
    {
      id: 1,
      name: 'Deepak Pain Clinic',
      plan: 'HPA',
      convos: 0,
      leads: 0,
      status: 'Live'
    }
  ];

  const sidebarItems = [
    { id: 'tenants', label: 'Tenants', icon: FiUsers, active: true },
    { id: 'incidents', label: 'Incidents', icon: FiAlertTriangle },
    { id: 'policies', label: 'Policies', icon: FiShield },
    { id: 'models', label: 'Models', icon: FiCpu },
    { id: 'sub-processors', label: 'Sub-processors', icon: FiLayers },
    { id: 'audit', label: 'Audit', icon: FiFileText }
  ];

  const handleSidebarClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'tenants':
        return (
          <div className="tenants-content">
            <h1 className="page-title" style={{ color: theme.colors.textPrimary }}>
              Tenants
            </h1>
            
            <div className="tenants-table-container">
              <table className="tenants-table">
                <thead>
                  <tr>
                    <th style={{ color: theme.colors.textSecondary }}>Name</th>
                    <th style={{ color: theme.colors.textSecondary }}>Plan</th>
                    <th style={{ color: theme.colors.textSecondary }}>Convos</th>
                    <th style={{ color: theme.colors.textSecondary }}>Leads</th>
                    <th style={{ color: theme.colors.textSecondary }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td style={{ color: theme.colors.textPrimary }}>
                        {tenant.name}
                      </td>
                      <td style={{ color: theme.colors.textPrimary }}>
                        {tenant.plan}
                      </td>
                      <td style={{ color: theme.colors.textPrimary }}>
                        {tenant.convos}
                      </td>
                      <td style={{ color: theme.colors.textPrimary }}>
                        {tenant.leads}
                      </td>
                      <td>
                        <span 
                          className={`status-badge ${tenant.status.toLowerCase()}`}
                          style={{ 
                            backgroundColor: tenant.status === 'Live' ? '#22c55e' : '#6b7280',
                            color: 'white'
                          }}
                        >
                          {tenant.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="coming-soon" style={{ color: theme.colors.textSecondary }}>
            <FiSettings size={48} />
            <h2>Coming Soon</h2>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="nsx-admin-container">
      {/* Header */}
      <div 
        className="nsx-admin-header"
        style={{ 
          backgroundColor: theme.colors.surface,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <div className="header-content">
          <div className="clinic-info">
            <div className="clinic-icon">
              <FiShield size={24} style={{ color: theme.colors.primary }} />
            </div>
            <div className="clinic-details">
              <h1 style={{ color: theme.colors.textPrimary }}>
                Deepak Pain Clinic
              </h1>
              <p style={{ color: theme.colors.textSecondary }}>
                Health Presence Assistant • Phase-1 (English-only)
              </p>
            </div>
          </div>
          
          <div className="founding-member-badge">
            <span style={{ color: theme.colors.textSecondary }}>
              Founding Member
            </span>
          </div>
        </div>
      </div>

      <div className="nsx-admin-body">
        {/* Sidebar */}
        <div 
          className="nsx-admin-sidebar"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderRight: `1px solid ${theme.colors.border}`
          }}
        >
          <div className="sidebar-header">
            <h2 style={{ color: theme.colors.textPrimary }}>
              Nexus
            </h2>
          </div>
          
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSidebarClick(item.id)}
                  style={{
                    backgroundColor: isActive 
                      ? theme.colors.primary + '15' 
                      : 'transparent',
                    color: isActive 
                      ? theme.colors.primary 
                      : theme.colors.textSecondary,
                    borderLeft: isActive 
                      ? `3px solid ${theme.colors.primary}` 
                      : 'none'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div 
          className="nsx-admin-main"
          style={{ backgroundColor: theme.colors.background }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default NSXAdmin;