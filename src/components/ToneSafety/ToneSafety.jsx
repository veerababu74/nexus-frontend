import React, { useState } from 'react';
import { FiSettings, FiShield, FiXCircle, FiAlertTriangle, FiSave, FiRotateCcw } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import './ToneSafety.css';

const ToneSafety = () => {
    const { theme } = useTheme();
    const [formality, setFormality] = useState(5);
    const [empathy, setEmpathy] = useState(7);
    const [brevity, setBrevity] = useState(3);
    const [optimism, setOptimism] = useState(8);
    const [preset, setPreset] = useState('Program Explainer');
    const [newBannedPhrase, setNewBannedPhrase] = useState('');
    const [newSoftRedFlag, setNewSoftRedFlag] = useState('');

    const [bannedPhrases, setBannedPhrases] = useState([
        'diagnose', 'diagnosis', 'prescription', 'dosage', 'cure', 'guarantee'
    ]);

    const [softRedFlags, setSoftRedFlags] = useState([
        'chest pain', 'suicidal', 'self-harm', 'new weakness', 'foot drop', 
        'saddle numbness', 'bladder', 'bowel', 'fever after injection', 
        'severe back pain after fall'
    ]);

    const [safetyResponses, setSafetyResponses] = useState({
        headerDisclaimer: "I'm an educational assistant at this clinic. I don't provide",
        refusal: "I can't help with symptoms, diagnosis, or medications. For urgent",
        escalation: "Your message suggests something that may need urgent attention"
    });

    const presetOptions = [
        'Program Explainer',
        'Educational Assistant',
        'Support Specialist',
        'Information Guide',
        'General Helper'
    ];

    const addBannedPhrase = () => {
        if (newBannedPhrase.trim() && !bannedPhrases.includes(newBannedPhrase.trim())) {
            setBannedPhrases([...bannedPhrases, newBannedPhrase.trim()]);
            setNewBannedPhrase('');
        }
    };

    const removeBannedPhrase = (phrase) => {
        setBannedPhrases(bannedPhrases.filter(p => p !== phrase));
    };

    const addSoftRedFlag = () => {
        if (newSoftRedFlag.trim() && !softRedFlags.includes(newSoftRedFlag.trim())) {
            setSoftRedFlags([...softRedFlags, newSoftRedFlag.trim()]);
            setNewSoftRedFlag('');
        }
    };

    const removeSoftRedFlag = (keyword) => {
        setSoftRedFlags(softRedFlags.filter(k => k !== keyword));
    };

    const handleSliderChange = (setter) => (e) => {
        setter(parseInt(e.target.value));
    };

    const handleSave = () => {
        // Save configuration logic here
        console.log('Saving configuration...', {
            formality, empathy, brevity, optimism, preset,
            bannedPhrases, softRedFlags
        });
        alert('Configuration saved successfully!');
    };

    const handlePersonaSave = () => {
        console.log('Saving persona settings...', {
            formality, empathy, brevity, optimism, preset
        });
        alert('Persona settings saved successfully!');
    };

    const handleSafetySave = () => {
        console.log('Saving safety copy...', safetyResponses);
        alert('Safety copy saved successfully!');
    };

    const handleSafetyResponseChange = (field, value) => {
        setSafetyResponses(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleReset = () => {
        // Reset to default values
        setFormality(5);
        setEmpathy(7);
        setBrevity(3);
        setOptimism(8);
        setPreset('Program Explainer');
        setBannedPhrases(['diagnose', 'diagnosis', 'prescription', 'dosage', 'cure', 'guarantee']);
        setSoftRedFlags(['chest pain', 'suicidal', 'self-harm', 'new weakness', 'foot drop', 
            'saddle numbness', 'bladder', 'bowel', 'fever after injection', 
            'severe back pain after fall']);
        setSafetyResponses({
            headerDisclaimer: "I'm an educational assistant at this clinic. I don't provide",
            refusal: "I can't help with symptoms, diagnosis, or medications. For urgent",
            escalation: "Your message suggests something that may need urgent attention"
        });
        alert('Configuration reset to defaults!');
    };

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
                                    <span className="slider-value">{formality}%</span>
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
                                    <span className="slider-value">{empathy }%</span>
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
                                    <span className="slider-value">{brevity}%</span>
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
                                    <span className="slider-value">{optimism}%</span>
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
                                onChange={(e) => setPreset(e.target.value)}
                                className="preset-select"
                            >
                                {presetOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <button className="section-save-button" onClick={handlePersonaSave}>
                            <FiSave className="button-icon" />
                            Save
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
                                value={safetyResponses.headerDisclaimer}
                                onChange={(e) => handleSafetyResponseChange('headerDisclaimer', e.target.value)}
                                className="safety-textarea"
                            />
                        </div>

                        <div className="safety-response">
                            <label>Refusal (clinical)</label>
                            <textarea
                                value={safetyResponses.refusal}
                                onChange={(e) => handleSafetyResponseChange('refusal', e.target.value)}
                                className="safety-textarea"
                            />
                        </div>

                        <div className="safety-response">
                            <label>Escalation (soft RF)</label>
                            <textarea
                                value={safetyResponses.escalation}
                                onChange={(e) => handleSafetyResponseChange('escalation', e.target.value)}
                                className="safety-textarea"
                            />
                        </div>

                        <button className="section-save-button" onClick={handleSafetySave}>
                            <FiSave className="button-icon" />
                            Save
                        </button>
                    </div>

                    {/* Banned Phrases Section */}
                    <div className="config-section banned-section">
                        <h2>
                            <FiXCircle className="section-icon" />
                            Banned Phrases
                        </h2>

                        <div className="tags-container">
                            {bannedPhrases.map((phrase, index) => (
                                <div key={index} className="tag banned-tag">
                                    <span>{phrase}</span>
                                    <button 
                                        onClick={() => removeBannedPhrase(phrase)}
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
                            />
                            <button onClick={addBannedPhrase} className="add-button">
                                Add
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
                            {softRedFlags.map((keyword, index) => (
                                <div key={index} className="tag redflag-tag">
                                    <span>{keyword}</span>
                                    <button 
                                        onClick={() => removeSoftRedFlag(keyword)}
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
                            />
                            <button onClick={addSoftRedFlag} className="add-button">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToneSafety;
