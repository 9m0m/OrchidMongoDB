import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/orderService';
import '../styles/Order.css';

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if user is authenticated
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found in localStorage');
                toast.error('Please log in to view your orders');
                navigate('/login');
                return;
            }

            console.log('Token found, making API request to get user orders');
            const response = await OrderService.getOrdersByUser();
            console.log('User orders:', response.data);
            setOrders(response.data || []);
        } catch (error) {
            console.error('Error fetching user orders:', error);

            // Log detailed error information
            console.log('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                message: error.message,
                responseData: error.response?.data,
                url: error.config?.url
            });

            if (error.response?.status === 401) {
                console.log('401 Unauthorized - Checking if this is a token issue or missing endpoint');

                // Don't immediately remove token - could be other issues like missing endpoint
                // Only remove token if we're sure it's expired/invalid
                if (error.response?.data?.message?.includes('expired') ||
                    error.response?.data?.message?.includes('invalid token')) {
                    console.log('Token is actually expired/invalid, removing it');
                    toast.error('Your session has expired. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    console.log('401 error but might not be token-related. Endpoint might be missing or misconfigured.');
                    setError('Unable to load orders. There might be a server configuration issue. Please try again later or contact support.');
                    toast.error('Unable to load orders - server issue');
                }
            } else if (error.response?.status === 403) {
                console.log('403 Forbidden - Access denied');
                toast.error('Access denied. Please check your permissions.');
                setError('You do not have permission to view orders.');
            } else if (error.response?.status === 404) {
                console.log('404 Not Found - Endpoint might not exist');
                setError('Orders service is currently unavailable. Please try again later.');
                toast.error('Orders service unavailable');
            } else {
                setError('Failed to load your orders. Please try again later.');
                toast.error('Error loading orders');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'warning';
            case 'confirmed':
                return 'info';
            case 'shipped':
                return 'primary';
            case 'delivered':
                return 'success';
            case 'cancelled':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateOrderTotal = (order) => {
        if (order.totalAmount) return order.totalAmount;
        if (order.items && order.items.length > 0) {
            return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
        return 0;
    };

    if (loading) {
        return (
            <Container className="order-container text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading your orders...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="order-container">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="order-container">
            <Toaster />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="floral-title">Your Orders</h2>
                <Button
                    className="floral-button"
                    onClick={() => navigate('/shop')}
                >
                    Continue Shopping
                </Button>
            </div>

            {orders.length === 0 ? (
                <Card className="text-center py-5 floral-card">
                    <Card.Body>
                        <h5>No orders found</h5>
                        <p className="text-muted">You haven't placed any orders yet.</p>
                        <Button
                            className="floral-button mt-3"
                            onClick={() => navigate('/shop')}
                        >
                            Start Shopping
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <Card key={order.id || order.orderId} className="mb-4 floral-card">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Order #{order.id || order.orderId}</strong>
                                    <small className="text-muted ms-2">
                                        Placed on {formatDate(order.orderDate)}
                                    </small>
                                </div>
                                <Badge bg={getStatusBadgeVariant(order.orderStatus)}>
                                    {order.orderStatus || 'Pending'}
                                </Badge>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-md-12">
                                        <p><strong>Order Items:</strong></p>
                                        {order.orderDetails && order.orderDetails.length > 0 ? (
                                            <ul className="list-unstyled">
                                                {order.orderDetails.map((item, index) => (
                                                    <li key={index} className="mb-1">
                                                        <small>
                                                            {item.orchidName || `Orchid #${item.orchidId}`}
                                                            <span className="text-muted"> x{item.quantity}</span>
                                                            <span className="text-muted"> - ${(item.price * item.quantity).toFixed(2)}</span>
                                                        </small>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted">No items available</p>
                                        )}
                                        <hr />
                                        <p><strong>Total: ${calculateOrderTotal(order).toFixed(2)}</strong></p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
}