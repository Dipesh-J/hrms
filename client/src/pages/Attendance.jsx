import React, { useState, useEffect } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useEmployees } from '../hooks/useEmployees';
import { CheckCircle, XCircle } from 'lucide-react';
import { ATTENDANCE_STATUSES, SUCCESS_DISMISS_MS } from '../constants';

const Attendance = () => {
    const { employees } = useEmployees();
    const { attendanceRecords, loading, error, fetchAttendance, markAttendance } = useAttendance();

    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState(ATTENDANCE_STATUSES.PRESENT);
    const [viewEmployeeId, setViewEmployeeId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), SUCCESS_DISMISS_MS);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        try {
            await markAttendance({
                employee_id: selectedEmployeeId,
                date: date,
                status: status
            });
            setSuccessMessage('Attendance marked successfully!');
            if (viewEmployeeId === selectedEmployeeId) {
                fetchAttendance(selectedEmployeeId);
            }
        } catch (err) {
            // handled by hook
        }
    };

    useEffect(() => {
        if (viewEmployeeId) {
            fetchAttendance(viewEmployeeId);
        }
    }, [viewEmployeeId, fetchAttendance]);

    return (
        <div>
            <h2>Attendance Management</h2>

            <div className="grid-layout mt-md">
                <div className="card">
                    <h3>Mark Attendance</h3>
                    <form onSubmit={handleMarkAttendance} className="mt-md">
                        <div className="form-group">
                            <label className="form-label">Employee</label>
                            <select
                                className="form-select"
                                value={selectedEmployeeId}
                                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp.employee_id}>
                                        {emp.full_name} ({emp.employee_id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value={ATTENDANCE_STATUSES.PRESENT}>{ATTENDANCE_STATUSES.PRESENT}</option>
                                <option value={ATTENDANCE_STATUSES.ABSENT}>{ATTENDANCE_STATUSES.ABSENT}</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={loading || !selectedEmployeeId}>
                            {loading ? 'Marking...' : 'Mark Attendance'}
                        </button>

                        {successMessage && <div className="alert alert-success mt-md">{successMessage}</div>}
                        {error && <div className="alert alert-danger mt-md">{error}</div>}
                    </form>
                </div>

                <div className="card">
                    <h3>View Records</h3>
                    <div className="form-group mt-md">
                        <label className="form-label">Select Employee to View</label>
                        <select
                            className="form-select"
                            value={viewEmployeeId}
                            onChange={(e) => setViewEmployeeId(e.target.value)}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp.employee_id}>
                                    {emp.full_name} ({emp.employee_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="attendance-list mt-md">
                        {viewEmployeeId ? (
                            loading ? <p>Loading records...</p> : (
                                attendanceRecords.length > 0 ? (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceRecords.map((record) => (
                                                <tr key={record._id}>
                                                    <td>{record.date}</td>
                                                    <td>
                                                        <span className={`status-badge ${record.status.toLowerCase()}`}>
                                                            {record.status === ATTENDANCE_STATUSES.PRESENT ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                            {record.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : <p className="text-secondary text-center p-md">No records found.</p>
                            )
                        ) : (
                            <p className="text-secondary text-center p-md">Select an employee to view records.</p>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
        }
        
        .w-full { width: 100%; }
        
        .alert {
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-md);
            font-size: var(--font-size-sm);
        }
        .alert-danger {
            background-color: #fef2f2;
            color: var(--danger-color);
            border: 1px solid #fee2e2;
        }
        .alert-success {
            background-color: #f0fdf4;
            color: var(--success-color);
            border: 1px solid #dcfce7;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .status-badge.present {
            background-color: #dcfce7;
            color: var(--success-color);
        }
        
        .status-badge.absent {
            background-color: #fee2e2;
            color: var(--danger-color);
        }
        
        @media (max-width: 768px) {
            .grid-layout {
                grid-template-columns: 1fr;
            }
        }
      `}</style>
        </div>
    );
};

export default Attendance;
