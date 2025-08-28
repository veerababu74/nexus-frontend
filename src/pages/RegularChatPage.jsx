import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Chat from '../components/Chat/Chat';

const RegularChatPage = () => {
    const { theme } = useTheme();
    
    return (
        <div style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.textPrimary,
            minHeight: '100%'
        }}>
            <Chat />
        </div>
    );
};

export default RegularChatPage;
