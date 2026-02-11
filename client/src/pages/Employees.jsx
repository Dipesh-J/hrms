import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { Trash2, UserPlus, Search } from 'lucide-react';
import { DEPARTMENTS } from '../constants';

const Employees = () => {
    const { employees, loading, error, addEmployee, deleteEmployee } = useEmployees();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredEmployees = employees.filter((emp) =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-md">
                <h2>Employees</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={16} />
                    Add Employee
                </button>
            </div>

            <div className="card mb-md">
                <div className="flex items-center gap-md">
                    <Search size={20} className="text-secondary" />
                    <input
                        type="text"
                        placeholder="Search by name, ID or department"
                        className="form-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none' }}
                    />
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading && employees.length === 0 ? (
                <div className="text-center p-xl">Loading...</div>
            ) : (
                <div className="card table-container">
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
                                        <td>{emp.full_name}</td>
                                        <td>{emp.email}</td>
                                        <td>{emp.department}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this employee?')) {
                                                        deleteEmployee(emp._id)
                                                    }
                                                }}
                                                style={{ padding: '0.25rem 0.5rem' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-lg">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal card">
                        <div className="modal-header">
                            <h3>Add New Employee</h3>
                            <button onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Employee ID</label>
                                <input
                                    type="text"
                                    name="employee_id"
                                    required
                                    className="form-input"
                                    value={formData.employee_id}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    className="form-input"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
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
                            <div className="flex justify-end gap-md mt-md">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Adding...' : 'Add Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <style>{`
            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }
            .modal {
              width: 100%;
              max-width: 500px;
              max-height: 90vh;
              overflow-y: auto;
            }
            .modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: var(--spacing-lg);
            }
            .modal-header button {
              font-size: 1.5rem;
              line-height: 1;
              color: var(--text-secondary);
            }
          `}</style>
                </div>
            )}
        </div>
    );
};

export default Employees;
