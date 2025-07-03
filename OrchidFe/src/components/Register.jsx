import React, { useState } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AccountService from '../services/accountService';
import '../styles/Register.css';

export default function Register() {
    const [accountName, setAccountName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);
            // Include all required fields: accountName, email, password, confirmPassword, and roleId (default to 2 for regular users)
            await AccountService.register({
                accountName,
                email,
                password,
                confirmPassword,
                roleId: 3 // Assuming roleId 2 is for regular users
            });
            toast.success('Registration successful! Please login.');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response?.status === 409) {
                toast.error('Email already registered.');
            } else {
                toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="register-container">
            <Toaster />
            <Card className="register-card shadow-lg">
                <Card.Body>
                    <h2 className="floral-title mb-4">Join Orchid Haven</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formAccountName">
                            <Form.Label>Account Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter account name"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                required
                                className="floral-input"
                                disabled={loading}
                                minLength={3}
                                maxLength={30}
                            />
                            <Form.Text className="text-muted">
                                Choose an account name between 3-30 characters.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="floral-input"
                                disabled={loading}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="floral-input"
                                disabled={loading}
                                minLength={6}
                            />
                            <Form.Text className="text-muted">
                                Password must be at least 6 characters.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="floral-input"
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 floral-button" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    <span className="ms-2">Registering...</span>
                                </>
                            ) : (
                                'Register'
                            )}
                        </Button>
                    </Form>
                    <p className="mt-3 text-center">
                        Already have an account? <Link to="/login" className="floral-link">Login</Link>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
}