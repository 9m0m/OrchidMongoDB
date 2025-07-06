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
            
            if (response.success) {
                toast.success(response.message || 'Login successful!');
                
                // Dispatch auth-change event to notify other components (like NavBar) of the authentication change
                window.dispatchEvent(new Event('auth-change'));
                
                // Get user data from localStorage (stored by accountService)
                const userStr = localStorage.getItem('user');
                let user = null;
                
                try {
                    user = userStr ? JSON.parse(userStr) : null;
                } catch (parseError) {
                    console.error('Error parsing user data:', parseError);
                }
                
                // Debug log
                console.log('Login successful - User data:', {
                    user,
                    role: user?.role,
                    isAdmin: user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin'
                });
                
                // Navigate based on role
                const isUserAdmin = user && (user.role?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'superadmin');
                navigate(isUserAdmin ? '/admin' : '/home');
            } else {
                // Handle login failure
                const errorMessage = response.message || 'Login failed. Please check your credentials.';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'An error occurred during login. Please try again.';
            
            try {
                // Try to parse the error message if it's a JSON string
                const errorData = JSON.parse(error.message);
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                // If it's not JSON, use the error message directly
                errorMessage = error.message || errorMessage;
            }
            
            toast.error(errorMessage);
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