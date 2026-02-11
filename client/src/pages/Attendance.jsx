import React, { useState, useEffect } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useEmployees } from '../hooks/useEmployees';
import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle } from 'lucide-react';
import { ATTENDANCE_STATUSES, SUCCESS_DISMISS_MS } from '../constants';
import '../styles/attendance.css';

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Attendance = () => {
    const { employees } = useEmployees();
    const { attendanceRecords, loading, error, fetchAttendance, markAttendance } = useAttendance();
    const { success, error: toastError } = useToast();

    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [date, setDate] = useState(getTodayDateString);
    const [status, setStatus] = useState(ATTENDANCE_STATUSES.PRESENT);
    const [viewEmployeeId, setViewEmployeeId] = useState('');


    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        try {
            await markAttendance({
                employee_id: selectedEmployeeId,
                date: date,
                status: status
            });
            success('Attendance marked successfully!');
            if (viewEmployeeId === selectedEmployeeId) {
                fetchAttendance(selectedEmployeeId);
            }
        } catch (err) {
            toastError(err.response?.data?.detail || 'Failed to mark attendance');
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

            <div className="attendance-grid mt-lg">
                <div className="card">
                    <h3>Mark Attendance</h3>
                    <form onSubmit={handleMarkAttendance} className="mt-md">
                        <div className="form-group">
                            <label className="form-label" htmlFor="mark-employee">Employee</label>
                            <select
                                id="mark-employee"
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
                            <label className="form-label" htmlFor="mark-date">Date</label>
                            <input
                                type="date"
                                id="mark-date"
                                className="form-input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                max={getTodayDateString()}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="mark-status">Status</label>
                            <select
                                id="mark-status"
                                className="form-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value={ATTENDANCE_STATUSES.PRESENT}>{ATTENDANCE_STATUSES.PRESENT}</option>
                                <option value={ATTENDANCE_STATUSES.ABSENT}>{ATTENDANCE_STATUSES.ABSENT}</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={loading || !selectedEmployeeId}>
                            {loading ? 'Marking\u2026' : 'Mark Attendance'}
                        </button>


                        {error && (
                            <div className="alert alert-danger mt-md" role="alert">
                                <XCircle size={16} aria-hidden="true" />
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                <div className="card">
                    <h3>View Records</h3>
                    <div className="form-group mt-md">
                        <label className="form-label" htmlFor="view-employee">Select Employee to View</label>
                        <select
                            id="view-employee"
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

                    <div className="mt-md">
                        {viewEmployeeId ? (
                            loading ? (
                                <p className="attendance-records-empty">Loading records\u2026</p>
                            ) : (
                                attendanceRecords.length > 0 ? (
                                    <div className="attendance-table-wrap">
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
                                                                {record.status === ATTENDANCE_STATUSES.PRESENT
                                                                    ? <CheckCircle size={14} aria-hidden="true" />
                                                                    : <XCircle size={14} aria-hidden="true" />
                                                                }
                                                                {record.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="attendance-records-empty">No records found.</p>
                                )
                            )
                        ) : (
                            <p className="attendance-records-empty">Select an employee to view records.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
