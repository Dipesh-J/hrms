import React, { useState, useEffect } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { Users, UserCheck, UserX } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import api from '../api/axiosInstance';
import { ROUTES, API_ENDPOINTS } from '../constants';

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
            <div className="dashboard-grid mt-md">
                <div className="card overview-card">
                    <div className="icon-wrapper blue">
                        <Users size={24} />
                    </div>
                    <div className="content">
                        <h3>Total Employees</h3>
                        <p className="number">{loading ? '...' : employees.length}</p>
                    </div>
                </div>

                <div className="card overview-card">
                    <div className="icon-wrapper green">
                        <UserCheck size={24} />
                    </div>
                    <div className="content">
                        <h3>Present Today</h3>
                        <p className="number">{todaySummary ? todaySummary.present : '...'}</p>
                    </div>
                </div>

                <div className="card overview-card">
                    <div className="icon-wrapper red">
                        <UserX size={24} />
                    </div>
                    <div className="content">
                        <h3>Absent Today</h3>
                        <p className="number">{todaySummary ? todaySummary.absent : '...'}</p>
                    </div>
                </div>
            </div>

            <div className="mt-xl">
                <h3>Quick Actions</h3>
                <div className="flex gap-md mt-md">
                    <NavLink to={ROUTES.EMPLOYEES} className="card quick-action">
                        <Users size={20} />
                        <span>Manage Employees</span>
                    </NavLink>
                    <NavLink to={ROUTES.ATTENDANCE} className="card quick-action">
                        <UserCheck size={20} />
                        <span>Mark Attendance</span>
                    </NavLink>
                </div>
            </div>

            <style>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-lg);
                }
                
                .overview-card {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-lg);
                }
                
                .icon-wrapper {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }
                
                .icon-wrapper.blue { background-color: var(--primary-color); }
                .icon-wrapper.green { background-color: var(--success-color); }
                .icon-wrapper.red { background-color: var(--danger-color); }
                
                .content h3 {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    font-weight: var(--font-weight-normal);
                }
                
                .content .number {
                    font-size: 2rem;
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    line-height: 1.2;
                }
                
                .quick-action {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-md);
                    width: 150px;
                    height: 120px;
                    text-decoration: none;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .quick-action:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                }
                
                .mt-xl { margin-top: var(--spacing-xl); }
            `}</style>
        </div>
    );
};

export default Dashboard;
