import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiSettings, 
  FiGlobe, 
  FiCode, 
  FiCopy, 
  FiEye, 
  FiEyeOff, 
  FiLock,
  FiCheck
} from 'react-icons/fi';
import './Publishing.css';

const Publishing = () => {
  const { theme } = useTheme();
  const [welcomeText, setWelcomeText] = useState('Welcome to Deepak Pain Clinic.');
  const [brandColor, setBrandColor] = useState('#1877F2');
  const [consentEnabled, setConsentEnabled] = useState(true);
  const [stagingMode, setStagingMode] = useState(true);
  const [liveProduction, setLiveProduction] = useState(false);
  const [shareLink] = useState('https://assistant.exan');
  const [copied, setCopied] = useState(false);

  const embedSnippet = `<script
src="https://cdn.nsx/hp
a.js"></script>
<script>NSX_HPA.init({
clinic: "Deepak Pain
Clinic", color: 
"${brandColor}", 
welcome: "${welcomeText}"
});</script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span 
        className="toggle-slider"
        style={{
          backgroundColor: checked ? theme.colors.primary : theme.colors.border
        }}
      >
        <span className="toggle-knob" />
      </span>
      <span 
        className="toggle-label"
        style={{ color: theme.colors.textPrimary }}
      >
        {label}
      </span>
    </label>
  );

  return (
    <div className="publishing-container">
      <div className="publishing-header">
        <h1 
          className="publishing-title"
          style={{ color: theme.colors.textPrimary }}
        >
          Publishing
        </h1>
      </div>

      <div className="publishing-content">
        <div className="publishing-grid">
          {/* Widget & Embed Section */}
          <div 
            className="publishing-card widget-embed-card"
            style={{ 
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '12px'
            }}
          >
            <h2 
              className="card-title"
              style={{ color: theme.colors.textPrimary }}
            >
              Widget & Embed
            </h2>
            
            <div className="form-group">
              <label 
                className="form-label"
                style={{ color: theme.colors.textSecondary }}
              >
                Welcome text
              </label>
              <input
                type="text"
                value={welcomeText}
                onChange={(e) => setWelcomeText(e.target.value)}
                className="form-input"
                style={{
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.textPrimary
                }}
              />
            </div>

            <div className="form-group">
              <label 
                className="form-label"
                style={{ color: theme.colors.textSecondary }}
              >
                Brand color
              </label>
              <div className="color-input-container">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="color-input"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="color-text-input"
                  style={{
                    backgroundColor: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label 
                className="form-label"
                style={{ color: theme.colors.textSecondary }}
              >
                Embed snippet
              </label>
              <div 
                className="code-block"
                style={{
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.textPrimary
                }}
              >
                <pre>{embedSnippet}</pre>
                <button
                  className="copy-code-btn"
                  onClick={() => navigator.clipboard.writeText(embedSnippet)}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.onPrimary
                  }}
                >
                  <FiCopy size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Go-Live Controls Section */}
          <div 
            className="publishing-card controls-card"
            style={{ 
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '12px'
            }}
          >
            <h2 
              className="card-title"
              style={{ color: theme.colors.textPrimary }}
            >
              Go-Live Controls
            </h2>

            <div className="controls-list">
              <ToggleSwitch
                checked={consentEnabled}
                onChange={setConsentEnabled}
                label="Consent banner enabled"
              />
              
              <ToggleSwitch
                checked={stagingMode}
                onChange={setStagingMode}
                label="Staging mode (password protected)"
              />
              
              <ToggleSwitch
                checked={liveProduction}
                onChange={setLiveProduction}
                label="Live on production"
              />
            </div>

            <div className="form-group">
              <label 
                className="form-label"
                style={{ color: theme.colors.textSecondary }}
              >
                Share link
              </label>
              <div className="share-link-container">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="share-link-input"
                  style={{
                    backgroundColor: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary
                  }}
                />
                <button
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                  onClick={handleCopy}
                  style={{
                    backgroundColor: copied ? '#10B981' : theme.colors.primary,
                    color: theme.colors.onPrimary
                  }}
                >
                  {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publishing;
