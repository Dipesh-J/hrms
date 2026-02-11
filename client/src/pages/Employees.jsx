import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { Trash2, UserPlus, Search, AlertTriangle } from 'lucide-react';
import { DEPARTMENTS } from '../constants';
import '../styles/employees.css';

const Employees = () => {
    const { employees, loading, error, addEmployee, deleteEmployee } = useEmployees();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEmployee(formData);
            setIsModalOpen(false);
            setFormData({ employee_id: '', full_name: '', email: '', department: '' });
        } catch (err) {
            // handled by hook
        }
    };

    const handleDeleteConfirm = async () => {
        if (confirmDelete) {
            await deleteEmployee(confirmDelete._id);
            setConfirmDelete(null);
        }
    };

    const filteredEmployees = employees.filter((emp) =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-lg">
                <h2>Employees</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={16} />
                    Add Employee
                </button>
            </div>

            <div className="card mb-md">
                <div className="search-bar">
                    <Search size={18} className="search-icon" aria-hidden="true" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or department\u2026"
                        className="form-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search employees"
                        autoComplete="off"
                        spellCheck={false}
                    />
                </div>
            </div>

            {error && <div className="alert alert-danger mb-md" role="alert">{error}</div>}

            {loading && employees.length === 0 ? (
                <div className="text-center p-xl text-secondary">Loading\u2026</div>
            ) : (
                <div className="card employee-table-card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp._id}>
                                        <td>{emp.employee_id}</td>
                                        <td style={{ fontWeight: 500 }}>{emp.full_name}</td>
                                        <td>{emp.email}</td>
                                        <td>
                                            <span className="status-badge present" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-icon-danger"
                                                onClick={() => setConfirmDelete(emp)}
                                                aria-label={`Delete ${emp.full_name}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-state">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Employee Modal */}
            {isModalOpen && (
                <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-employee-title">
                    <div className="modal card">
                        <div className="modal-header">
                            <h3 id="add-employee-title">Add New Employee</h3>
                            <button
                                className="modal-close"
                                onClick={() => setIsModalOpen(false)}
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
                                    required
                                    className="form-input"
                                    value={formData.employee_id}
                                    onChange={handleInputChange}
                                    placeholder="e.g. EMP001"
                                    autoComplete="off"
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
                            <div className="flex justify-end gap-sm mt-lg">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Adding\u2026' : 'Add Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
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
