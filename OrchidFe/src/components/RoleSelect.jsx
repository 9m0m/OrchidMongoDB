import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import AdminService from '../services/adminService';

export default function RoleSelect({ editId }) {
    const [roles, setRoles] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const { register, formState: { errors } } = useFormContext();

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (roles.length > 0) {
            filterAvailableRoles();
        }
    }, [roles, editId]);

    const fetchRoles = async () => {
        try {
            const response = await AdminService.getAllRoles();
            setRoles(response.data || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
            // Fallback roles if API fails
            setRoles([
                { id: 1, name: 'User' },
                { id: 2, name: 'Admin' },
                { id: 3, name: 'Superadmin' }
            ]);
        }
    };

    const filterAvailableRoles = () => {
        // Get current user's role to determine what roles they can assign
        const currentUserStr = localStorage.getItem('user');
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
        const currentUserRole = currentUser?.role?.toUpperCase();

        let filtered = roles;

        // If current user is Admin, they can only assign User role
        if (currentUserRole === 'ADMIN') {
            filtered = roles.filter(role => role.name.toUpperCase() === 'USER');
        }
        // If current user is Superadmin, they can assign any role
        else if (currentUserRole === 'SUPERADMIN') {
            filtered = roles;
        }
        // Default to User role only
        else {
            filtered = roles.filter(role => role.name.toUpperCase() === 'USER');
        }

        setAvailableRoles(filtered);
    };

    // Get help text based on current user's permissions
    const getHelpText = () => {
        const currentUserStr = localStorage.getItem('user');
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
        const currentUserRole = currentUser?.role?.toUpperCase();

        if (currentUserRole === 'ADMIN') {
            if (editId) {
                return "As an Admin, you can only assign User role.";
            } else {
                return "As an Admin, you can only create User accounts.";
            }
        }
        return "";
    };

    return (
        <>
            <Form.Select
                {...register('roleId', { required: 'Role is required' })}
                isInvalid={!!errors.roleId}
            >
                <option value="">Select Role</option>
                {availableRoles.map(role => (
                    <option key={role.id} value={role.id}>
                        {role.name}
                    </option>
                ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
                {errors.roleId?.message}
            </Form.Control.Feedback>
            {getHelpText() && (
                <Form.Text className="text-muted">
                    {getHelpText()}
                </Form.Text>
            )}
        </>
    );
}
