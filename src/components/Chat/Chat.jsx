import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';
import ChatHeader from '../ChatHeader/ChatHeader';
import { fetchChatResponse } from '../../api/chatAPI';
import { useTheme } from '../../contexts/ThemeContext';

const Chat = () => {
    const { theme } = useTheme();
    const [history, setHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [chatLog, setChatLog] = useState([]);
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

        const currentQuery = userInput.trim();
        setChatLog([...chatLog, { role: 'user', content: currentQuery, timestamp: new Date().toISOString() }]);
        setUserInput('');
        setLoading(true);
        setError('');

        const requestPayload = {
            "index": "veera",
            "query": currentQuery,
            "history": []
        };

        console.log('Chat component sending payload:', requestPayload);
        console.log('History state:', history);
        console.log('Stringified payload:', JSON.stringify(requestPayload));

        try {
            const aiResponse = await fetchChatResponse(requestPayload);

            setChatLog(prev => [...prev, {
                role: 'ai',
                content: aiResponse || 'No response received',
                timestamp: new Date().toISOString()
            }]);

            setHistory(prev => [...prev, { role: 'user', content: currentQuery }, { role: 'ai', content: aiResponse }]);
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

    const clearChat = () => {
        setChatLog([]);
        setHistory([]);
        setSessionStats(prev => ({ ...prev, messagesCount: 0 }));
        setError('');
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div 
            className="chat-container"
            style={{ 
                backgroundColor: theme.colors.background,
                color: theme.colors.textPrimary 
            }}
        >
            <ChatHeader
                chatType="regular"
                sessionStats={sessionStats}
                onClearChat={clearChat}
                showClearButton={chatLog.length > 0}
            />

            <div className="chat-messages">
                {chatLog.length === 0 && !loading && (
                    <div className="welcome-screen">
                        <div className="welcome-icon">💬</div>
                        <h2>AI Chat Assistant</h2>
                        <p>Ask me anything! I'm here to help you with information, questions, and conversations.</p>
                        <div className="example-prompts">
                            <div className="prompt-card" onClick={() => setUserInput("Tell me about artificial intelligence")}>
                                "Tell me about artificial intelligence"
                            </div>
                            <div className="prompt-card" onClick={() => setUserInput("How can you help me today?")}>
                                "How can you help me today?"
                            </div>
                            <div className="prompt-card" onClick={() => setUserInput("What are your capabilities?")}>
                                "What are your capabilities?"
                            </div>
                        </div>
                    </div>
                )}

                {chatLog.map((msg, idx) => (
                    <div key={idx} className={`message-wrapper ${msg.role}`}>
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
                        <div className="message-content">
                            <div className="message-header">
                                <span className="sender-name">AI Assistant</span>
                            </div>
                            <div className="typing-indicator">
                                <span>AI is thinking...</span>
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
                        placeholder="Type your message here..."
                        rows={1}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !userInput.trim()}
                        className="send-button"
                    >
                        {loading ? '⏳' : '📤'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
