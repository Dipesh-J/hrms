import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, CalendarCheck, LayoutDashboard } from 'lucide-react';
import { ROUTES } from '../../constants';

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon" aria-hidden="true">
                    <LayoutDashboard size={18} />
                </div>
                <h1>HRMS <span>Lite</span></h1>
            </div>
            <nav className="nav-menu" aria-label="Main navigation">
                <NavLink
                    to={ROUTES.DASHBOARD}
                    end
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                >
                    <Home size={18} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink
                    to={ROUTES.EMPLOYEES}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                >
                    <Users size={18} />
                    <span>Employees</span>
                </NavLink>
                <NavLink
                    to={ROUTES.ATTENDANCE}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                >
                    <CalendarCheck size={18} />
                    <span>Attendance</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
