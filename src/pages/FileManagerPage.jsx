import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import FileManager from '../components/FileManager/FileManager';

const FileManagerPage = () => {
    const { theme } = useTheme();
    
    return (
        <div style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.textPrimary,
            minHeight: '100%'
        }}>
            <FileManager />
        </div>
    );
};

export default FileManagerPage;