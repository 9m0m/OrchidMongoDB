import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form, Spinner, Badge, Alert } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useForm, FormProvider } from 'react-hook-form';
import AdminService from '../services/adminService';
import RoleSelect from './RoleSelect';
import '../styles/UserManagement.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setTableLoading(true);
            setError(null);
            const response = await AdminService.getAllUsers();
            let sortedData = response.data.sort((a, b) => parseInt(b.accountId) - parseInt(a.accountId));

            // Get current user's role to determine what users to show
            const currentUserStr = localStorage.getItem('user');
            const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
            const currentUserRole = currentUser?.role?.toUpperCase();

            // If current user is Admin, hide Superadmin users
            if (currentUserRole === 'ADMIN') {
                sortedData = sortedData.filter(user => user.roleName?.toUpperCase() !== 'SUPERADMIN');
            }

            setUsers(sortedData);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again.');
            toast.error('Failed to load users. Please try again.');
        } finally {
            setTableLoading(false);
        }
    };

    const handleClose = () => {
        setShow(false);
        setEditId(null);
        reset();
    };

    const handleShow = (user = null) => {
        setShow(true);
        if (user) {
            // Check if user is Superadmin - they cannot be edited
            if (user.roleName?.toUpperCase() === 'SUPERADMIN') {
                toast.error('Superadmin users cannot be edited.');
                return;
            }

            setEditId(user.accountId);
            setValue('accountName', user.accountName);
            setValue('email', user.email);
            setValue('roleId', user.roleId);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (editId) {
                await AdminService.updateUser(editId, data);
                toast.success("User updated successfully!");
            } else {
                await AdminService.createUser(data);
                toast.success("User created successfully!");
            }
            handleClose();
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(editId ? "Failed to update user!" : "Failed to create user!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (accountId) => {
        // Find the user to check if they're Superadmin
        const userToDelete = users.find(u => u.accountId === accountId);
        if (userToDelete?.roleName?.toUpperCase() === 'SUPERADMIN') {
            toast.error('Superadmin users cannot be deleted.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await AdminService.deleteUser(accountId);
                toast.success("User deleted successfully!");
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error("Failed to delete user!");
            }
        }
    };

    const getRoleBadgeVariant = (roleName) => {
        switch (roleName?.toLowerCase()) {
            case 'superadmin':
                return 'danger';
            case 'admin':
                return 'warning';
            case 'user':
                return 'primary';
            default:
                return 'secondary';
        }
    };

    if (error) {
        return (
            <Container>
                <Alert variant="danger" className="mt-3">
                    {error}
                    <div className="mt-2">
                        <Button variant="outline-danger" onClick={fetchUsers}>
                            Try Again
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Toaster />
            <div className="user-management-container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="user-management-title">User Management</h2>
                    <Button onClick={() => handleShow()} variant="primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New User
                    </Button>
                </div>

                {tableLoading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading users...</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table striped bordered hover className="user-table">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Account Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user.accountId}>
                                            <td>{index + 1}</td>
                                            <td>{user.accountName}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Badge bg={getRoleBadgeVariant(user.roleName)}>
                                                    {user.roleName || 'No Role'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleShow(user)}
                                                        title="Edit User"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(user.accountId)}
                                                        title="Delete User"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <div className="text-muted">
                                                <i className="bi bi-people fs-1 d-block mb-2"></i>
                                                No users found
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}

                {/* Add/Edit User Modal */}
                <Modal show={show} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {editId ? 'Edit User' : 'Add New User'}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Account Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('accountName', { required: 'Account name is required' })}
                                    isInvalid={!!errors.accountName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.accountName?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {!editId && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters'
                                            }
                                        })}
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <FormProvider {...{ register, formState: { errors } }}>
                                    <RoleSelect editId={editId} />
                                </FormProvider>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        {editId ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    editId ? 'Update User' : 'Create User'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        </Container>
    );
}
