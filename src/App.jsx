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
import NSXAdminPage from './pages/NSXAdminPage';
import './App.css';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Main app routes - with MainLayout */}
          <Route path="/" element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          } />
          <Route path="/home" element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          } />
          <Route path="/regular" element={
            <MainLayout>
              <RegularChatPage />
            </MainLayout>
          } />
          <Route path="/improved" element={
            <MainLayout>
              <ImprovedChatPage />
            </MainLayout>
          } />
          <Route path="/knowledge" element={
            <MainLayout>
              <KnowledgePage />
            </MainLayout>
          } />
          <Route path="/tone-safety" element={
            <MainLayout>
              <ToneSafetyPage />
            </MainLayout>
          } />
          <Route path="/settings" element={
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          } />
          <Route path="/analytics" element={
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          } />
          <Route path="/publishing" element={
            <MainLayout>
              <PublishingPage />
            </MainLayout>
          } />
          <Route path="/leads-logs" element={
            <MainLayout>
              <LeadsLogsPage />
            </MainLayout>
          } />
          <Route path="/faq" element={<Navigate to="/knowledge" replace />} />
          <Route path="/files" element={<Navigate to="/knowledge" replace />} />
          
          {/* Admin routes - standalone layout for 404/not found */}
          <Route path="*" element={<NSXAdminPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;