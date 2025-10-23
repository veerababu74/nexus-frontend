import React, { useState, useEffect } from 'react';
import { FiSettings, FiShield, FiXCircle, FiAlertTriangle, FiSave, FiRotateCcw, FiLoader } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import {
    getAllBannedPhrases,
    insertBannedPhrase,
    deleteBannedPhrase,
    getSafetyCopy,
    updateSafetyCopy,
    getAllSoftRedFlags,
    insertSoftRedFlag,
    deleteSoftRedFlag,
    getDoctorPersonaSettings,
    saveDoctorPersonaSettings
} from '../../api/toneSafetyAPI';
import './ToneSafety.css';

const ToneSafety = () => {
    const { theme } = useTheme();
    const [formality, setFormality] = useState(4);
    const [empathy, setEmpathy] = useState(3);
    const [brevity, setBrevity] = useState(5);
    const [optimism, setOptimism] = useState(9);
    const [preset, setPreset] = useState('Default');
    const [newBannedPhrase, setNewBannedPhrase] = useState('');
    const [newSoftRedFlag, setNewSoftRedFlag] = useState('');

    // Updated state structure to match API response
    const [bannedPhrases, setBannedPhrases] = useState([]);
    const [softRedFlags, setSoftRedFlags] = useState([]);
    
    // Persona settings state
    const [personaSettings, setPersonaSettings] = useState({
        FormalityPersonaId: "",
        EmpathyPersonaId: "",
        BrevityPersonaId: "",
        OptimismPersonaId: ""
    });
    
    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingSafety, setIsSavingSafety] = useState(false);
    const [isSavingPersona, setIsSavingPersona] = useState(false);
    const [isAddingBannedPhrase, setIsAddingBannedPhrase] = useState(false);
    const [isAddingSoftRedFlag, setIsAddingSoftRedFlag] = useState(false);

    const [safetyResponses, setSafetyResponses] = useState({
        HeaderDisclaimer: "I'm an educational assistant at this clinic. I don't provide",
        RefusalBannedPhrase: "I can't help with symptoms, diagnosis, or medications. For urgent",
        EscalationSoftRedFlag: "Your message suggests something that may need urgent attention"
    });

    // Load data on component mount
    useEffect(() => {
        loadAllData();
    }, []);

    // Update slider values when persona settings change
    useEffect(() => {
        if (personaSettings.FormalityPersonaId) {
            setFormality(parseInt(personaSettings.FormalityPersonaId) || 4);
        }
        if (personaSettings.EmpathyPersonaId) {
            setEmpathy(parseInt(personaSettings.EmpathyPersonaId) || 3);
        }
        if (personaSettings.BrevityPersonaId) {
            setBrevity(parseInt(personaSettings.BrevityPersonaId) || 5);
        }
        if (personaSettings.OptimismPersonaId) {
            setOptimism(parseInt(personaSettings.OptimismPersonaId) || 9);
        }
    }, [personaSettings]);

    const loadAllData = async () => {
        setIsLoading(true);
        try {
            // Load all data in parallel
            const [bannedPhrasesData, softRedFlagsData, safetyCopyData, personaSettingsData] = await Promise.all([
                getAllBannedPhrases(),
                getAllSoftRedFlags(),
                getSafetyCopy(),
                getDoctorPersonaSettings()
            ]);

            setBannedPhrases(bannedPhrasesData || []);
            setSoftRedFlags(softRedFlagsData || []);
            setSafetyResponses({
                HeaderDisclaimer: safetyCopyData.HeaderDisclaimer || "I'm an educational assistant at this clinic. I don't provide",
                RefusalBannedPhrase: safetyCopyData.RefusalBannedPhrase || "I can't help with symptoms, diagnosis, or medications. For urgent",
                EscalationSoftRedFlag: safetyCopyData.EscalationSoftRedFlag || "Your message suggests something that may need urgent attention"
            });
            setPersonaSettings({
                FormalityPersonaId: personaSettingsData.FormalityPersonaId || "",
                EmpathyPersonaId: personaSettingsData.EmpathyPersonaId || "",
                BrevityPersonaId: personaSettingsData.BrevityPersonaId || "",
                OptimismPersonaId: personaSettingsData.OptimismPersonaId || ""
            });
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const presetOptions = [
        'Default',
        'Program Explainer',
        'Educational Assistant',
        'Support Specialist',
        'Information Guide',
        'General Helper'
    ];

    // Define preset values
    const presetValues = {
        'Default': { formality: 4, empathy: 3, brevity: 5, optimism: 9 },
        'Program Explainer': { formality: 5, empathy: 7, brevity: 3, optimism: 8 },
        'Educational Assistant': { formality: 6, empathy: 8, brevity: 4, optimism: 7 },
        'Support Specialist': { formality: 4, empathy: 9, brevity: 5, optimism: 8 },
        'Information Guide': { formality: 7, empathy: 6, brevity: 6, optimism: 7 },
        'General Helper': { formality: 5, empathy: 7, brevity: 4, optimism: 8 }
    };

    const addBannedPhrase = async () => {
        if (newBannedPhrase.trim() && !bannedPhrases.some(p => p.Phrase === newBannedPhrase.trim())) {
            setIsAddingBannedPhrase(true);
            try {
                await insertBannedPhrase(newBannedPhrase.trim());
                // Reload banned phrases to get the latest data with IDs
                const updatedPhrases = await getAllBannedPhrases();
                setBannedPhrases(updatedPhrases);
                setNewBannedPhrase('');
            } catch (error) {
                console.error('Error adding banned phrase:', error);
                alert('Error adding banned phrase. Please try again.');
            } finally {
                setIsAddingBannedPhrase(false);
            }
        }
    };

    const removeBannedPhrase = async (id, phrase) => {
        try {
            await deleteBannedPhrase(id);
            setBannedPhrases(bannedPhrases.filter(p => p.Id !== id));
        } catch (error) {
            console.error('Error removing banned phrase:', error);
            alert('Error removing banned phrase. Please try again.');
        }
    };

    const addSoftRedFlag = async () => {
        if (newSoftRedFlag.trim() && !softRedFlags.some(f => f.Phrase === newSoftRedFlag.trim())) {
            setIsAddingSoftRedFlag(true);
            try {
                await insertSoftRedFlag(newSoftRedFlag.trim());
                // Reload soft red flags to get the latest data with IDs
                const updatedFlags = await getAllSoftRedFlags();
                setSoftRedFlags(updatedFlags);
                setNewSoftRedFlag('');
            } catch (error) {
                console.error('Error adding soft red flag:', error);
                alert('Error adding soft red flag. Please try again.');
            } finally {
                setIsAddingSoftRedFlag(false);
            }
        }
    };

    const removeSoftRedFlag = async (id, keyword) => {
        try {
            await deleteSoftRedFlag(id);
            setSoftRedFlags(softRedFlags.filter(f => f.Id !== id));
        } catch (error) {
            console.error('Error removing soft red flag:', error);
            alert('Error removing soft red flag. Please try again.');
        }
    };

    const handleSliderChange = (setter) => (e) => {
        setter(parseInt(e.target.value));
    };

    const handlePresetChange = (selectedPreset) => {
        setPreset(selectedPreset);
        
        // Apply preset values if they exist
        if (presetValues[selectedPreset]) {
            const values = presetValues[selectedPreset];
            setFormality(values.formality);
            setEmpathy(values.empathy);
            setBrevity(values.brevity);
            setOptimism(values.optimism);
        }
    };

    const handleSave = () => {
        // Save configuration logic here
        console.log('Saving configuration...', {
            formality, empathy, brevity, optimism, preset,
            bannedPhrases, softRedFlags
        });
        alert('Configuration saved successfully!');
    };

    const handlePersonaSave = async () => {
        setIsSavingPersona(true);
        try {
            // Convert slider values (0-10) to string IDs for the API
            const personaData = {
                FormalityPersonaId: formality.toString(),
                EmpathyPersonaId: empathy.toString(),
                BrevityPersonaId: brevity.toString(),
                OptimismPersonaId: optimism.toString()
            };
            
            await saveDoctorPersonaSettings(personaData);
            setPersonaSettings(personaData);
            
            console.log('Saving persona settings...', {
                formality, empathy, brevity, optimism, preset,
                personaData
            });
            alert('Persona settings saved successfully!');
        } catch (error) {
            console.error('Error saving persona settings:', error);
            alert('Error saving persona settings. Please try again.');
        } finally {
            setIsSavingPersona(false);
        }
    };

    const handleSafetySave = async () => {
        setIsSavingSafety(true);
        try {
            await updateSafetyCopy(safetyResponses);
            alert('Safety copy saved successfully!');
        } catch (error) {
            console.error('Error saving safety copy:', error);
            alert('Error saving safety copy. Please try again.');
        } finally {
            setIsSavingSafety(false);
        }
    };

    const handleSafetyResponseChange = (field, value) => {
        setSafetyResponses(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleReset = async () => {
        if (window.confirm('Are you sure you want to reset all configurations? This will reload data from the server.')) {
            // Reset persona values to defaults
            setFormality(4);
            setEmpathy(3);
            setBrevity(5);
            setOptimism(9);
            setPreset('Default');
            
            // Reload all data from API
            await loadAllData();
            
            // Update local slider values based on loaded persona settings
            if (personaSettings.FormalityPersonaId) {
                setFormality(parseInt(personaSettings.FormalityPersonaId) || 4);
            }
            if (personaSettings.EmpathyPersonaId) {
                setEmpathy(parseInt(personaSettings.EmpathyPersonaId) || 3);
            }
            if (personaSettings.BrevityPersonaId) {
                setBrevity(parseInt(personaSettings.BrevityPersonaId) || 5);
            }
            if (personaSettings.OptimismPersonaId) {
                setOptimism(parseInt(personaSettings.OptimismPersonaId) || 9);
            }
            
            alert('Configuration reset and reloaded from server!');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="tone-safety-container">
                <div className="tone-safety-header">
                    <div className="header-content">
                        <h1>Tone & Safety Configuration</h1>
                    </div>
                </div>
                <div className="tone-safety-content" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiLoader size={20} className="loading-spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tone-safety-container">
            <div className="tone-safety-header">
                <div className="header-content">
                    <h1>Tone & Safety Configuration</h1>
                </div>
                <div className="floating-elements">
                    <div className="floating-element"></div>
                    <div className="floating-element"></div>
                    <div className="floating-element"></div>
                </div>
            </div>

            <div className="tone-safety-content">
                <div className="config-grid">
                    {/* Persona Section */}
                    <div className="config-section persona-section">
                        <h2>
                            <FiSettings className="section-icon" />
                            Persona
                        </h2>
                        
                        <div className="slider-group">
                            <div className="slider-container">
                                <div className="slider-header">
                                    <label>Formality</label>
                                    <span className="slider-value">{formality}</span>
                                </div>
                                <div className="slider-wrapper">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={formality}
                                        onChange={handleSliderChange(setFormality)}
                                        className="custom-slider"
                                    />
                                    <div className="slider-track">
                                        <div 
                                            className="slider-fill"
                                            style={{ width: `${formality * 10}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="slider-container">
                                <div className="slider-header">
                                    <label>Empathy</label>
                                    <span className="slider-value">{empathy}</span>
                                </div>
                                <div className="slider-wrapper">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={empathy}
                                        onChange={handleSliderChange(setEmpathy)}
                                        className="custom-slider"
                                    />
                                    <div className="slider-track">
                                        <div 
                                            className="slider-fill"
                                            style={{ width: `${empathy * 10}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="slider-container">
                                <div className="slider-header">
                                    <label>Brevity</label>
                                    <span className="slider-value">{brevity}</span>
                                </div>
                                <div className="slider-wrapper">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={brevity}
                                        onChange={handleSliderChange(setBrevity)}
                                        className="custom-slider"
                                    />
                                    <div className="slider-track">
                                        <div 
                                            className="slider-fill"
                                            style={{ width: `${brevity * 10}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="slider-container">
                                <div className="slider-header">
                                    <label>Optimism</label>
                                    <span className="slider-value">{optimism}</span>
                                </div>
                                <div className="slider-wrapper">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={optimism}
                                        onChange={handleSliderChange(setOptimism)}
                                        className="custom-slider"
                                    />
                                    <div className="slider-track">
                                        <div 
                                            className="slider-fill"
                                            style={{ width: `${optimism * 10}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="preset-section">
                            <label>Preset</label>
                            <select 
                                value={preset} 
                                onChange={(e) => handlePresetChange(e.target.value)}
                                className="preset-select"
                            >
                                {presetOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <button className="section-save-button" onClick={handlePersonaSave} disabled={isSavingPersona}>
                            <FiSave className="button-icon" />
                            {isSavingPersona ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    {/* Safety Copy Section */}
                    <div className="config-section safety-section">
                        <h2>
                            <FiShield className="section-icon" />
                            Safety Copy
                        </h2>

                        <div className="safety-response">
                            <label>Header Disclaimer</label>
                            <textarea
                                value={safetyResponses.HeaderDisclaimer}
                                onChange={(e) => handleSafetyResponseChange('HeaderDisclaimer', e.target.value)}
                                className="safety-textarea"
                            />
                        </div>

                        <div className="safety-response">
                            <label>Refusal (clinical)</label>
                            <textarea
                                value={safetyResponses.RefusalBannedPhrase}
                                onChange={(e) => handleSafetyResponseChange('RefusalBannedPhrase', e.target.value)}
                                className="safety-textarea"
                            />
                        </div>

                        <div className="safety-response">
                            <label>Escalation (soft RF)</label>
                            <textarea
                                value={safetyResponses.EscalationSoftRedFlag}
                                onChange={(e) => handleSafetyResponseChange('EscalationSoftRedFlag', e.target.value)}
                                className="safety-textarea"
                            />
                        </div>

                        <button className="section-save-button" onClick={handleSafetySave} disabled={isSavingSafety}>
                            <FiSave className="button-icon" />
                            {isSavingSafety ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    {/* Banned Phrases Section */}
                    <div className="config-section banned-section">
                        <h2>
                            <FiXCircle className="section-icon" />
                            Banned Phrases
                        </h2>

                        <div className="tags-container">
                            {bannedPhrases.map((phraseObj, index) => (
                                <div key={phraseObj.Id || index} className="tag banned-tag">
                                    <span>{phraseObj.Phrase}</span>
                                    <button 
                                        onClick={() => removeBannedPhrase(phraseObj.Id, phraseObj.Phrase)}
                                        className="tag-remove"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="add-item">
                            <input
                                type="text"
                                placeholder="add phrase"
                                value={newBannedPhrase}
                                onChange={(e) => setNewBannedPhrase(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addBannedPhrase()}
                                className="add-input"
                                disabled={isAddingBannedPhrase}
                            />
                            <button onClick={addBannedPhrase} className="add-button" disabled={isAddingBannedPhrase}>
                                {isAddingBannedPhrase ? <FiLoader className="loading-spinner" size={14} /> : 'Add'}
                            </button>
                        </div>
                    </div>

                    {/* Soft Red-flag Keywords Section */}
                    <div className="config-section redflags-section">
                        <h2>
                            <FiAlertTriangle className="section-icon" />
                            Soft Red-flag Keywords
                        </h2>

                        <div className="tags-container">
                            {softRedFlags.map((flagObj, index) => (
                                <div key={flagObj.Id || index} className="tag redflag-tag">
                                    <span>{flagObj.Phrase}</span>
                                    <button 
                                        onClick={() => removeSoftRedFlag(flagObj.Id, flagObj.Phrase)}
                                        className="tag-remove"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="add-item">
                            <input
                                type="text"
                                placeholder="add keyword"
                                value={newSoftRedFlag}
                                onChange={(e) => setNewSoftRedFlag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSoftRedFlag()}
                                className="add-input"
                                disabled={isAddingSoftRedFlag}
                            />
                            <button onClick={addSoftRedFlag} className="add-button" disabled={isAddingSoftRedFlag}>
                                {isAddingSoftRedFlag ? <FiLoader className="loading-spinner" size={14} /> : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToneSafety;
