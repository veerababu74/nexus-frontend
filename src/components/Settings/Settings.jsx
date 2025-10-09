import React, { useState, useEffect } from 'react';
import { FiSettings, FiUser, FiShield, FiExternalLink, FiMail } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { getSettings, updateSettings } from '../../api/settingsAPI';
import './Settings.css';

const Settings = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Settings state
    const [clinicName, setClinicName] = useState('');
    const [brandColor, setBrandColor] = useState('#1877F2');
    const [logoUrl, setLogoUrl] = useState('');
    const [privacyNoticeUrl, setPrivacyNoticeUrl] = useState('');
    const [retention, setRetention] = useState('90');
    const [handoffEmails, setHandoffEmails] = useState('');
    
    // New fields for the Book Now section
    const [bookNowUrl, setBookNowUrl] = useState('');
    const [bookNowLabel, setBookNowLabel] = useState('');
    const [bookNowShow, setBookNowShow] = useState('');
    const [sendAnEmailLabel, setSendAnEmailLabel] = useState('');
    const [sendAnEmailShow, setSendAnEmailShow] = useState('');

    // Fetch settings on component mount
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const settingsData = await getSettings();
            
            // Update state with API data
            setClinicName(settingsData.ClinicName || '');
            setBrandColor(settingsData.BrandColour || '#1877F2');
            setLogoUrl(settingsData.LogoUrl || '');
            setPrivacyNoticeUrl(settingsData.PrivacyNoticeUrl || '');
            setRetention(settingsData.RetentionDays || '90');
            setHandoffEmails(settingsData.HandOffEmails || '');
            setBookNowUrl(settingsData.BookNowUrl || '');
            setBookNowLabel(settingsData.BookNowLabel || '');
            setBookNowShow(settingsData.BookNowShow || '');
            setSendAnEmailLabel(settingsData.SendAnEmailLabel || '');
            setSendAnEmailShow(settingsData.SendAnEmailShow || '');
            
        } catch (err) {
            setError('Failed to load settings. Please try again.');
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage('');
            
            const settingsData = {
                ClinicName: clinicName,
                BrandColour: brandColor,
                LogoUrl: logoUrl,
                PrivacyNoticeUrl: privacyNoticeUrl,
                RetentionDays: retention,
                HandOffEmails: handoffEmails,
                BookNowUrl: bookNowUrl,
                BookNowLabel: bookNowLabel,
                BookNowShow: bookNowShow,
                SendAnEmailLabel: sendAnEmailLabel,
                SendAnEmailShow: sendAnEmailShow
            };
            
            console.log('Saving settings...', settingsData);
            await updateSettings(settingsData);
            
            setSuccessMessage('Settings saved successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            
        } catch (err) {
            setError('Failed to save settings. Please try again.');
            console.error('Error saving settings:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleRefresh = () => {
        fetchSettings();
    };

    if (loading) {
        return (
            <div className="settings-container">
                <div className="settings-header">
                    <div className="header-content">
                        <h1>Settings</h1>
                    </div>
                </div>
                <div className="settings-content">
                    <div className="loading-container">
                        <div className="loading-spinner">Loading settings...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="settings-container">
                <div className="settings-header">
                    <div className="header-content">
                        <h1>Settings</h1>
                    </div>
                </div>
                <div className="settings-content">
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={handleRefresh} className="retry-button">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                            <label>Logo URL</label>
                            <input
                                type="url"
                                value={logoUrl}
                                onChange={(e) => setLogoUrl(e.target.value)}
                                className="form-input"
                                placeholder="https://example.com/logo.png"
                            />
                            {logoUrl && (
                                <div className="logo-preview">
                                    <img src={logoUrl} alt="Logo preview" style={{ maxWidth: '100px', maxHeight: '50px' }} />
                                </div>
                            )}
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

                    {/* Book Now & Email Actions Section */}
                    <div className="settings-section">
                        <h2>
                            <FiExternalLink className="section-icon" />
                            Book Now & Email Actions
                        </h2>

                        <div className="form-group">
                            <label>Book Now URL</label>
                            <input
                                type="url"
                                value={bookNowUrl}
                                onChange={(e) => setBookNowUrl(e.target.value)}
                                className="form-input"
                                placeholder="https://example.com/booking"
                            />
                        </div>

                        <div className="form-group">
                            <label>Book Now Label</label>
                            <input
                                type="text"
                                value={bookNowLabel}
                                onChange={(e) => setBookNowLabel(e.target.value)}
                                className="form-input"
                                placeholder="Book Now"
                            />
                        </div>

                        <div className="form-group">
                            <label>Book Now Visible</label>
                            <select
                                value={bookNowShow?.toLowerCase() === 'true' ? 'visible' : 'hidden'}
                                onChange={(e) => setBookNowShow(e.target.value === 'visible' ? 'True' : 'False')}
                                className="form-select"
                            >
                                <option value="visible">Visible</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Send Email Label</label>
                            <input
                                type="text"
                                value={sendAnEmailLabel}
                                onChange={(e) => setSendAnEmailLabel(e.target.value)}
                                className="form-input"
                                placeholder="Send an email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Send Email Visible</label>
                            <select
                                value={sendAnEmailShow?.toLowerCase() === 'true' ? 'visible' : 'hidden'}
                                onChange={(e) => setSendAnEmailShow(e.target.value === 'visible' ? 'True' : 'False')}
                                className="form-select"
                            >
                                <option value="visible">Visible</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="success-message">
                        <p>{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                <div className="settings-actions">
                    <button className="refresh-button" onClick={handleRefresh} disabled={saving}>
                        <FiSettings className="button-icon" />
                        Refresh Settings
                    </button>
                    <button className="save-button" onClick={handleSave} disabled={saving}>
                        <FiSettings className="button-icon" />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
