import React, { useState, useEffect } from 'react';
import { Container, Card, Tabs, Tab, Row, Col, Alert, Spinner } from 'react-bootstrap';
import ListOfOrchids from './ListOfOrchids';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import RoleProtectedRoute from './RoleProtectedRoute';
import AdminService from '../services/adminService';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
    const [key, setKey] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await AdminService.getDashboardStats();
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('Failed to load dashboard statistics. Please try again later.');
            toast.error('Error loading dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const renderDashboardStats = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading dashboard data...</p>
                </div>
            );
        }

        if (error) {
            return <Alert variant="danger">{error}</Alert>;
        }

        if (!stats) {
            return <Alert variant="info">No dashboard data available.</Alert>;
        }

        return (
            <Row className="dashboard-stats">
                <Col md={4}>
                    <Card className="stat-card mb-4 shadow">
                        <Card.Body>
                            <Card.Title>Total Orchids</Card.Title>
                            <div className="stat-value">{stats.totalOrchids || 0}</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="stat-card mb-4 shadow">
                        <Card.Body>
                            <Card.Title>Total Orders</Card.Title>
                            <div className="stat-value">{stats.totalOrders || 0}</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="stat-card mb-4 shadow">
                        <Card.Body>
                            <Card.Title>Total Users</Card.Title>
                            <div className="stat-value">{stats.totalUsers || 0}</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    };

    return (
        <RoleProtectedRoute requiredRoles={['Admin', 'Superadmin']}>
            <Container className="floral-container">
                <Toaster />
                <Card className="floral-card shadow-lg">
                    <Card.Body>
                        <h2 className="floral-title mb-4">Admin Dashboard</h2>
                        <Tabs
                            id="admin-tabs"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="floral-tabs mb-3"
                        >
                            <Tab eventKey="dashboard" title="Dashboard Overview">
                                {renderDashboardStats()}
                            </Tab>
                            <Tab eventKey="orchids" title="Orchid Management">
                                <ListOfOrchids />
                            </Tab>
                            <Tab eventKey="users" title="User Management">
                                <UserManagement />
                            </Tab>
                            <Tab eventKey="orders" title="Order Management">
                                <OrderManagement />
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Container>
        </RoleProtectedRoute>
    );
}