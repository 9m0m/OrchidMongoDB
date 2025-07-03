import React, { useEffect, useState } from 'react';
import { Container, Button, Col, Row, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Shop.css';
import OrchidService from '../services/orchidService';
import ShoppingCartService from '../services/shoppingCartService';
import toast, { Toaster } from 'react-hot-toast';

export default function Shop() {
    const [orchids, setOrchids] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrchids();
    }, []);

    // Add to cart handler
    const handleAddToCart = async (orchidId) => {
        // Check if user is authenticated by looking for the token
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to add items to your cart');
            return;
        }

        try {
            await ShoppingCartService.addToCart(orchidId, 1);
            toast.success('Added to cart!');
        } catch (error) {
            console.error('Add to cart error:', error);
            // Handle different error types
            if (error.response && error.response.status === 401) {
                toast.error('Please log in again to add items to your cart');
                localStorage.removeItem('token');
            } else {
                toast.error('Failed to add to cart. Please try again.');
            }
        }
    };

    const fetchOrchids = async () => {
        try {
            setLoading(true);
            const response = await OrchidService.getAllOrchids();
            const sortedData = response.data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            setOrchids(sortedData);
        } catch (error) {
            console.error('Error fetching orchids:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrchids = orchids.filter((item) =>
        item.orchidName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="shop-screen">
            <Container className="shop-container">
                <div className="search-bar-container">
                    <Form.Control
                        type="text"
                        placeholder="Search orchids..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="floral-search-input"
                    />
                </div>
                <h2 className="floral-title mb-4">Shop Our Orchids</h2>
                {loading ? (
                    <div className="text-center">Loading orchids...</div>
                ) : (
                    <Row className="g-4">
                        {filteredOrchids.map((item) => (
                            <Col md={4} key={item.id || item.orchidId}>
                                <Card className="floral-card shadow">
                                    <Card.Img
                                        key={`img-${item.id || item.orchidId}`}
                                        variant="top"
                                        src={item.orchidUrl || item.image}
                                        alt={item.orchidName}
                                        className="floral-card-img"
                                    />
                                    <Card.Body key={`body-${item.id || item.orchidId}`}>
                                        <Card.Title key={`title-${item.id || item.orchidId}`} className="floral-card-title">{item.orchidName}</Card.Title>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Link to={`/detail/${item.id || item.orchidId}`} key={`link-${item.id || item.orchidId}`}>
                                                <Button className="floral-button" key={`button-${item.id || item.orchidId}`}>View Details</Button>
                                            </Link>
                                            <Button
                                                className="floral-button-cart"
                                                onClick={() => handleAddToCart(item.id || item.orchidId)}
                                                key={`cart-${item.id || item.orchidId}`}
                                            >
                                                <i className="bi bi-cart-plus"></i> Add to Cart
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
            <Toaster />
        </div>
    );
}