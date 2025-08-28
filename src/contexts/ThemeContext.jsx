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
      // Facebook Dark Theme
      background: '#18191A',
      surface: '#242526', 
      primary: '#1877F2',
      secondary: '#42B883',
      onPrimary: '#FFFFFF',
      textPrimary: '#E4E6EA',
      textSecondary: '#B0B3B8',
      border: '#3A3B3C',
      accent: '#E7F3FF',
      hover: '#303031'
    } : {
      // Facebook Light Theme  
      background: '#FFFFFF',
      surface: '#F0F2F5',
      primary: '#1877F2',
      secondary: '#42B883',
      onPrimary: '#FFFFFF',
      textPrimary: '#1C1E21',
      textSecondary: '#65676B',
      border: '#DADDE1',
      accent: '#E7F3FF',
      hover: '#F2F3F5'
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
