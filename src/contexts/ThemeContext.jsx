import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    colors: isDarkMode ? {
      // Apple Dark Theme
      background: '#1d1d1f',
      surface: '#2c2c2e', 
      primary: '#0066cc',
      secondary: '#0066cc',
      onPrimary: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#a1a1a6',
      border: '#38383a',
      accent: '#e6f3ff',
      hover: '#38383a'
    } : {
      // Apple Light Theme  
      background: '#ffffff',
      surface: '#f5f5f7',
      primary: '#0066cc',
      secondary: '#0066cc',
      onPrimary: '#ffffff',
      textPrimary: '#1d1d1f',
      textSecondary: '#6e6e73',
      border: '#d2d2d7',
      accent: '#e6f3ff',
      hover: '#f5f5f7'
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
