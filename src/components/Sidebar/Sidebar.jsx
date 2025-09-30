import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiHome, 
  FiMessageCircle, 
  FiBook, 
  FiMenu, 
  FiX, 
  FiSun, 
  FiMoon,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
  FiShield,
  FiGlobe,
  FiFileText,
  FiLogOut
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isExpanded: parentExpanded, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Use parent control if available, otherwise use internal state
  const expanded = parentExpanded !== undefined ? parentExpanded : isExpanded;
  const setExpanded = onToggle || setIsExpanded;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: FiHome,
      path: '/home'
    },
    {
      id: 'knowledge',
      label: 'Knowledge',
      icon: FiBook,
      path: '/knowledge'
    },
    {
      id: 'tone-safety',
      label: 'Tone & Safety',
      icon: FiShield,
      path: '/tone-safety'
    },
    {
      id: 'chat',
      label: 'Sandbox',
      icon: FiMessageCircle,
      path: '/improved'
    },
    {
      id: 'publishing',
      label: 'Publishing',
      icon: FiGlobe,
      path: '/publishing'
    },
    {
      id: 'leads-logs',
      label: 'Leads & Logs',
      icon: FiFileText,
      path: '/leads-logs'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: FiSettings,
      path: '/settings'
    }
  ];

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Logout function will redirect to login automatically
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActiveRoute = (path) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/';
    }
    if (path === '/knowledge') {
      return location.pathname === '/knowledge' || location.pathname === '/faq' || location.pathname === '/files';
    }
    if (path === '/tone-safety') {
      return location.pathname === '/tone-safety';
    }
    if (path === '/settings') {
      return location.pathname === '/settings';
    }
    if (path === '/publishing') {
      return location.pathname === '/publishing';
    }
    if (path === '/leads-logs') {
      return location.pathname === '/leads-logs';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleMobileSidebar}
        style={{ 
          backgroundColor: theme.colors.surface,
          color: theme.colors.textPrimary,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-overlay"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`sidebar ${expanded ? 'expanded' : 'collapsed'} ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{ 
          backgroundColor: theme.colors.surface,
          borderRight: `1px solid ${theme.colors.border}`
        }}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-container">
            {expanded && (
              <h2 
                className="logo-text"
                style={{ color: theme.colors.primary }}
              >
                Nexus
              </h2>
            )}
          </div>
          <button 
            className="collapse-btn desktop-only"
            onClick={toggleSidebar}
            style={{ 
              color: theme.colors.textSecondary,
              backgroundColor: 'transparent'
            }}
          >
            {expanded ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveRoute(item.path);
            
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
                style={{
                  backgroundColor: isActive ? theme.colors.primary : 'transparent',
                  color: isActive ? theme.colors.onPrimary : theme.colors.textPrimary
                }}
                title={!expanded ? item.label : ''}
              >
                <IconComponent size={20} className="nav-icon" />
                {expanded && <span className="nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {/* User Info */}
          {expanded && user && (
            <div className="user-info-mini" style={{ color: theme.colors.textPrimary }}>
              <div className="user-avatar-mini">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details-mini">
                <div className="user-name-mini">{user.name}</div>
                <div className="user-email-mini" style={{ color: theme.colors.textSecondary }}>
                  {user.email}
                </div>
              </div>
            </div>
          )}
          
          {/* Theme Toggle */}
          <button
            className="footer-button theme-toggle"
            onClick={toggleTheme}
            style={{
              color: theme.colors.textSecondary,
              backgroundColor: 'transparent'
            }}
            title="Toggle Theme"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            {expanded && (
              <span className="footer-button-label">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
          
          {/* Logout Button */}
          <button
            className="footer-button logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              color: theme.colors.error || '#ef4444',
              backgroundColor: 'transparent'
            }}
            title="Sign Out"
          >
            <FiLogOut size={20} />
            {expanded && (
              <span className="footer-button-label">
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
