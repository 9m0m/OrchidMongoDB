import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form, Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import AdminService from '../services/adminService';
import '../styles/EmployeeManagement.css';

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setTableLoading(true);
            const response = await AdminService.getAllEmployees();
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Failed to load employees. Please try again.');
        } finally {
            setTableLoading(false);
        }
    };

    const handleClose = () => {
        setShow(false);
        setEditId(null);
        reset();
    };

    const handleShow = (employee = null) => {
        setShow(true);
        if (employee) {
            setEditId(employee.id);
            setValue('name', employee.name);
            setValue('email', employee.email);
            setValue('role', employee.role);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (editId) {
                await AdminService.updateEmployee(editId, data);
                toast.success('Employee updated successfully!');
            } else {
                await AdminService.addEmployee(data);
                toast.success('Employee added successfully!');
            }
            fetchEmployees();
            handleClose();
        } catch (error) {
            console.error('Error saving employee:', error);
            toast.error(error.response?.data?.message || 'Failed to save employee data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await AdminService.deleteEmployee(id);
                toast.success('Employee deleted successfully!');
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
                toast.error('Failed to delete employee. Please try again.');
            }
        }
    };

    return (
        <Container className="employee-management-container">
            <Toaster />
            <h2 className="floral-title mb-4">Employee Management</h2>
            <Button className="floral-button mb-3" onClick={() => handleShow()}>
                Add New Employee
            </Button>
            {tableLoading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading employees...</p>
                </div>
            ) : (
                <Table striped bordered hover className="floral-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.role}</td>
                            <td>
                                <Button
                                    variant="outline-primary"
                                    className="floral-button-outline me-2"
                                    onClick={() => handleShow(employee)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="floral-button-outline"
                                    onClick={() => handleDelete(employee.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {employees.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center">No employees found</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            )}
            <Modal show={show} onHide={handleClose} backdrop="static" className="floral-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                {...register('name', { required: 'Name is required' })}
                                className="floral-input"
                                disabled={loading}
                            />
                            {errors.name && <p className="text-warning">{errors.name.message}</p>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email format',
                                    },
                                })}
                                className="floral-input"
                                disabled={loading}
                            />
                            {errors.email && <p className="text-warning">{errors.email.message}</p>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                {...register('role', { required: 'Role is required' })}
                                className="floral-input"
                                disabled={loading}
                            >
                                <option value="">Select role</option>
                                <option value="Manager">Manager</option>
                                <option value="Florist">Florist</option>
                                <option value="Delivery">Delivery</option>
                            </Form.Select>
                            {errors.role && <p className="text-warning">{errors.role.message}</p>}
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose} className="floral-button-secondary" disabled={loading}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" className="floral-button" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        <span className="ms-2">Saving...</span>
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}