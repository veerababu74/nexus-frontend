import React, { useState, useRef, useEffect } from 'react';
import './Chat.css'; // Use the same CSS as regular chat
import './ImprovedChat.css'; // Additional enhanced styles
import ChatHeader from '../ChatHeader/ChatHeader';
import { fetchImprovedChatResponse, clearImprovedChatSession } from '../../api/improvedChatAPI';
import { useTheme } from '../../contexts/ThemeContext';

const ImprovedChat = () => {
    const { theme } = useTheme();
    const [chatLog, setChatLog] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sessionStats, setSessionStats] = useState({
        messagesCount: 0,
        session: 'veera1234',
        index: 'veera'
    });
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatLog, loading]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = async () => {
        if (!userInput.trim() || loading) return;

        const currentMessage = userInput.trim();
        const userMessage = {
            role: 'user',
            content: currentMessage,
            timestamp: new Date().toISOString()
        };

        setChatLog(prev => [...prev, userMessage]);
        setUserInput('');
        setLoading(true);
        setError('');

        try {
            const aiResponse = await fetchImprovedChatResponse(currentMessage);

            const aiMessage = {
                role: 'ai',
                content: aiResponse.message || 'No response received',
                timestamp: new Date().toISOString(),
                responseData: aiResponse
            };

            setChatLog(prev => [...prev, aiMessage]);

            // Update session stats
            setSessionStats(prev => ({
                ...prev,
                messagesCount: prev.messagesCount + 1
            }));

        } catch (error) {
            console.error('Error fetching AI response:', error);
            setError('Failed to get AI response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = async () => {
        try {
            const success = await clearImprovedChatSession();
            if (success) {
                setChatLog([]);
                setSessionStats(prev => ({ ...prev, messagesCount: 0 }));
                setError('');
            } else {
                setError('Failed to clear chat session');
            }
        } catch (error) {
            setError('Failed to clear chat session');
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleFollowUpClick = (followUpQuestion) => {
        setUserInput(followUpQuestion);
        inputRef.current?.focus();
    };

    const handleTopicClick = (topic) => {
        setUserInput(` ${topic}`);
        inputRef.current?.focus();
    };

    const handlePromptClick = (prompt) => {
        setUserInput(prompt);
        inputRef.current?.focus();
    };

    const renderResponseDetails = (responseData) => {
        if (!responseData) return null;

        return (
            <div className="enhanced-response-details">
                {responseData.follow_up_question && (
                    <div
                        className="enhanced-follow-up"
                        onClick={() => handleFollowUpClick(responseData.follow_up_question)}
                        title="Click to ask this question"
                    >
                        <span className="follow-up-icon">💡</span>
                        <span className="follow-up-text">{responseData.follow_up_question}</span>
                        <span className="follow-up-arrow">→</span>
                    </div>
                )}

                {responseData.suggested_topics && responseData.suggested_topics.length > 0 && (
                    <div className="enhanced-topics-section">
                        <h5>🏷️ Suggested Topics</h5>
                        <div className="enhanced-topics">
                            {responseData.suggested_topics.map((topic, index) => (
                                <span
                                    key={index}
                                    className="enhanced-topic-tag"
                                    onClick={() => handleTopicClick(topic)}
                                    title={`Click to ask about: ${topic}`}
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="chat-container">
            <ChatHeader
                chatType="improved"
                sessionStats={sessionStats}
                onClearChat={clearChat}
                showClearButton={chatLog.length > 0}
            />

            <div className="chat-messages">
                {chatLog.length === 0 && !loading && (
                    <div className="welcome-screen">
                        <div className="welcome-icon">🚀</div>
                        <h2>Advanced AI Chat</h2>
                        <p>Experience the next generation of AI conversation with enhanced intelligence, context awareness, and detailed analytics!</p>
                        <div className="example-prompts">
                            <div
                                className="prompt-card"
                                onClick={() => handlePromptClick("What makes you different from other AI assistants?")}
                            >
                                "What makes you different from other AI assistants?"
                            </div>
                            <div
                                className="prompt-card"
                                onClick={() => handlePromptClick("Help me understand complex topics with context")}
                            >
                                "Help me understand complex topics with context"
                            </div>
                            <div
                                className="prompt-card"
                                onClick={() => handlePromptClick("Show me your advanced capabilities")}
                            >
                                "Show me your advanced capabilities"
                            </div>
                        </div>
                    </div>
                )}

                {chatLog.map((msg, idx) => (
                    <div key={idx} className={`message-wrapper ${msg.role}`}>
                        <div className="message-content">
                            <div className="message-header">
                                <span className="sender-name">
                                    {msg.role === 'user' ? 'You' : 'Advanced AI'}
                                </span>
                                <span className="message-time">
                                    {formatTime(msg.timestamp)}
                                </span>
                            </div>
                            <div className="message-text">
                                {msg.content}
                            </div>
                            {msg.role === 'ai' && renderResponseDetails(msg.responseData)}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message-wrapper ai">
                        <div className="message-content">
                            <div className="message-header">
                                <span className="sender-name">Advanced AI</span>
                            </div>
                            <div className="typing-indicator">
                                <span>AI is analyzing and generating response</span>
                                <div className="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <span>⚠️ {error}</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
                <div className="input-wrapper">
                    <textarea
                        ref={inputRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask anything... Experience advanced AI with context awareness and intelligent responses!"
                        rows={1}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !userInput.trim()}
                        className="send-button"
                    >
                        {loading ? '⏳' : '🚀'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImprovedChat;
