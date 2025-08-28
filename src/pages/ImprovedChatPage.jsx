import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ImprovedChat from '../components/Chat/ImprovedChat';

const ImprovedChatPage = () => {
    const { theme } = useTheme();
    
    return (
        <div style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.textPrimary,
            minHeight: '100%'
        }}>
            <ImprovedChat />
        </div>
    );
};

export default ImprovedChatPage;
