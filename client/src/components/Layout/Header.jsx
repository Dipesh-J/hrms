import React from 'react';

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <span className="user-info">Admin User</span>
                <div className="avatar">A</div>
            </div>
            <style>{`
        .header {
          height: 64px;
          background-color: var(--surface-color);
          border-bottom: 1px solid var(--border-color);
          width: calc(100% - 250px);
          margin-left: 250px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 var(--spacing-lg);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .user-info {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
        }
        
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-sm);
        }
      `}</style>
        </header>
    );
};

export default Header;
