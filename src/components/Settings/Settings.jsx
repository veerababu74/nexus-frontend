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
    const [textColor, setTextColor] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [privacyNoticeUrl, setPrivacyNoticeUrl] = useState('');
    const [retention, setRetention] = useState('90');
    const [handoffEmails, setHandoffEmails] = useState('');
    
    // New fields for the Book Now section
    const [bookNowUrl, setBookNowUrl] = useState('');
    const [bookNowLabel, setBookNowLabel] = useState('');
    const [bookNowShow, setBookNowShow] = useState('');
    const [sendAnEmailLabel, setSendAnEmailLabel] = useState('');
    const [sendAnEmailShow, setSendAnEmailShow] = useState('');
    
    // New CTA Two fields
    const [ctaTwoUrl, setCtaTwoUrl] = useState('');
    const [ctaTwoLabel, setCtaTwoLabel] = useState('');
    const [ctaTwoShow, setCtaTwoShow] = useState('');
    
    // Intro Message
    const [introMessage, setIntroMessage] = useState('');

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
            setTextColor(settingsData.TextColour || '');
            setLogoUrl(settingsData.LogoUrl || '');
            setPrivacyNoticeUrl(settingsData.PrivacyNoticeUrl || '');
            setRetention(settingsData.RetentionDays || '90');
            setHandoffEmails(settingsData.HandOffEmails || '');
            setBookNowUrl(settingsData.BookNowUrl || '');
            setBookNowLabel(settingsData.BookNowLabel || '');
            setBookNowShow(settingsData.BookNowShow || '');
            setSendAnEmailLabel(settingsData.SendAnEmailLabel || '');
            setSendAnEmailShow(settingsData.SendAnEmailShow || '');
            setCtaTwoUrl(settingsData.CTATwoUrl || '');
            setCtaTwoLabel(settingsData.CTATwoLabel || '');
            setCtaTwoShow(settingsData.CTATwoShow || '');
            setIntroMessage(settingsData.IntroMessage || '');
            
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
            
            // Create FormData for multipart/form-data submission
            const formData = new FormData();
            
            // Add all fields to FormData
            formData.append('ClinicName', clinicName);
            formData.append('BrandColour', brandColor);
            formData.append('TextColour', textColor);
            formData.append('PrivacyNoticeUrl', privacyNoticeUrl);
            formData.append('RetentionDays', retention);
            formData.append('HandOffEmails', handoffEmails);
            formData.append('BookNowUrl', bookNowUrl);
            formData.append('BookNowLabel', bookNowLabel);
            formData.append('BookNowShow', bookNowShow);
            formData.append('SendAnEmailLabel', sendAnEmailLabel);
            formData.append('SendAnEmailShow', sendAnEmailShow);
            formData.append('CTATwoUrl', ctaTwoUrl);
            formData.append('CTATwoLabel', ctaTwoLabel);
            formData.append('CTATwoShow', ctaTwoShow);
            formData.append('IntroMessage', introMessage);
            
            // Add logo file if selected
            if (logoFile) {
                formData.append('WidgetAvatar', logoFile);
            }
            
            console.log('Saving settings...');
            const response = await updateSettings(formData);
            
            // If a new logo was uploaded, update the logoUrl with the response
            if (response && typeof response === 'string') {
                // Assuming the response contains the new logo URL
                setLogoUrl(response);
            }
            
            setSuccessMessage('Settings saved successfully!');
            
            // Clear the file input after successful upload
            setLogoFile(null);
            
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

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setLogoFile(file);
            // Create a temporary URL for preview
            const previewUrl = URL.createObjectURL(file);
            setLogoUrl(previewUrl);
        }
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
                            <label>Text color</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="color-input"
                                />
                                <div className="color-preview" style={{ backgroundColor: textColor }}></div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Logo Upload</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="form-input"
                            />
                            {logoUrl && (
                                <div className="logo-preview">
                                    <img src={logoUrl} alt="Logo preview" style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }} />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Intro Message</label>
                            <textarea
                                value={introMessage}
                                onChange={(e) => setIntroMessage(e.target.value)}
                                className="form-textarea"
                                placeholder="Enter introduction message for your chat widget"
                                rows="3"
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

                    {/* Action Buttons Section */}
                    <div className="settings-section">
                        <h2>
                            <FiExternalLink className="section-icon" />
                            Action Buttons
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

                        <div className="form-group">
                            <label>CTA Two URL</label>
                            <input
                                type="url"
                                value={ctaTwoUrl}
                                onChange={(e) => setCtaTwoUrl(e.target.value)}
                                className="form-input"
                                placeholder="https://example.com/action"
                            />
                        </div>

                        <div className="form-group">
                            <label>CTA Two Label</label>
                            <input
                                type="text"
                                value={ctaTwoLabel}
                                onChange={(e) => setCtaTwoLabel(e.target.value)}
                                className="form-input"
                                placeholder="Custom Action"
                            />
                        </div>

                        <div className="form-group">
                            <label>CTA Two Visible</label>
                            <select
                                value={ctaTwoShow?.toLowerCase() === 'true' ? 'visible' : 'hidden'}
                                onChange={(e) => setCtaTwoShow(e.target.value === 'visible' ? 'True' : 'False')}
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
