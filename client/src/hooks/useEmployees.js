import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants';

export const useEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(API_ENDPOINTS.EMPLOYEES);
            setEmployees(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch employees');
        } finally {
            setLoading(false);
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
            setError(err.response?.data?.detail || 'Failed to add employee');
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

    return { employees, loading, error, addEmployee, deleteEmployee, refetch: fetchEmployees };
};
