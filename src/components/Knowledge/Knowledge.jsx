import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import FAQ from '../FAQ/FAQ';
import FileManager from '../FileManager/FileManager';
import { FiBook, FiUpload, FiHelpCircle, FiFolder } from 'react-icons/fi';
import './Knowledge.css';

const Knowledge = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const { theme } = useTheme();

  const tabs = [
    {
      id: 'faq',
      label: 'FAQ',
      icon: FiHelpCircle,
      component: FAQ
    },
    {
      id: 'documents',
      label: 'Document Upload',
      icon: FiFolder,
      component: FileManager
    }
  ];

  const renderActiveComponent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (activeTabData) {
      const Component = activeTabData.component;
      return <Component />;
    }
    return null;
  };

  return (
    <div 
      className="knowledge-container"
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary 
      }}
    >
      {/* Header with Tab Navigation */}
      <div 
        className="knowledge-header"
        style={{ 
          backgroundColor: theme.colors.surface,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <div className="header-content">
          <div className="header-title">
            <FiBook size={28} style={{ color: theme.colors.primary }} />
            <div>
              <h1 style={{ color: theme.colors.textPrimary }}>Knowledge Center</h1>
              <p style={{ color: theme.colors.textSecondary }}>
                Access FAQs and manage your documents
              </p>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                className={`tab-button ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: isActive ? theme.colors.primary : 'transparent',
                  color: isActive ? theme.colors.onPrimary : theme.colors.textSecondary,
                  borderColor: theme.colors.border
                }}
              >
                <IconComponent size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="knowledge-content">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default Knowledge;
