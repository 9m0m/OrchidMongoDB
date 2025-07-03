import React, { useState } from 'react';
        import { Container, Form, Button, Card } from 'react-bootstrap';
        import { useNavigate, Link } from 'react-router-dom';
        import toast, { Toaster } from 'react-hot-toast';
        import '../styles/Login.css';
        import AccountService from '../services/accountService';

        export default function Login() {
            const [email, setEmail] = useState('');
            const [password, setPassword] = useState('');
            const [loading, setLoading] = useState(false);
            const navigate = useNavigate();

            const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                    const response = await AccountService.login({ email, password });
                    toast.success(response.message || 'Login successful!');

                    // Dispatch auth-change event to notify other components (like NavBar) of the authentication change
                    window.dispatchEvent(new Event('auth-change'));

                    // Get user from localStorage since accountService stored it there
                    const userStr = localStorage.getItem('user');
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        // Navigate based on role
                        navigate(user.role === 'ADMIN' || user.role === 'SUPERADMIN' ? '/admin' : '/home');
                    } else {
                        // Fallback to home if user data isn't available
                        navigate('/home');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    toast.error(error.response?.data?.message || 'Invalid email or password.');
                } finally {
                    setLoading(false);
                }
            };

            return (
                <Container className="login-container">
                    <Toaster />
                    <Card className="login-card shadow-lg">
                        <Card.Body>
                            <h2 className="floral-title mb-4">Login to Orchid Haven</h2>
                            <Form onSubmit={handleSubmit}>
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
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 floral-button" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </Form>
                            <p className="mt-3 text-center">
                                Don&apos;t have an account? <Link to="/register" className="floral-link">Register</Link>
                            </p>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }