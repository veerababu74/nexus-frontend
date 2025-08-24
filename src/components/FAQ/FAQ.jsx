import React, { useState, useEffect } from 'react';
import './FAQ.css';
import { insertFAQ, getAllFAQs } from '../../api/faqAPI';

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        tags: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    // Load FAQs on component mount
    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        setIsLoading(true);
        try {
            const response = await getAllFAQs();
            setFaqs(response.data || []);
        } catch (error) {
            console.error('Error loading FAQs:', error);
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
            alert('Please fill in both question and answer');
            return;
        }

        setIsLoading(true);
        try {
            await insertFAQ(formData);
            setFormData({ question: '', answer: '', tags: '' });
            await loadFAQs(); // Reload FAQs after successful submission
            alert('FAQ added successfully!');
        } catch (error) {
            console.error('Error adding FAQ:', error);
            alert('Error adding FAQ. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFAQ = (index) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    // Filter FAQs based on search term
    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (faq.tags && faq.tags.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="faq-container">
            {/* Header */}
            <div className="faq-header">
                <div className="header-content">
                    <h1>❓ FAQ Manager</h1>
                </div>
                <div className="faq-actions">
                    <button
                        className="refresh-btn"
                        onClick={loadFAQs}
                        disabled={isLoading}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Add FAQ Form */}
            <div className="add-faq-section">
                <form onSubmit={handleSubmit} className="faq-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="question">Question:</label>
                            <input
                                type="text"
                                id="question"
                                name="question"
                                value={formData.question}
                                onChange={handleInputChange}
                                placeholder="Enter your question here..."
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
                                placeholder="Enter tags (separated by commas)..."
                            />
                        </div>

                        <div className="form-group form-group-full">
                            <label htmlFor="answer">Answer:</label>
                            <textarea
                                id="answer"
                                name="answer"
                                value={formData.answer}
                                onChange={handleInputChange}
                                placeholder="Enter the answer here..."
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? '⏳ Adding...' : '➕ Add FAQ'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Search Bar */}
            <div className="search-section">
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* FAQ List */}
            <div className="faq-list-section">
                <div className="section-header">
                    <h2>All FAQs ({filteredFAQs.length})</h2>
                </div>

                {isLoading && faqs.length === 0 ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading FAQs...</p>
                    </div>
                ) : filteredFAQs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">❓</div>
                        <h3>No FAQs found</h3>
                        <p>{searchTerm ? 'Try a different search term' : 'Add your first FAQ above'}</p>
                    </div>
                ) : (
                    <div className="faq-list">
                        {filteredFAQs.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <div
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <h3>{faq.question}</h3>
                                    <span className={`expand-icon ${expandedFAQ === index ? 'expanded' : ''}`}>
                                        ▼
                                    </span>
                                </div>
                                {expandedFAQ === index && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                        {faq.tags && (
                                            <div className="faq-tags">
                                                <strong>Tags:</strong> {faq.tags}
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
