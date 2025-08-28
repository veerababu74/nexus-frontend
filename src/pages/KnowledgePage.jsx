import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Knowledge from '../components/Knowledge/Knowledge';

const KnowledgePage = () => {
    const { theme } = useTheme();
    
    return (
        <div style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.textPrimary,
            minHeight: '100%'
        }}>
            <Knowledge />
        </div>
    );
};

export default KnowledgePage;
