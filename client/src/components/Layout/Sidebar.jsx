import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, CalendarCheck } from 'lucide-react';
import { ROUTES } from '../../constants';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <h1>HRMS Lite</h1>
      </div>
      <nav className="nav-menu">
        <NavLink
          to={ROUTES.DASHBOARD}
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to={ROUTES.EMPLOYEES}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={20} />
          <span>Employees</span>
        </NavLink>
        <NavLink
          to={ROUTES.ATTENDANCE}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <CalendarCheck size={20} />
          <span>Attendance</span>
        </NavLink>
      </nav>
      <style>{`
        .sidebar {
          width: 250px;
          background-color: var(--surface-color);
          border-right: 1px solid var(--border-color);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
        }
        
        .logo-container {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--border-color);
        }
        
        .logo-container h1 {
          font-size: var(--font-size-xl);
          color: var(--primary-color);
          font-weight: var(--font-weight-bold);
        }
        
        .nav-menu {
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: 0.75rem 1rem;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          transition: all 0.2s;
          font-weight: var(--font-weight-medium);
        }
        
        .nav-item:hover {
          background-color: var(--background-color);
          color: var(--text-primary);
        }
        
        .nav-item.active {
          background-color: #eff6ff;
          color: var(--primary-color);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
