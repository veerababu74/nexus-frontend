import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/HomePage';
import RegularChatPage from './pages/RegularChatPage';
import ImprovedChatPage from './pages/ImprovedChatPage';
import KnowledgePage from './pages/KnowledgePage';
import ToneSafetyPage from './pages/ToneSafetyPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PublishingPage from './pages/PublishingPage';
import LeadsLogsPage from './pages/LeadsLogsPage';
import './App.css';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/regular" element={<RegularChatPage />} />
            <Route path="/improved" element={<ImprovedChatPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/tone-safety" element={<ToneSafetyPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/publishing" element={<PublishingPage />} />
            <Route path="/leads-logs" element={<LeadsLogsPage />} />
            <Route path="/faq" element={<Navigate to="/knowledge" replace />} />
            <Route path="/files" element={<Navigate to="/knowledge" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;