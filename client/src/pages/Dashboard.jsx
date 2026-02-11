import React, { useState, useEffect } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { Users, UserCheck, UserX } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import api from '../api/axiosInstance';
import { ROUTES, API_ENDPOINTS } from '../constants';
import '../styles/dashboard.css';

const Dashboard = () => {
    const { employees, loading } = useEmployees();
    const [todaySummary, setTodaySummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get(API_ENDPOINTS.ATTENDANCE_SUMMARY_TODAY);
                setTodaySummary(response.data);
            } catch (err) {
                console.error('Failed to fetch today summary:', err);
            }
        };
        fetchSummary();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <div className="dashboard-grid mt-lg">
                <div className="card overview-card">
                    <div className="icon-wrapper blue" aria-hidden="true">
                        <Users size={22} />
                    </div>
                    <div>
                        <p className="card-label">Total Employees</p>
                        <p className="card-number">{loading ? '\u2026' : employees.length}</p>
                    </div>
                </div>

                <div className="card overview-card">
                    <div className="icon-wrapper green" aria-hidden="true">
                        <UserCheck size={22} />
                    </div>
                    <div>
                        <p className="card-label">Present Today</p>
                        <p className="card-number">{todaySummary ? todaySummary.present : '\u2026'}</p>
                    </div>
                </div>

                <div className="card overview-card">
                    <div className="icon-wrapper red" aria-hidden="true">
                        <UserX size={22} />
                    </div>
                    <div>
                        <p className="card-label">Absent Today</p>
                        <p className="card-number">{todaySummary ? todaySummary.absent : '\u2026'}</p>
                    </div>
                </div>
            </div>

            <div className="mt-xl">
                <h3>Quick Actions</h3>
                <div className="quick-actions-grid mt-md">
                    <NavLink to={ROUTES.EMPLOYEES} className="card quick-action">
                        <div className="quick-action-icon" aria-hidden="true">
                            <Users size={18} />
                        </div>
                        <span>Manage Employees</span>
                    </NavLink>
                    <NavLink to={ROUTES.ATTENDANCE} className="card quick-action">
                        <div className="quick-action-icon" aria-hidden="true">
                            <UserCheck size={18} />
                        </div>
                        <span>Mark Attendance</span>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
