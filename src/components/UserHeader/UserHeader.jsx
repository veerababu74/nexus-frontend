import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserHeader.css';

const UserHeader = () => {
  const { user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user || isLoading) {
    return (
      <div className="user-header">
        <div className="user-header-skeleton">
          <div className="avatar-skeleton"></div>
          <div className="user-info-skeleton">
            <div className="name-skeleton"></div>
            <div className="email-skeleton"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-header" ref={menuRef}>
      <div 
        className="user-info"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="user-avatar">
          {getInitials(user.name)}
        </div>
        <div className="user-details">
          <div className="user-name">{user.name || 'User'}</div>
          <div className="user-email">{user.email || user.username}</div>
        </div>
        <svg 
          className={`dropdown-arrow ${isMenuOpen ? 'open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path 
            d="M6 9L12 15L18 9" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isMenuOpen && (
        <div className="user-menu">
          <div className="user-menu-item user-profile">
            <div className="user-avatar-large">
              {getInitials(user.name)}
            </div>
            <div className="user-profile-info">
              <div className="user-profile-name">{user.name}</div>
              <div className="user-profile-email">{user.email || user.username}</div>
            </div>
          </div>
          
          <div className="menu-divider"></div>
          
          <button 
            className="user-menu-item menu-button"
            onClick={handleLogout}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path 
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <polyline 
                points="16,17 21,12 16,7" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <line 
                x1="21" 
                y1="12" 
                x2="9" 
                y2="12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserHeader;