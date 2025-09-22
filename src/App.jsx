import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { msalConfig } from './authConfig';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
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
import LoginPage from './pages/LoginPage';
import './App.css';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const App = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes - redirect to /home if accessing root */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              
              {/* Main app routes - with MainLayout and protection */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/regular" element={
                <ProtectedRoute>
                  <MainLayout>
                    <RegularChatPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/improved" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ImprovedChatPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/knowledge" element={
                <ProtectedRoute>
                  <MainLayout>
                    <KnowledgePage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/tone-safety" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ToneSafetyPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <MainLayout>
                    <AnalyticsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/publishing" element={
                <ProtectedRoute>
                  <MainLayout>
                    <PublishingPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/leads-logs" element={
                <ProtectedRoute>
                  <MainLayout>
                    <LeadsLogsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Legacy route redirects */}
              <Route path="/faq" element={<Navigate to="/knowledge" replace />} />
              <Route path="/files" element={<Navigate to="/knowledge" replace />} />
              
              {/* Admin routes - standalone layout for 404/not found */}
              <Route path="*" element={
                <ProtectedRoute>
                  <NSXAdminPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </MsalProvider>
  );
};

export default App;