import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiMessageCircle, FiBook, FiUsers, FiTrendingUp } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: FiMessageCircle,
      title: 'Intelligent Chat',
      description: 'Chat with our AI assistant for instant support and information.',
      path: '/improved'
    },
    {
      icon: FiBook,
      title: 'Knowledge Center',
      description: 'Access FAQs and manage your documents in one unified place.',
      path: '/knowledge'
    },
    {
      icon: FiUsers,
      title: 'Community Support',
      description: 'Connect with other users and get help from the community.',
      path: '/community'
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics',
      description: 'Track your progress and see detailed analytics.',
      path: '/analytics'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 
            className="hero-title"
            style={{ color: theme.colors.textPrimary }}
          >
            Welcome to Nexus
          </h1>
          <p 
            className="hero-description"
            style={{ color: theme.colors.textSecondary }}
          >
            Your intelligent assistant for seamless communication and knowledge management.
            Get started by exploring our features below.
          </p>
          <div className="hero-actions">
            <button 
              className="cta-button primary"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.onPrimary 
              }}
            >
              Get Started
            </button>
            <button 
              className="cta-button secondary"
              style={{ 
                backgroundColor: 'transparent',
                color: theme.colors.primary,
                border: `2px solid ${theme.colors.primary}`
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 
          className="section-title"
          style={{ color: theme.colors.textPrimary }}
        >
          Explore Features
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="feature-card"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <div 
                  className="feature-icon"
                  style={{ color: theme.colors.primary }}
                >
                  <IconComponent size={32} />
                </div>
                <h3 
                  className="feature-title"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="feature-description"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {feature.description}
                </p>
                <button 
                  className="feature-button"
                  style={{ 
                    color: theme.colors.primary,
                    borderTop: `1px solid ${theme.colors.border}`
                  }}
                >
                  Explore →
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div 
          className="stats-container"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <h2 
            className="stats-title"
            style={{ color: theme.colors.textPrimary }}
          >
            Platform Statistics
          </h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div 
                className="stat-number"
                style={{ color: theme.colors.primary }}
              >
                1000+
              </div>
              <div 
                className="stat-label"
                style={{ color: theme.colors.textSecondary }}
              >
                Active Users
              </div>
            </div>
            <div className="stat-item">
              <div 
                className="stat-number"
                style={{ color: theme.colors.secondary }}
              >
                50K+
              </div>
              <div 
                className="stat-label"
                style={{ color: theme.colors.textSecondary }}
              >
                Messages Processed
              </div>
            </div>
            <div className="stat-item">
              <div 
                className="stat-number"
                style={{ color: theme.colors.primary }}
              >
                99.9%
              </div>
              <div 
                className="stat-label"
                style={{ color: theme.colors.textSecondary }}
              >
                Uptime
              </div>
            </div>
            <div className="stat-item">
              <div 
                className="stat-number"
                style={{ color: theme.colors.secondary }}
              >
                24/7
              </div>
              <div 
                className="stat-label"
                style={{ color: theme.colors.textSecondary }}
              >
                Support
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;