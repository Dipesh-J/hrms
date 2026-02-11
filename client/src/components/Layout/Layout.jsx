import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <Header />
            <main className="main-content">
                <div className="container mt-md">
                    {children}
                </div>
            </main>
            <style>{`
        .layout {
          min-height: 100vh;
          background-color: var(--background-color);
        }
        
        .main-content {
          margin-left: 250px;
          padding: var(--spacing-lg);
          min-height: calc(100vh - 64px);
        }
      `}</style>
        </div>
    );
};

export default Layout;
