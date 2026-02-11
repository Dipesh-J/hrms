import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ onToggleSidebar }) => {
    return (
        <header className="header">
            <div className="header-left">
                <button
                    className="hamburger"
                    onClick={onToggleSidebar}
                    aria-label="Toggle navigation menu"
                >
                    <Menu size={20} />
                </button>
            </div>
            <div className="header-right">
                <span className="user-info">Admin User</span>
                <div className="avatar" aria-hidden="true">A</div>
            </div>
        </header>
    );
};

export default Header;
