import React, { useEffect, useState } from 'react';
import { Container, Button, Col, Row, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/HomeScreen.css';

export default function HomeScreen() {
    const [api, setAPI] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Make sure to use the correct endpoint for fetching orchids
            const response = await axios.get(`${apiBaseUrl}/orchids`);
            console.log('API Response:', response);
            
            if (!response.data) {
                console.error('No data in response');
                return;
            }
            
            let dataToSort = [];
            const responseData = response.data;
            
            // Handle different response formats
            if (Array.isArray(responseData)) {
                dataToSort = [...responseData];
            } else if (responseData.data && Array.isArray(responseData.data)) {
                dataToSort = [...responseData.data];
            } else if (responseData.result && Array.isArray(responseData.result)) {
                dataToSort = [...responseData.result];
            } else if (responseData.items && Array.isArray(responseData.items)) {
                dataToSort = [...responseData.items];
            } else if (typeof responseData === 'object') {
                // If it's a single object, put it in an array
                dataToSort = [responseData];
            }
            
            // Sort the data if we have items to sort
            const sortedData = dataToSort.length > 0 
                ? dataToSort.sort((a, b) => {
                    // Handle cases where id might be a string or number
                    const idA = typeof a.id === 'string' ? parseInt(a.id, 10) : a.id;
                    const idB = typeof b.id === 'string' ? parseInt(b.id, 10) : b.id;
                    return idB - idA;
                })
                : [];
                
            setAPI(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setAPI([]); // Reset to empty array on error
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