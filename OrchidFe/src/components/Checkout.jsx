import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ShoppingCartService from '../services/shoppingCartService';
import OrderService from '../services/orderService';
import OrchidService from '../services/orchidService';
import '../styles/Order.css';

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if user is authenticated
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please log in to proceed with checkout');
                navigate('/login');
                return;
            }

            const response = await ShoppingCartService.getCart();
            let items = response.data.items || [];

            // Enrich items with orchid details if missing
            items = await Promise.all(items.map(async (item) => {
                if (!item.orchid || !item.orchid.price) {
                    try {
                        const orchidId = item.orchidId || item.id || item.orchid?.orchidId;
                        if (orchidId) {
                            const orchidRes = await OrchidService.getOrchidById(orchidId);
                            if (orchidRes?.data) {
                                item.orchid = orchidRes.data;
                                item.unitPrice = orchidRes.data.price;
                            }
                        }
                    } catch (err) {
                        console.error('Failed to fetch orchid details for cart item', item, err);
                    }
                }
                return item;
            }));

            if (items.length === 0) {
                toast.error('Your cart is empty. Please add items before checkout.');
                navigate('/cart');
                return;
            }

            setCartItems(items);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            if (error.response?.status === 401) {
                toast.error('Please log in to proceed with checkout');
                navigate('/login');
            } else {
                setError('Failed to load cart items. Please try again later.');
                toast.error('Error loading cart items');
            }
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.unitPrice ?? item.orchid?.price ?? item.price ?? 0;
            const quantity = item.quantity || 1;
            return total + price * quantity;
        }, 0);
    };

    const handlePlaceOrder = async () => {
        try {
            setSubmitting(true);

            // Prepare order data according to backend's OrderDTO
            const orderData = {
                orderStatus: 'PENDING',
                orderDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
                totalAmount: calculateTotal(),
                orderDetails: cartItems.map(item => {
                    const orchidId = item.orchidId || item.orchid?.orchidId || item.id;
                    const quantity = parseInt(item.quantity) || 1;
                    const unitPrice = parseFloat(item.unitPrice ?? item.orchid?.price ?? item.price ?? 0);
                    
                    console.log(`Order detail - orchidId: ${orchidId}, quantity: ${quantity}, unitPrice: ${unitPrice}`);
                    
                    return {
                        orchidId: orchidId,
                        quantity: quantity,
                        unitPrice: unitPrice
                    };
                })
            };
            
            console.log('Submitting order data:', JSON.stringify(orderData, null, 2));

            console.log('Submitting order:', orderData);

            // Validate order details before sending
            const invalidDetails = orderData.orderDetails.filter(d => !d.orchidId || d.unitPrice === undefined || d.quantity === undefined);
            if (invalidDetails.length > 0) {
                toast.error('Some cart items are missing required information. Please refresh your cart.');
                setSubmitting(false);
                return;
            }

            if (orderData.totalAmount === 0) {
                toast.error('Order total is 0. Please verify item prices.');
                setSubmitting(false);
                return;
            }

            // Create the order
            const response = await OrderService.createOrder(orderData);

            console.log('Order created successfully:', response.data);

            // Clear the cart after successful order
            try {
                await ShoppingCartService.clearCart();
            } catch (cartError) {
                console.warn('Failed to clear cart:', cartError);
                // Don't fail the checkout if cart clearing fails
            }

            toast.success('Order placed successfully! Redirecting to your orders...');

            // Redirect to orders page after a short delay
            setTimeout(() => {
                navigate('/order');
            }, 2000);

        } catch (error) {
            console.error('Error creating order:', error);

            if (error.response?.status === 401) {
                toast.error('Please log in to complete your order');
                navigate('/login');
            } else if (error.response?.status === 400) {
                toast.error('Invalid order data. Please try again.');
            } else {
                toast.error('Failed to place order. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="checkout-container text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading checkout...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="checkout-container">
                <Alert variant="danger">{error}</Alert>
                <Button variant="primary" onClick={() => navigate('/cart')}>
                    Back to Cart
                </Button>
            </Container>
        );
    }

    return (
        <Container className="checkout-container py-4">
            <Toaster />

            <Row>
                <Col lg={8}>
                    <Card className="mb-4 floral-card">
                        <Card.Header>
                            <h4 className="mb-0">Order Summary</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className="order-items">
                                {cartItems.map((item, index) => {
                                    const orchid = item.orchid || item;
                                    const itemTotal = (orchid.price || 0) * (item.quantity || 1);
                                    return (
                                        <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-3">
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{orchid.orchidName || 'Orchid'}</h6>
                                                <small className="text-muted">
                                                    ${(orchid.price || 0).toFixed(2)} × {item.quantity || 1}
                                                </small>
                                                {orchid.description && (
                                                    <p className="text-muted small mt-1 mb-0">{orchid.description}</p>
                                                )}
                                            </div>
                                            <div className="text-end">
                                                <strong>${itemTotal.toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="floral-card">
                        <Card.Header>
                            <h5 className="mb-0">Order Total</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span>Subtotal ({cartItems.length} items):</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <strong>Total Amount:</strong>
                                <strong className="text-success h5">
                                    ${calculateTotal().toFixed(2)}
                                </strong>
                            </div>

                            <div className="d-grid gap-2">
                                <Button
                                    variant="success"
                                    size="lg"
                                    onClick={handlePlaceOrder}
                                    disabled={submitting}
                                    className="floral-button"
                                >
                                    {submitting ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                className="me-2"
                                            />
                                            Placing Order...
                                        </>
                                    ) : (
                                        'Place Order'
                                    )}
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    onClick={() => navigate('/cart')}
                                    disabled={submitting}
                                >
                                    Back to Cart
                                </Button>
                            </div>

                            <div className="mt-3">
                                <small className="text-muted">
                                    By placing this order, you agree to our terms and conditions.
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
