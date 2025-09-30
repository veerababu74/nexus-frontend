import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiSave, FiMessageSquare, FiLoader } from 'react-icons/fi';
import { saveStarterQuestions, getStarterQuestions } from '../../api/starterQuestionsAPI';
import './StarterQuestions.css';

const StarterQuestions = () => {
  const { theme } = useTheme();
  const [questions, setQuestions] = useState({
    q1: '',
    a1: '',
    q2: '',
    a2: '',
    q3: '',
    a3: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Load existing questions on component mount
  useEffect(() => {
    loadStarterQuestions();
  }, []);

  const loadStarterQuestions = async () => {
    try {
      setIsLoading(true);
      const data = await getStarterQuestions();
      if (data) {
        setQuestions({
          q1: data.q1 || '',
          a1: data.a1 || '',
          q2: data.q2 || '',
          a2: data.a2 || '',
          q3: data.q3 || '',
          a3: data.a3 || ''
        });
      }
    } catch (error) {
      console.error('Error loading starter questions:', error);
      // Keep default empty questions if loading fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setQuestions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    try {
      await saveStarterQuestions(questions);
      setSuccessMessage('Starter questions saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving starter questions:', error);
      alert('Error saving starter questions. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="starter-questions-container" style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiLoader size={20} className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="starter-questions-container"
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary 
      }}
    >
      <div className="starter-questions-header">
        <div className="header-info">
          <FiMessageSquare size={24} style={{ color: theme.colors.primary }} />
          <div>
            <h2 style={{ color: theme.colors.textPrimary }}>Starter Questions</h2>
            <p style={{ color: theme.colors.textSecondary }}>
              Create predefined questions and answers to help users get started
            </p>
          </div>
        </div>
      </div>

      <div className="questions-form">
        <div className="questions-container">
          
          {/* Question 1 Container */}
          <div className="question-block">
            <div className="question-section">
              <label className="question-label" style={{ color: theme.colors.textSecondary }}>
                Question 1:
              </label>
              <input
                type="text"
                placeholder="Enter your first question"
                value={questions.q1}
                onChange={(e) => handleInputChange('q1', e.target.value)}
                className="question-input"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border
                }}
              />
            </div>
            <div className="answer-section">
              <label className="answer-label" style={{ color: theme.colors.textSecondary }}>
                Answer 1:
              </label>
              <textarea
                placeholder="Enter the answer for question 1"
                value={questions.a1}
                onChange={(e) => handleInputChange('a1', e.target.value)}
                className="answer-input"
                rows="4"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border
                }}
              />
            </div>
          </div>

          {/* Question 2 Container */}
          <div className="question-block">
            <div className="question-section">
              <label className="question-label" style={{ color: theme.colors.textSecondary }}>
                Question 2:
              </label>
              <input
                type="text"
                placeholder="Enter your second question"
                value={questions.q2}
                onChange={(e) => handleInputChange('q2', e.target.value)}
                className="question-input"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border
                }}
              />
            </div>
            <div className="answer-section">
              <label className="answer-label" style={{ color: theme.colors.textSecondary }}>
                Answer 2:
              </label>
              <textarea
                placeholder="Enter the answer for question 2"
                value={questions.a2}
                onChange={(e) => handleInputChange('a2', e.target.value)}
                className="answer-input"
                rows="4"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border
                }}
              />
            </div>
          </div>

          {/* Question 3 Container */}
          <div className="question-block">
            <div className="question-section">
              <label className="question-label" style={{ color: theme.colors.textSecondary }}>
                Question 3:
              </label>
              <input
                type="text"
                placeholder="Enter your third question"
                value={questions.q3}
                onChange={(e) => handleInputChange('q3', e.target.value)}
                className="question-input"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border
                }}
              />
            </div>
            <div className="answer-section">
              <label className="answer-label" style={{ color: theme.colors.textSecondary }}>
                Answer 3:
              </label>
              <textarea
                placeholder="Enter the answer for question 3"
                value={questions.a3}
                onChange={(e) => handleInputChange('a3', e.target.value)}
                className="answer-input"
                rows="4"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border
                }}
              />
            </div>
          </div>

        </div>

        {/* Save Button */}
        <div className="save-section">
          {successMessage && (
            <div 
              className="success-message"
              style={{ 
                color: theme.colors.success || '#22c55e',
                marginBottom: '1rem',
                textAlign: 'center'
              }}
            >
              {successMessage}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="save-button"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.onPrimary
            }}
          >
            <FiSave size={18} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarterQuestions;