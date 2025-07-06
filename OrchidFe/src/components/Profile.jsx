import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiShoppingBag } from 'react-icons/fi';
import accountService from '../services/accountService';
import toast from 'react-hot-toast';
import '../styles/Profile.css';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await accountService.getCurrentProfile();
        setProfile(data);
      } catch (e) {
        toast.error('Failed to load profile');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Debug: Log the profile data
  console.log('Profile data:', profile);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </Spinner>
      </div>
    );
  }

  if (!profile) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div className="alert alert-warning">
              Unable to load profile. Please try again later.
            </div>
            <Button variant="primary" onClick={() => window.location.reload()} className="mt-3">
              Retry
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  // Get the user data from the result property if it exists
  const userData = profile.result || profile;
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="profile-card shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">My Profile</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <div className="profile-avatar bg-primary text-white d-flex align-items-center justify-content-center">
                  <FiUser size={32} />
                </div>
                <h3 className="ms-3 mb-0">{userData.accountName || 'User'}</h3>
              </div>
              
              <div className="profile-details">
                <div className="profile-detail-item">
                  <div className="detail-icon">
                    <FiMail className="text-primary" />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Email</div>
                    <div className="detail-value">{userData.email || 'No email provided'}</div>
                  </div>
                </div>
              </div>
              
              <div className="d-grid gap-2 mt-4">
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/order')}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <FiShoppingBag /> My Orders
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
