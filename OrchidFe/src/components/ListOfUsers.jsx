import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import AdminService from '../services/adminService';
import '../styles/UserManagement.css';

export default function ListOfUsers() {
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setTableLoading(true);
            const response = await AdminService.getAllUsers();
            const sortedData = response.data.sort((a, b) => parseInt(b.accountId) - parseInt(a.accountId));
            setUsers(sortedData);
        } catch (error) {
            console.error('Error fetching users:', error);
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
            setEditId(user.accountId);
            setValue('accountName', user.accountName);
            setValue('email', user.email);
            setValue('role', user.role?.roleName || '');
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
                toast.success("User added successfully!");
            }
            handleClose();
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(editId ? "Failed to update user!" : "Failed to add user!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (accountId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
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

    return (
        <Container>
            <Toaster />
            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>User Management</h2>
                    <Button onClick={() => handleShow()} variant="primary">
                        Add New User
                    </Button>
                </div>

                {tableLoading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading users...</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Account ID</th>
                                <th>Account Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.accountId}>
                                        <td>{user.accountId}</td>
                                        <td>{user.accountName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Badge bg={getRoleBadgeVariant(user.roleName)}>
                                                {user.roleName || 'No Role'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleShow(user)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(user.accountId)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}

                {/* Add/Edit User Modal */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editId ? 'Edit User' : 'Add New User'}</Modal.Title>
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
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Invalid email format'
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
                                <Form.Select
                                    {...register('role', { required: 'Role is required' })}
                                    isInvalid={!!errors.role}
                                >
                                    <option value="">Select Role</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Superadmin</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.role?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        {editId ? 'Updating...' : 'Adding...'}
                                    </>
                                ) : (
                                    editId ? 'Update User' : 'Add User'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        </Container>
    );
}
