import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiPlus, 
  FiSearch, 
  FiRefreshCw, 
  FiChevronDown, 
  FiChevronUp,
  FiHelpCircle,
  FiEdit3,
  FiTag,
  FiFileText,
  FiX
} from 'react-icons/fi';
import './FAQ.css';
import { insertFAQ, getAllFAQs } from '../../api/faqAPI';

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
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedTag, setSelectedTag] = useState('');

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

    const toggleFAQ = (index) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    // Get unique tags for filtering
    const uniqueTags = [...new Set(
        faqs.flatMap(faq => 
            faq.tags ? faq.tags.split(',').map(tag => tag.trim()) : []
        )
    )].filter(tag => tag);

    // Filter FAQs based on search term and selected tag
    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = 
            faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (faq.tags && faq.tags.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesTag = !selectedTag || 
            (faq.tags && faq.tags.toLowerCase().includes(selectedTag.toLowerCase()));
        
        return matchesSearch && matchesTag;
    });

    console.log('Total FAQs:', faqs.length);
    console.log('Filtered FAQs:', filteredFAQs.length);
    console.log('Search term:', searchTerm);
    console.log('Selected tag:', selectedTag);

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
                    
                    <button
                        className="action-btn add-btn"
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

            {/* Search and Filter Section */}
            <div className="search-filter-section">
                <div className="search-container">
                    <div className="search-box">
                        <FiSearch size={20} style={{ color: theme.colors.textSecondary }} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search FAQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                backgroundColor: 'transparent',
                                color: theme.colors.textPrimary
                            }}
                        />
                    </div>
                </div>

                {uniqueTags.length > 0 && (
                    <div className="filter-tags">
                        <button
                            className={`tag-filter ${!selectedTag ? 'active' : ''}`}
                            onClick={() => setSelectedTag('')}
                            style={{
                                backgroundColor: !selectedTag ? theme.colors.primary : theme.colors.background,
                                color: !selectedTag ? theme.colors.onPrimary : theme.colors.textPrimary,
                                border: `1px solid ${!selectedTag ? theme.colors.primary : theme.colors.border}`
                            }}
                        >
                            All
                        </button>
                        {uniqueTags.map((tag, index) => (
                            <button
                                key={index}
                                className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
                                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                                style={{
                                    backgroundColor: selectedTag === tag ? theme.colors.primary : theme.colors.background,
                                    color: selectedTag === tag ? theme.colors.onPrimary : theme.colors.textPrimary,
                                    border: `1px solid ${selectedTag === tag ? theme.colors.primary : theme.colors.border}`
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
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
                            {searchTerm || selectedTag 
                                ? 'Try adjusting your search or filter criteria' 
                                : 'Add your first FAQ to get started'
                            }
                        </p>
                        {!searchTerm && !selectedTag && !showAddForm && (
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
                                className="faq-item"
                                style={{ 
                                    backgroundColor: theme.colors.surface,
                                    border: `1px solid ${theme.colors.border}`
                                }}
                            >
                                <div
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                    style={{ backgroundColor: theme.colors.background }}
                                >
                                    <h3 style={{ color: theme.colors.textPrimary }}>
                                        {faq.question}
                                    </h3>
                                    <div className="question-meta">
                                        {faq.tags && (
                                            <div className="question-tags">
                                                {faq.tags.split(',').map((tag, tagIndex) => (
                                                    <span 
                                                        key={tagIndex}
                                                        className="tag"
                                                        style={{
                                                            backgroundColor: theme.colors.primary + '20',
                                                            color: theme.colors.primary
                                                        }}
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <button 
                                            className="toggle-btn"
                                            style={{ color: theme.colors.primary }}
                                        >
                                            {expandedFAQ === index ? 
                                                <FiChevronUp size={20} /> : 
                                                <FiChevronDown size={20} />
                                            }
                                        </button>
                                    </div>
                                </div>
                                
                                {expandedFAQ === index && (
                                    <div 
                                        className="faq-answer"
                                        style={{ backgroundColor: theme.colors.surface }}
                                    >
                                        <p style={{ color: theme.colors.textPrimary }}>
                                            {faq.answer}
                                        </p>
                                        {faq.id && (
                                            <div 
                                                className="faq-id"
                                                style={{ color: theme.colors.textSecondary }}
                                            >
                                                <strong>ID:</strong> {faq.id}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FAQ;
