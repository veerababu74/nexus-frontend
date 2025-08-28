import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from '../Sidebar/Sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const { theme } = useTheme();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarExpanded(false);
      } else {
        setSidebarExpanded(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="main-layout"
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary
      }}
    >
      <Sidebar 
        isExpanded={sidebarExpanded}
        onToggle={setSidebarExpanded}
      />
      <main 
        className={`main-content ${sidebarExpanded ? '' : 'sidebar-collapsed'}`}
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
