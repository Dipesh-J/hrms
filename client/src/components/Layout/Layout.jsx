import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../styles/layout.css';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    return (
        <div className="layout">
            <a href="#main-content" className="skip-link">
                Skip to Main Content
            </a>
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={closeSidebar}
                aria-hidden="true"
            />
            <Header onToggleSidebar={toggleSidebar} />
            <main className="main-content" id="main-content">
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
