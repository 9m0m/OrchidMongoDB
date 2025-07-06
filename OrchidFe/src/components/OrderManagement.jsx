import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form, Spinner, Badge, Alert, Row, Col, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import AdminService from '../services/adminService';
import '../styles/OrderManagement.css';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, statusFilter]);

    const fetchOrders = async () => {
        try {
            setTableLoading(true);
            setError(null);
            const response = await AdminService.getAllOrders();
            const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setOrders(sortedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders. Please try again.');
            toast.error('Failed to load orders. Please try again.');
        } finally {
            setTableLoading(false);
        }
    };

    const filterOrders = () => {
        if (statusFilter === 'all') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order =>
                order.orderStatus?.toLowerCase() === statusFilter.toLowerCase()
            );
            setFilteredOrders(filtered);
        }
    };

    const handleClose = () => {
        setShow(false);
        setSelectedOrder(null);
        reset();
    };

    const handleShowDetails = (order) => {
        setSelectedOrder(order);
        setShow(true);
        setValue('orderStatus', order.orderStatus);
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await AdminService.updateOrderStatus(selectedOrder.id || selectedOrder.orderId, data.orderStatus);
            toast.success("Order status updated successfully!");
            handleClose();
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error("Failed to update order status!");
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOrderStats = () => {
        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.orderStatus?.toLowerCase() === 'pending').length,
            confirmed: orders.filter(o => o.orderStatus?.toLowerCase() === 'confirmed').length,
            shipped: orders.filter(o => o.orderStatus?.toLowerCase() === 'shipped').length,
            delivered: orders.filter(o => o.orderStatus?.toLowerCase() === 'delivered').length,
            cancelled: orders.filter(o => o.orderStatus?.toLowerCase() === 'cancelled').length,
        };
        return stats;
    };

    const quickStatusUpdate = async (orderId, newStatus) => {
        try {
            await AdminService.updateOrderStatus(orderId ?? orderId, newStatus);
            toast.success(`Order status updated to ${newStatus}!`);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error("Failed to update order status!");
        }
    };

    if (error) {
        return (
            <Container>
                <Alert variant="danger" className="mt-3">
                    {error}
                    <div className="mt-2">
                        <Button variant="outline-danger" onClick={fetchOrders}>
                            Try Again
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    const stats = getOrderStats();

    return (
        <Container>
            <Toaster />
            <div className="order-management-container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="order-management-title">Order Management</h2>
                    <Button variant="outline-primary" onClick={fetchOrders}>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh
                    </Button>
                </div>

                {/* Order Statistics */}
                <Row className="mb-4">
                    <Col md={2}>
                        <Card className="stat-card text-center">
                            <Card.Body>
                                <h5 className="text-primary">{stats.total}</h5>
                                <small>Total Orders</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={2}>
                        <Card className="stat-card text-center">
                            <Card.Body>
                                <h5 className="text-warning">{stats.pending}</h5>
                                <small>Pending</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={2}>
                        <Card className="stat-card text-center">
                            <Card.Body>
                                <h5 className="text-info">{stats.confirmed}</h5>
                                <small>Confirmed</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={2}>
                        <Card className="stat-card text-center">
                            <Card.Body>
                                <h5 className="text-primary">{stats.shipped}</h5>
                                <small>Shipped</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={2}>
                        <Card className="stat-card text-center">
                            <Card.Body>
                                <h5 className="text-success">{stats.delivered}</h5>
                                <small>Delivered</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={2}>
                        <Card className="stat-card text-center">
                            <Card.Body>
                                <h5 className="text-danger">{stats.cancelled}</h5>
                                <small>Cancelled</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Filter Controls */}
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending Orders</option>
                            <option value="confirmed">Confirmed Orders</option>
                            <option value="shipped">Shipped Orders</option>
                            <option value="delivered">Delivered Orders</option>
                            <option value="cancelled">Cancelled Orders</option>
                        </Form.Select>
                    </Col>
                    <Col md={8} className="text-end">
                        <Badge bg="secondary" className="me-2">
                            Showing {filteredOrders.length} of {orders.length} orders
                        </Badge>
                    </Col>
                </Row>

                {tableLoading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading orders...</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table striped bordered hover className="order-table">
                            <thead className="table-dark">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Order Date</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Quick Actions</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{order.accountName || 'N/A'}</td>
                                            <td>{formatDate(order.orderDate)}</td>
                                            <td>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                                            <td>
                                                <Badge bg={getStatusBadgeVariant(order.orderStatus)}>
                                                    {order.orderStatus || 'Pending'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="btn-group-vertical" role="group">
                                                    {order.orderStatus?.toLowerCase() === 'pending' && (
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            onClick={() => quickStatusUpdate(order.id || order.orderId, 'confirmed')}
                                                            title="Confirm Order"
                                                        >
                                                            <i className="bi bi-check-circle"></i> Confirm
                                                        </Button>
                                                    )}
                                                    {order.orderStatus?.toLowerCase() === 'confirmed' && (
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => quickStatusUpdate(order.id || order.orderId, 'shipped')}
                                                            title="Ship Order"
                                                        >
                                                            <i className="bi bi-truck"></i> Ship
                                                        </Button>
                                                    )}
                                                    {order.orderStatus?.toLowerCase() === 'shipped' && (
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                            onClick={() => quickStatusUpdate(order.id || order.orderId, 'delivered')}
                                                            title="Mark as Delivered"
                                                        >
                                                            <i className="bi bi-check2-all"></i> Deliver
                                                        </Button>
                                                    )}
                                                    {order.orderStatus?.toLowerCase() !== 'delivered' && order.orderStatus?.toLowerCase() !== 'cancelled' && (
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => quickStatusUpdate(order.id || order.orderId, 'cancelled')}
                                                            title="Cancel Order"
                                                        >
                                                            <i className="bi bi-x-circle"></i> Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => handleShowDetails(order)}
                                                    title="View Details"
                                                >
                                                    <i className="bi bi-eye"></i> View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            <div className="text-muted">
                                                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                                No orders found for the selected filter
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}

                {/* Order Details Modal */}
                <Modal show={show} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="bi bi-receipt me-2"></i>
                            Order Details - #{selectedOrder?.id}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedOrder && (
                            <div>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <p><strong>Customer:</strong> {selectedOrder.accountName || 'N/A'}</p>
                                        <p><strong>Order Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
                                        <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount?.toFixed(2) || '0.00'}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Current Status:</strong>
                                            <Badge bg={getStatusBadgeVariant(selectedOrder.orderStatus)} className="ms-2">
                                                {selectedOrder.orderStatus || 'Pending'}
                                            </Badge>
                                        </p>
                                    </Col>
                                </Row>

                                <h6>Order Items:</h6>
                                {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 ? (
                                    <Table striped bordered size="sm">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.orderDetails.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.orchidName || `Orchid #${item.orchidId}`}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>${item.unitPrice?.toFixed(2) || '0.00'}</td>
                                                    <td>${item.subtotal?.toFixed(2) || ((item.unitPrice || 0) * (item.quantity || 0)).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Alert variant="info">No order items available</Alert>
                                )}

                                <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Update Order Status:</strong></Form.Label>
                                        <Form.Select
                                            {...register('orderStatus', { required: 'Order status is required' })}
                                            isInvalid={!!errors.orderStatus}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.orderStatus?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg me-2"></i>
                                    Update Status
                                </>
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Container>
    );
}
