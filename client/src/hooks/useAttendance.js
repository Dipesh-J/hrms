import { useState, useCallback } from 'react';
import api from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants';

export const useAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAttendance = useCallback(async (employeeId) => {
        if (!employeeId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`${API_ENDPOINTS.ATTENDANCE}${employeeId}`);
            setAttendanceRecords(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    }, []);

    const markAttendance = async (attendanceData) => {
        setLoading(true);
        setError(null);
        try {
            const formattedDate = new Date(attendanceData.date).toISOString().split('T')[0];
            const response = await api.post(API_ENDPOINTS.ATTENDANCE, {
                ...attendanceData,
                date: formattedDate
            });
            setAttendanceRecords((prev) => [response.data, ...prev]);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to mark attendance');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { attendanceRecords, loading, error, fetchAttendance, markAttendance };
};
