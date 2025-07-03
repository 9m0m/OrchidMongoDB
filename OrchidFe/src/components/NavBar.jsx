import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AccountService from '../services/accountService';
import toast from 'react-hot-toast';
import '../styles/NavBar.css';

export default function NavBar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Load user data from localStorage and update state
  const loadUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setCurrentUser(parsedUser);
      setIsLoggedIn(!!parsedUser.email);
    } else {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  };

  // Initialize user data when component mounts
  useEffect(() => {
    loadUserData();

    // Listen for login/logout events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', loadUserData);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', loadUserData);
    };
  }, []);

  // Handle storage changes (for multi-tab synchronization)
  const handleStorageChange = (e) => {
    if (e.key === 'user' || e.key === 'token') {
      loadUserData();
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Use the AccountService logout method which calls the backend API
      await AccountService.logout();

      // Update local state
      setCurrentUser(null);
      setIsLoggedIn(false);

      // Dispatch custom event for other components to react
      window.dispatchEvent(new Event('auth-change'));

      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout, but you have been logged out locally.');

      // Even if API call fails, update local state
      setCurrentUser(null);
      setIsLoggedIn(false);
      window.dispatchEvent(new Event('auth-change'));
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check if the user has admin privileges
  const isAdmin = () => {
    if (!currentUser || !currentUser.role) return false;
    const role = currentUser.role.toUpperCase();
    return role === 'ADMIN' || role === 'SUPERADMIN';
  };

  return (
      <Navbar expand="lg" className="floral-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/home" className="floral-brand">
            Orchid Shop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/home" className="floral-nav-link">Home</Nav.Link>
              <Nav.Link as={Link} to="/shop" className="floral-nav-link">Shop</Nav.Link>
              <Nav.Link as={Link} to="/order" className="floral-nav-link">Orders</Nav.Link>
              <Nav.Link as={Link} to="/cart" className="floral-nav-link">Cart</Nav.Link>
              <NavDropdown title="Explore" id="basic-nav-dropdown" className="floral-nav-dropdown">
                <NavDropdown.Item as={Link} to="/home">Featured Orchids</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/shop">Shop All Orchids</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#care-tips">Care Tips</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              {isLoggedIn ? (
                  <>
                    <Nav.Link className="floral-nav-link">Welcome, {currentUser?.name || currentUser?.accountName}</Nav.Link>
                    {isAdmin() && (
                      <Nav.Link as={Link} to="/admin" className="floral-nav-link">Admin</Nav.Link>
                    )}
                    <Nav.Link onClick={handleLogout} className="floral-nav-link">Logout</Nav.Link>
                  </>
              ) : (
                  <>
                    <Nav.Link as={Link} to="/login" className="floral-nav-link">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register" className="floral-nav-link">Register</Nav.Link>
                  </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}