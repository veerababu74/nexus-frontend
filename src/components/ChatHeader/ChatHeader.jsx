import React from 'react';
import './ChatHeader.css';

const ChatHeader = ({ chatType, sessionStats, onClearChat, showClearButton }) => {
    const getChatInfo = () => {
        if (chatType === 'improved') {
            return {
                title: '🚀 Advanced AI Assistant',
                subtitle: 'Enhanced with Intelligence Analytics & Context Awareness'
            };
        } else {
            return {
                title: '🤖 AI Assistant',
                subtitle: 'Powered by Advanced AI'
            };
        }
    };

    const chatInfo = getChatInfo();

    return (
        <div className="chat-navigation-header">
            {/* Chat Header Info */}
            <div className="chat-header-info">
                <div className="header-content">
                    <h1>{chatInfo.title}</h1>
                    <p>{chatInfo.subtitle}</p>
                </div>

                {/* Session Stats */}
                <div className="session-stats">
                    <div className="stat-badge">
                        📊 {sessionStats.messagesCount} msgs
                    </div>
                    {/* Only show session ID and index for advanced chat */}
                    {chatType === 'improved' && (
                        <>
                            <div className="stat-badge">
                                🆔 {sessionStats.session}
                            </div>
                            <div className="stat-badge">
                                📚 {sessionStats.index}
                            </div>
                        </>
                    )}
                    {showClearButton && (
                        <button className="clear-chat-btn" onClick={onClearChat}>
                            🗑️ Clear
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
