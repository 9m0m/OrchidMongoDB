import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Badge, Image, Spinner, Alert, Button } from 'react-bootstrap';
import OrchidService from '../services/orchidService';
import ShoppingCartService from '../services/shoppingCartService';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/DetailOrchid.css';

export default function DetailOrchid() {
  const [orchid, setOrchid] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Use the ID directly as a string (MongoDB uses string IDs)
    const orchidId = id?.trim();

    if (!orchidId) {
      setError('Invalid orchid ID');
      setLoading(false);
      toast.error('Invalid orchid ID');
      // Redirect to shop after short delay
      setTimeout(() => navigate('/shop'), 2000);
      return;
    }

    fetchData(orchidId);
  }, [id, navigate]);

  const fetchData = async (orchidId) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching orchid with ID: ${orchidId}`);
      const response = await OrchidService.getOrchidById(orchidId);
      console.log('Orchid data received:', response.data);
      setOrchid(response.data);
    } catch (error) {
      console.error('Error fetching orchid:', error);
      if (error.response?.status === 404) {
        setError('Orchid not found. It may have been removed.');
      } else {
        setError('Failed to load orchid details. Please try again later.');
      }
      toast.error('Error loading orchid details');
    } finally {
      setLoading(false);
    }
  };

  // Add to cart handler
  const handleAddToCart = async () => {
    // Check if user is authenticated by looking for the token
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to add items to your cart');
      // Optional: redirect to login
      // setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      // Use the orchid's _id if available, otherwise fall back to id or orchidId
      const orchidId = orchid._id || orchid.id || orchid.orchidId;
      if (!orchidId) {
        throw new Error('Invalid orchid ID');
      }
      console.log('Adding to cart - orchidId:', orchidId);
      await ShoppingCartService.addToCart(orchidId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      // Handle different error types
      if (error.response && error.response.status === 401) {
        toast.error('Please log in again to add items to your cart');
        // Session might have expired, clear invalid token
        localStorage.removeItem('token');
        // Optional: redirect to login
        // setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error('Failed to add to cart. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="detail-orchid-container text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading orchid details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-orchid-container">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
      <div className="detail-orchid-container">
        <Toaster />
        <div className="row">
          <div className="col-12 col-md-8 p-3">
            <Breadcrumb>
              <Breadcrumb.Item href="/shop">Shop</Breadcrumb.Item>
              <Breadcrumb.Item active>{orchid.orchidName || 'Loading...'}</Breadcrumb.Item>
            </Breadcrumb>
            <Badge className="floral-badge mb-3">{orchid.orchidName || 'Loading...'}</Badge>
            <Card className="floral-card shadow">
              <Card.Header>
                <p className="text-primary fs-5">{orchid.orchidDescription || 'No description available'}</p>
              </Card.Header>
              <Card.Body>
                {orchid.isNatural ? (
                    <Badge className="floral-badge-natural">Natural Orchid</Badge>
                ) : (
                    <Badge className="floral-badge-industrial">Industrial Orchid</Badge>
                )}
                <div className="mt-3">
                  <p><strong>Price:</strong> ${orchid.price?.toFixed(2) || '0.00'}</p>
                  <p><strong>Category:</strong> {orchid.categoryName || 'Uncategorized'}</p>
                  <div className="mt-4">
                    <Button
                      className="floral-button-cart"
                      onClick={handleAddToCart}
                    >
                      <i className="bi bi-cart-plus"></i> Add to Cart
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-12 col-md-4 p-3">
            <Image
              src={orchid.orchidUrl || orchid.image || 'https://via.placeholder.com/300'}
              alt={orchid.orchidName}
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>
  );
}