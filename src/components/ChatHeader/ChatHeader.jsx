import React from 'react';
import './ChatHeader.css';

const ChatHeader = ({ chatType, sessionStats, onClearChat, showClearButton }) => {
    const getChatInfo = () => {
        if (chatType === 'improved') {
            return {
                title: '🚀 Advanced AI Assistant',
                subtitle: '' // Removed subtitle
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
                    {chatInfo.subtitle && <p>{chatInfo.subtitle}</p>}
                </div>

                {/* Session Stats - Only show clear button if available */}
                <div className="session-stats">
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
