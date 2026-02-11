import React, { useState, useEffect } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useToast } from '../context/ToastContext';
import { Trash2, UserPlus, Search, AlertTriangle, XCircle } from 'lucide-react';
import { DEPARTMENTS } from '../constants';
import '../styles/employees.css';

const Employees = () => {
    const { employees, loading, error, nextId, addEmployee, deleteEmployee, fetchNextId, refetch: fetchEmployees } = useEmployees();
    const { success, error: toastError } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [formError, setFormError] = useState('');

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        department: '',
    });

    const toggleShowAll = () => {
        setShowAll((prev) => !prev);
    };

    useEffect(() => {
        fetchEmployees(showAll);
    }, [showAll, fetchEmployees]);

    const openModal = () => {
        setFormError('');
        setFormData({ full_name: '', email: '', department: '' });
        fetchNextId();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setFormError('');
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await addEmployee(formData);
            success('Employee added successfully');
            closeModal();
        } catch (err) {
            const message = err.response?.data?.detail || 'Failed to add employee';
            setFormError(typeof message === 'object' ? JSON.stringify(message) : message);
        }
    };

    const handleDeleteConfirm = async () => {
        if (confirmDelete) {
            try {
                await deleteEmployee(confirmDelete._id);
                success('Employee deleted successfully');
                setConfirmDelete(null);
            } catch (err) {
                toastError('Failed to delete employee');
            }
        }
    };

    const filteredEmployees = employees.filter((emp) =>
        (emp.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.department || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderError = (err) => {
        if (!err) return null;
        return typeof err === 'object' ? JSON.stringify(err) : err;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-lg">
                <h2>Employees</h2>
                <button className="btn btn-primary" onClick={openModal}>
                    <UserPlus size={16} />
                    Add Employee
                </button>
            </div>

            <div className="card mb-md flex justify-between items-center header-controls-card">
                <div className="search-bar">
                    <Search size={16} className="search-icon" aria-hidden="true" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or department…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search employees"
                        autoComplete="off"
                        spellCheck={false}
                    />
                </div>

                <label className="toggle-switch-container">
                    <input
                        type="checkbox"
                        className="toggle-input"
                        checked={showAll}
                        onChange={toggleShowAll}
                    />
                    <span className="toggle-switch"></span>
                    <span>Show All</span>
                </label>
            </div>

            {error && <div className="alert alert-danger mb-md" role="alert">{renderError(error)}</div>}

            {loading && employees.length === 0 ? (
                <div className="text-center p-xl text-secondary">Loading…</div>
            ) : (
                <div className="card employee-table-card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp._id} className={emp.is_deleted ? 'row-deleted' : ''}>
                                        <td>{emp.employee_id}</td>
                                        <td style={{ fontWeight: 500 }}>{emp.full_name}</td>
                                        <td>{emp.email}</td>
                                        <td>
                                            <span className="status-badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${emp.is_deleted ? 'deleted' : 'active'}`}>
                                                {emp.is_deleted ? 'Deleted' : 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-icon-danger"
                                                onClick={() => setConfirmDelete(emp)}
                                                aria-label={`Delete ${emp.full_name}`}
                                                disabled={emp.is_deleted}
                                                style={emp.is_deleted ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-employee-title">
                    <div className="modal card">
                        <div className="modal-header">
                            <h3 id="add-employee-title">Add New Employee</h3>
                            <button
                                className="modal-close"
                                onClick={closeModal}
                                aria-label="Close dialog"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="employee_id">Employee ID</label>
                                <input
                                    type="text"
                                    id="employee_id"
                                    name="employee_id"
                                    className="form-input"
                                    value={nextId || 'Loading…'}
                                    readOnly
                                    aria-readonly="true"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="full_name">Full Name</label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    required
                                    className="form-input"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. John Doe"
                                    autoComplete="name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="e.g. john@company.com"
                                    autoComplete="email"
                                    spellCheck={false}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="department">Department</label>
                                <select
                                    id="department"
                                    name="department"
                                    required
                                    className="form-select"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Department</option>
                                    {DEPARTMENTS.map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            {formError && (
                                <div className="alert alert-danger" role="alert">
                                    <XCircle size={16} aria-hidden="true" />
                                    {renderError(formError)}
                                </div>
                            )}

                            <div className="flex justify-end gap-sm mt-lg">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Adding…' : 'Add Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title">
                    <div className="modal card confirm-modal">
                        <div className="modal-icon danger" aria-hidden="true">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 id="confirm-delete-title">Delete Employee</h3>
                        <p>
                            Are you sure you want to delete <strong>{confirmDelete.full_name}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="confirm-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setConfirmDelete(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
