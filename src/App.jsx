import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegularChatPage from './pages/RegularChatPage';
import ImprovedChatPage from './pages/ImprovedChatPage';
import FAQPage from './pages/FAQPage';
import FileManager from './components/FileManager/FileManager';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/regular" element={<RegularChatPage />} />
        <Route path="/improved" element={<ImprovedChatPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/files" element={<FileManager />} />
        <Route path="/" element={<Navigate to="/improved" replace />} />
      </Routes>
    </Router>
  );
};

export default App;