import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';



const Chat = () => {
    const [history, setHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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

        const currentQuery = userInput.trim();
        setChatLog([...chatLog, { role: 'user', content: currentQuery, timestamp: new Date().toISOString() }]);
        setUserInput('');
        setLoading(true);
        setError('');

        const requestPayload = {
            request: {
                index: 'my_index',
                query: currentQuery,
                history: history
            }
        };

        try {
            const aiResponse = await fetchChatResponse(requestPayload);
            setChatLog(prev => [...prev, {
                role: 'ai',
                content: aiResponse,
                timestamp: new Date().toISOString()
            }]);
            setHistory(prev => [...prev, { human: currentQuery, ai: aiResponse }]);
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

    const clearChat = () => {
        setChatLog([]);
        setHistory([]);
        setError('');
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="chat-header">
                <div className="header-content">
                    <h1>🤖 AI Assistant</h1>
                    <p>Powered by Advanced AI</p>
                </div>
                {chatLog.length > 0 && (
                    <button className="clear-chat-btn" onClick={clearChat}>
                        🗑️ Clear
                    </button>
                )}
            </div>

            {/* Messages Container */}
            <div className="chat-messages">
                {chatLog.length === 0 && !loading && (
                    <div className="welcome-screen">
                        <div className="welcome-icon">💬</div>
                        <h2>Welcome to AI Chat</h2>
                        <p>Start a conversation with our AI assistant. Ask anything!</p>
                        <div className="example-prompts">
                            <div className="prompt-card" onClick={() => setUserInput("What can you help me with?")}>
                                "What can you help me with?"
                            </div>
                            <div className="prompt-card" onClick={() => setUserInput("Explain quantum computing")}>
                                "Explain quantum computing"
                            </div>
                            <div className="prompt-card" onClick={() => setUserInput("Write a creative story")}>
                                "Write a creative story"
                            </div>
                        </div>
                    </div>
                )}

                {chatLog.map((msg, idx) => (
                    <div key={idx} className={`message-wrapper ${msg.role}`}>
                        <div className="message-avatar">
                            {msg.role === 'user' ? (
                                <div className="user-avatar">👤</div>
                            ) : (
                                <div className="ai-avatar">🤖</div>
                            )}
                        </div>
                        <div className="message-content">
                            <div className="message-header">
                                <span className="sender-name">
                                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                </span>
                                <span className="message-time">
                                    {formatTime(msg.timestamp)}
                                </span>
                            </div>
                            <div className="message-text">
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message-wrapper ai">
                        <div className="message-avatar">
                            <div className="ai-avatar loading">🤖</div>
                        </div>
                        <div className="message-content">
                            <div className="message-header">
                                <span className="sender-name">AI Assistant</span>
                            </div>
                            <div className="typing-indicator">
                                <span>AI is thinking</span>
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

            {/* Input Container */}
            <div className="chat-input">
                <div className="input-wrapper">
                    <textarea
                        ref={inputRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
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

export default Chat;
