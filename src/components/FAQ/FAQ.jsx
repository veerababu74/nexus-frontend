import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiPlus, 
  FiSearch, 
  FiRefreshCw, 
  FiHelpCircle,
  FiEdit3,
  FiTag,
  FiFileText,
  FiX,
  FiTrash2
} from 'react-icons/fi';
import './FAQ.css';
import { insertFAQ, getAllFAQs, deleteFAQ } from '../../api/faqAPI';

const FAQ = () => {
    const { theme } = useTheme();
    const [faqs, setFaqs] = useState([]);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        tags: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Load FAQs on component mount
    useEffect(() => {
        loadFAQs();
    }, []);

    // Auto-hide messages after 3 seconds
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const loadFAQs = async () => {
        setIsLoading(true);
        try {
            console.log('Loading FAQs...');
            const response = await getAllFAQs();
            console.log('FAQ API response:', response);
            console.log('FAQ data array:', response.data);
            setFaqs(response.data || []);
            if (message.type === '') {
                setMessage({ type: 'success', text: `FAQs loaded successfully! Found ${response.data?.length || 0} FAQs.` });
            }
        } catch (error) {
            console.error('Error loading FAQs:', error);
            setMessage({ type: 'error', text: 'Failed to load FAQs. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.question.trim() || !formData.answer.trim()) {
            setMessage({ type: 'error', text: 'Please fill in both question and answer' });
            return;
        }

        setIsLoading(true);
        try {
            await insertFAQ(formData);
            setFormData({ question: '', answer: '', tags: '' });
            setShowAddForm(false);
            await loadFAQs(); // Reload FAQs after successful submission
            setMessage({ type: 'success', text: 'FAQ added successfully!' });
        } catch (error) {
            console.error('Error adding FAQ:', error);
            setMessage({ type: 'error', text: 'Error adding FAQ. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (faqId) => {
        if (!window.confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
            return;
        }

        setIsLoading(true);
        try {
            await deleteFAQ(faqId);
            await loadFAQs(); // Reload FAQs after successful deletion
            setMessage({ type: 'success', text: 'FAQ deleted successfully!' });
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            setMessage({ type: 'error', text: 'Error deleting FAQ. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Get unique tags for filtering (keeping for display purposes)
    const uniqueTags = [...new Set(
        faqs.flatMap(faq => 
            faq.tags ? faq.tags.split(',').map(tag => tag.trim()) : []
        )
    )].filter(tag => tag);

    // Filter FAQs based on search term only
    const filteredFAQs = faqs.filter(faq => {
        if (!searchTerm) return true; // Show all if no search term
        
        const matchesSearch = 
            faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (faq.tags && faq.tags.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesSearch;
    });

    console.log('Total FAQs:', faqs.length);
    console.log('Filtered FAQs:', filteredFAQs.length);
    console.log('Search term:', searchTerm);

    return (
        <div className="faq-container">
            {/* Header */}
            <div className="faq-header">
                <div className="header-content">
                    <h1 
                        className="faq-title"
                        style={{ color: theme.colors.textPrimary }}
                    >
                        <FiHelpCircle size={28} />
                        Knowledge Base
                    </h1>
                    <p 
                        className="faq-subtitle"
                        style={{ color: theme.colors.textSecondary }}
                    >
                        Manage frequently asked questions and knowledge articles
                    </p>
                </div>
                
                <div className="header-actions">
                    <button
                        className="action-btn refresh-btn"
                        onClick={loadFAQs}
                        disabled={isLoading}
                        style={{
                            backgroundColor: theme.colors.background,
                            border: `1px solid ${theme.colors.border}`,
                            color: theme.colors.textPrimary
                        }}
                    >
                        <FiRefreshCw size={16} className={isLoading ? 'spinning' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div 
                    className={`message ${message.type}`}
                    style={{
                        backgroundColor: message.type === 'success' 
                            ? 'rgba(16, 185, 129, 0.1)' 
                            : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${message.type === 'success' ? '#10B981' : '#EF4444'}`,
                        color: message.type === 'success' ? '#065F46' : '#991B1B'
                    }}
                >
                    {message.text}
                </div>
            )}

            {/* Add FAQ Form */}
            {showAddForm && (
                <div 
                    className="add-faq-section"
                    style={{ 
                        backgroundColor: theme.colors.surface,
                        border: `1px solid ${theme.colors.border}`
                    }}
                >
                    <div className="form-header">
                        <h2 
                            className="form-title"
                            style={{ color: theme.colors.textPrimary }}
                        >
                            <FiEdit3 size={20} />
                            Add New FAQ
                        </h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="faq-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label 
                                    htmlFor="question"
                                    style={{ color: theme.colors.textPrimary }}
                                >
                                    <FiHelpCircle size={16} />
                                    Question
                                </label>
                                <input
                                    type="text"
                                    id="question"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleInputChange}
                                    placeholder="Enter your question here..."
                                    required
                                    style={{
                                        backgroundColor: theme.colors.background,
                                        border: `1px solid ${theme.colors.border}`,
                                        color: theme.colors.textPrimary
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <label 
                                    htmlFor="tags"
                                    style={{ color: theme.colors.textPrimary }}
                                >
                                    <FiTag size={16} />
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="e.g. support, billing, technical"
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
                                htmlFor="answer"
                                style={{ color: theme.colors.textPrimary }}
                            >
                                <FiFileText size={16} />
                                Answer
                            </label>
                            <textarea
                                id="answer"
                                name="answer"
                                value={formData.answer}
                                onChange={handleInputChange}
                                placeholder="Provide a detailed answer..."
                                rows="4"
                                required
                                style={{
                                    backgroundColor: theme.colors.background,
                                    border: `1px solid ${theme.colors.border}`,
                                    color: theme.colors.textPrimary
                                }}
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowAddForm(false)}
                                style={{
                                    backgroundColor: theme.colors.background,
                                    border: `1px solid ${theme.colors.border}`,
                                    color: theme.colors.textPrimary
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    color: theme.colors.onPrimary
                                }}
                            >
                                {isLoading ? 'Adding...' : 'Add FAQ'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search Section */}
            <div className="search-section">
                <div className="search-container">
                    <div className="search-box">
                        <FiSearch size={20} style={{ color: theme.colors.textSecondary }} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search FAQs by title, answer, or tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                backgroundColor: 'transparent',
                                color: theme.colors.textPrimary
                            }}
                        />
                    </div>
                    <button
                        className="add-faq-btn"
                        onClick={() => setShowAddForm(!showAddForm)}
                        style={{
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.onPrimary
                        }}
                    >
                        {showAddForm ? <FiX size={16} /> : <FiPlus size={16} />}
                        {showAddForm ? 'Cancel' : 'Add FAQ'}
                    </button>
                </div>
            </div>

            {/* FAQ List */}
            <div className="faq-list-section">
                <div className="section-header">
                    <h2 
                        className="section-title"
                        style={{ color: theme.colors.textPrimary }}
                    >
                        Frequently Asked Questions
                        <span 
                            className="faq-count"
                            style={{ 
                                backgroundColor: theme.colors.primary,
                                color: theme.colors.onPrimary 
                            }}
                        >
                            {filteredFAQs.length}
                        </span>
                    </h2>
                </div>

                {isLoading && faqs.length === 0 ? (
                    <div 
                        className="loading-state"
                        style={{ 
                            backgroundColor: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`
                        }}
                    >
                        <div className="loading-spinner"></div>
                        <p style={{ color: theme.colors.textSecondary }}>Loading FAQs...</p>
                    </div>
                ) : filteredFAQs.length === 0 ? (
                    <div 
                        className="empty-state"
                        style={{ 
                            backgroundColor: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`
                        }}
                    >
                        <FiHelpCircle 
                            size={48} 
                            style={{ color: theme.colors.textSecondary, opacity: 0.5 }}
                        />
                        <h3 style={{ color: theme.colors.textPrimary }}>No FAQs found</h3>
                        <p style={{ color: theme.colors.textSecondary }}>
                            {searchTerm 
                                ? 'Try adjusting your search criteria' 
                                : 'Add your first FAQ to get started'
                            }
                        </p>
                        {!searchTerm && !showAddForm && (
                            <button
                                className="empty-action-btn"
                                onClick={() => setShowAddForm(true)}
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    color: theme.colors.onPrimary
                                }}
                            >
                                <FiPlus size={16} />
                                Add First FAQ
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="faq-list">
                        {filteredFAQs.map((faq, index) => (
                            <div 
                                key={faq.id || index} 
                                className="faq-item-simple"
                                style={{ 
                                    backgroundColor: theme.colors.surface,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    marginBottom: '1rem'
                                }}
                            >
                                {/* FAQ Title */}
                                <div className="faq-title-row">
                                    <h3 style={{ 
                                        color: theme.colors.textPrimary,
                                        margin: '0 0 1rem 0',
                                        fontSize: '1.1rem',
                                        fontWeight: '600'
                                    }}>
                                        <FiHelpCircle size={18} style={{ marginRight: '0.5rem', color: theme.colors.primary }} />
                                        {faq.question}
                                    </h3>
                                </div>

                                {/* FAQ Answer */}
                                <div className="faq-answer-row" style={{ marginBottom: '1rem' }}>
                                    <p style={{ 
                                        color: theme.colors.textPrimary,
                                        margin: '0',
                                        lineHeight: '1.6',
                                        fontSize: '0.95rem'
                                    }}>
                                        {faq.answer}
                                    </p>
                                </div>

                                {/* FAQ Tags and ID */}
                                <div className="faq-meta-row" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                        {faq.tags && (
                                            <div className="faq-tags" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {faq.tags.split(',').map((tag, tagIndex) => (
                                                    <span 
                                                        key={tagIndex}
                                                        style={{
                                                            backgroundColor: theme.colors.primary + '20',
                                                            color: theme.colors.primary,
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '12px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        <FiTag size={12} style={{ marginRight: '0.25rem' }} />
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {faq.id && (
                                            <span style={{ 
                                                color: theme.colors.textSecondary,
                                                fontSize: '0.8rem',
                                                fontFamily: 'monospace'
                                            }}>
                                                ID: {faq.id}
                                            </span>
                                        )}
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        disabled={isLoading}
                                        style={{
                                            background: 'transparent',
                                            border: `1px solid ${theme.colors.error || '#ef4444'}`,
                                            color: theme.colors.error || '#ef4444',
                                            padding: '0.5rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            fontSize: '0.8rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s ease',
                                            opacity: isLoading ? 0.6 : 1
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isLoading) {
                                                e.target.style.backgroundColor = theme.colors.error || '#ef4444';
                                                e.target.style.color = 'white';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isLoading) {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = theme.colors.error || '#ef4444';
                                            }
                                        }}
                                        title="Delete FAQ"
                                    >
                                        <FiTrash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FAQ;
