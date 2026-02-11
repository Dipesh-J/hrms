import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants';

export const useEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextId, setNextId] = useState('');

    const fetchEmployees = useCallback(async (showDeleted = false) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(API_ENDPOINTS.EMPLOYEES, {
                params: { show_deleted: showDeleted }
            });
            setEmployees(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchNextId = useCallback(async () => {
        try {
            const response = await api.get(API_ENDPOINTS.EMPLOYEES_NEXT_ID);
            setNextId(response.data.next_employee_id);
        } catch (err) {
            console.error('Failed to fetch next ID:', err);
        }
    }, []);

    const addEmployee = async (employeeData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(API_ENDPOINTS.EMPLOYEES, employeeData);
            setEmployees((prev) => [...prev, response.data]);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.detail || 'Failed to add employee';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`${API_ENDPOINTS.EMPLOYEES}${id}`);
            setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to delete employee');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    return { employees, loading, error, nextId, addEmployee, deleteEmployee, fetchNextId, refetch: fetchEmployees };
};
