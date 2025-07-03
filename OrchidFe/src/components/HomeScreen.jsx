import React, { useEffect, useState } from 'react';
import { Container, Button, Col, Row, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/HomeScreen.css';

export default function HomeScreen() {
    const baseUrl = import.meta.env.VITE_API_URL;
    const [api, setAPI] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(baseUrl);
            const sortedData = response.data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            setAPI(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="home-screen">
            <div className="hero-section">
                <div className="hero-overlay">
                    <Container>
                        <div className="hero-content">
                            <h1 className="floral-hero-title">Welcome to Orchid Shop</h1>
                            <p className="floral-hero-text">
                                Discover the beauty of premium orchids and transform your space with nature's finest.
                            </p>
                            <Link to="/shop">
                                <Button className="floral-hero-button">Shop Now</Button>
                            </Link>
                        </div>
                    </Container>
                </div>
            </div>
            <Container className="home-container">
                <h2 className="floral-title mb-4">Featured Orchids</h2>
                <Row className="g-4">
                    {api.map((item) => (
                        <Col md={4} key={item.id}>
                            <Card className="floral-card shadow">
                                <Card.Img
                                    variant="top"
                                    src={item.image}
                                    alt={item.orchidName}
                                    className="floral-card-img"
                                />
                                <Card.Body>
                                    <Card.Title className="floral-card-title">{item.orchidName}</Card.Title>
                                    <Link to={`/detail/${item.id}`}>
                                        <Button className="floral-button">View Details</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}