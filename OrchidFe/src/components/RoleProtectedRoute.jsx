import React, { useEffect, useState } from 'react';
import { Container, Alert, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AccountService from '../services/accountService';

export default function RoleProtectedRoute({ children, requiredRoles = ['Admin', 'Superadmin'] }) {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkUserRole();
    }, []);

    const checkUserRole = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setHasAccess(false);
                setLoading(false);
                return;
            }

            // Get current user info from localStorage (stored during login)
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setHasAccess(false);
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            console.log('Current user from localStorage:', user);
            console.log('User role:', user.role);

            setUserRole(user.role);

            // Check if user has required role
            const hasRequiredRole = requiredRoles.some(role =>
                user.role?.toLowerCase() === role.toLowerCase()
            );

            console.log('Required roles:', requiredRoles);
            console.log('Has required role:', hasRequiredRole);

            setHasAccess(hasRequiredRole);
        } catch (error) {
            console.error('Error checking user role:', error);
            setHasAccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Checking permissions...</p>
                </div>
            </Container>
        );
    }

    if (!hasAccess) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <Card className="text-center shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                    <Card.Body className="p-5">
                        <div className="mb-4">
                            <i className="bi bi-shield-exclamation text-danger" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h2 className="text-danger mb-3">Access Denied</h2>
                        <Alert variant="danger" className="mb-4">
                            <Alert.Heading>Unauthorized Access</Alert.Heading>
                            <p className="mb-0">
                                You don't have permission to access this page.
                                {userRole ? (
                                    <><br />Your current role: <strong>{userRole}</strong></>
                                ) : (
                                    <><br />Please log in with an administrator account.</>
                                )}
                            </p>
                        </Alert>
                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleGoHome}
                                className="mb-2"
                            >
                                <i className="bi bi-house me-2"></i>
                                Go to Home Page
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate('/login')}
                            >
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                Login with Different Account
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return children;
}
