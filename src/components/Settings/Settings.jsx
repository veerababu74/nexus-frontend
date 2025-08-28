import React, { useState } from 'react';
import { FiSettings, FiUser, FiShield } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import './Settings.css';

const Settings = () => {
    const { theme } = useTheme();
    const [clinicName, setClinicName] = useState('Deepak Pain Clinic');
    const [brandColor, setBrandColor] = useState('#1877F2');
    const [logo, setLogo] = useState('🏥');
    const [privacyNoticeUrl, setPrivacyNoticeUrl] = useState('https://example.com/privacy');
    const [retention, setRetention] = useState('90');
    const [handoffEmails, setHandoffEmails] = useState('frontdesk@example.com');

    const handleSave = () => {
        console.log('Saving settings...', {
            clinicName,
            brandColor,
            logo,
            privacyNoticeUrl,
            retention,
            handoffEmails
        });
        alert('Settings saved successfully!');
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <div className="header-content">
                    <h1>Settings</h1>
                </div>
            </div>

            <div className="settings-content">
                <div className="settings-grid">
                    {/* Branding Section */}
                    <div className="settings-section">
                        <h2>
                            <FiUser className="section-icon" />
                            Branding
                        </h2>
                        
                        <div className="form-group">
                            <label>Clinic name</label>
                            <input
                                type="text"
                                value={clinicName}
                                onChange={(e) => setClinicName(e.target.value)}
                                className="form-input"
                                placeholder="Enter clinic name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Brand color</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    value={brandColor}
                                    onChange={(e) => setBrandColor(e.target.value)}
                                    className="color-input"
                                />
                                <div className="color-preview" style={{ backgroundColor: brandColor }}></div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Logo (emoji ok)</label>
                            <input
                                type="text"
                                value={logo}
                                onChange={(e) => setLogo(e.target.value)}
                                className="form-input logo-input"
                                placeholder="🏥"
                            />
                        </div>
                    </div>

                    {/* Privacy & Team Section */}
                    <div className="settings-section">
                        <h2>
                            <FiShield className="section-icon" />
                            Privacy & Team
                        </h2>

                        <div className="form-group">
                            <label>Privacy Notice URL</label>
                            <input
                                type="url"
                                value={privacyNoticeUrl}
                                onChange={(e) => setPrivacyNoticeUrl(e.target.value)}
                                className="form-input"
                                placeholder="https://example.com/privacy"
                            />
                        </div>

                        <div className="form-group">
                            <label>Retention (days)</label>
                            <select
                                value={retention}
                                onChange={(e) => setRetention(e.target.value)}
                                className="form-select"
                            >
                                <option value="30">30 days</option>
                                <option value="60">60 days</option>
                                <option value="90">90 days</option>
                                <option value="180">180 days</option>
                                <option value="365">1 year</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Handoff emails</label>
                            <input
                                type="email"
                                value={handoffEmails}
                                onChange={(e) => setHandoffEmails(e.target.value)}
                                className="form-input"
                                placeholder="frontdesk@example.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-actions">
                    <button className="save-button" onClick={handleSave}>
                        <FiSettings className="button-icon" />
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
