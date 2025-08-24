import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="app-layout">
            <nav className="main-navigation">
                <div className="nav-brand">
                    <h1>🤖 Nexus AI Chat</h1>
                    <p>Advanced AI Chat Platform</p>
                </div>
                <div className="nav-links">
                    <Link
                        to="/regular"
                        className={`nav-link ${location.pathname === '/regular' ? 'active' : ''}`}
                    >
                        💬 Regular Chat
                    </Link>
                    <Link
                        to="/improved"
                        className={`nav-link ${location.pathname === '/improved' ? 'active' : ''}`}
                    >
                        🚀 Advanced Chat
                    </Link>
                    <Link
                        to="/faq"
                        className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}
                    >
                        ❓ FAQ
                    </Link>
                </div>
            </nav>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
