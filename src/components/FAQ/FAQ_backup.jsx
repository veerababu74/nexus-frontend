import React, { useState, useEffect } from 'react';
import './FAQ.css';
import { insertFAQ, getAllFAQs } from '../../api/faqAPI';

const FAQ = () => {
    const [faqs, setFAQs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state for adding new FAQ
    const [formData, setFormData] = useState({
        title: '',
        answer: '',
        tags: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFAQs, setExpandedFAQs] = useState(new Set());

    // Load FAQs on component mount
    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getAllFAQs();
            setFAQs(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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

        if (!formData.title.trim() || !formData.answer.trim()) {
            setError('Title and answer are required');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const faqData = {
                id: `faq_${Date.now()}`,
                title: formData.title.trim(),
                answer: formData.answer.trim(),
                tags: formData.tags.trim()
            };

            await insertFAQ(faqData);
            setSuccess('FAQ added successfully!');

            // Reset form
            setFormData({
                title: '',
                answer: '',
                tags: ''
            });

            // Reload FAQs
            loadFAQs();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleFAQ = (index) => {
        const newExpanded = new Set(expandedFAQs);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedFAQs(newExpanded);
    };

    const filteredFAQs = faqs.filter(faq =>
        (faq.title && faq.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (faq.answer && faq.answer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (faq.tags && faq.tags.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="faq-container">
            <div className="faq-header">
                <div className="header-content">
                    <h1>❓ FAQ Manager</h1>
                </div>
                <div className="faq-actions">
                    <button
                        className="refresh-btn"
                        onClick={loadFAQs}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && <div className="message success">{success}</div>}
            {error && <div className="message error">{error}</div>}

            {/* Add FAQ Form - Always Visible */}
            <div className="faq-form-container">
                <h2>➕ Add New FAQ</h2>
                <form onSubmit={handleSubmit} className="faq-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="title">Question: *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="What's your question?"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tags">Tags:</label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="general, help, documentation"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="answer">Answer: *</label>
                        <textarea
                            id="answer"
                            name="answer"
                            value={formData.answer}
                            onChange={handleInputChange}
                            placeholder="Provide a clear and helpful answer..."
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? '⏳ Adding...' : '✨ Add FAQ'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="🔍 Search FAQs by title, content, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* FAQ List */}
            <div className="faq-list-container">
                {loading && (
                    <div className="loading">
                        <div className="loading-spinner">⏳</div>
                        Loading FAQs...
                    </div>
                )}

                {!loading && filteredFAQs.length === 0 && (
                    <div className="no-faqs">
                        {searchTerm ? (
                            <>
                                <div className="no-results-icon">🔍</div>
                                <p>No FAQs found matching your search.</p>
                                <p>Try different keywords or clear your search.</p>
                            </>
                        ) : (
                            <>
                                <div className="no-results-icon">📝</div>
                                <p>No FAQs available yet.</p>
                                <p>Be the first to add one!</p>
                            </>
                        )}
                    </div>
                )}

                {!loading && filteredFAQs.length > 0 && (
                    <div className="faq-list">
                        <h2>📚 All FAQs ({filteredFAQs.length})</h2>
                        {filteredFAQs.map((faq, index) => (
                            <div key={faq.id || index} className="faq-item">
                                <div
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <h3>{faq.title}</h3>
                                    <span className={`toggle-icon ${expandedFAQs.has(index) ? 'expanded' : ''}`}>
                                        ▼
                                    </span>
                                </div>

                                {expandedFAQs.has(index) && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                        {faq.tags && (
                                            <div className="faq-tags">
                                                <strong>🏷️ Tags:</strong> {faq.tags}
                                            </div>
                                        )}
                                        {faq.id && (
                                            <div className="faq-id">
                                                <strong>🆔 ID:</strong> {faq.id}
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
