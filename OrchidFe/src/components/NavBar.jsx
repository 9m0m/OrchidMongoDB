import React, { useState, useEffect, useCallback } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AccountService from '../services/accountService';
import { isAdmin, isAuthenticated, getCurrentUser } from '../services/authService';
import toast from 'react-hot-toast';
import '../styles/NavBar.css';

export default function NavBar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const user = getCurrentUser();
        const loggedIn = isAuthenticated();
        
        setCurrentUser(user);
        setIsLoggedIn(loggedIn);
        
        // Debug log
        console.log('NavBar - User data loaded:', {
          isLoggedIn: loggedIn,
          user,
          role: user?.role,
          isAdmin: isAdmin()
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        handleLogout();
      }
    };
    
    // Load initial user data
    loadUserData();
    
    // Listen for auth changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (['token', 'user', 'roleName'].includes(e.key)) {
        loadUserData();
      }
    };
    
    // Listen for custom auth change events
    const handleAuthChange = () => {
      console.log('Auth change event received');
      loadUserData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      try {
        // Try to call the logout API if possible
        await AccountService.logout();
      } catch (error) {
        console.warn('Error during API logout (proceeding with client-side logout):', error);
      }
      
      // Clear all auth-related data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('roleName');
      
      // Update UI state
      setCurrentUser(null);
      setIsLoggedIn(false);
      
      // Notify other components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('auth-change'));
      
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout, but you have been logged out locally.');
      
      // Ensure we clean up even if there's an error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      setIsLoggedIn(false);
      window.dispatchEvent(new Event('auth-change'));
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check if current user is admin using the centralized auth service
  const isUserAdmin = () => {
    return isAdmin();
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
                    {isUserAdmin() && (
                      <Nav.Link as={Link} to="/admin" className="floral-nav-link">Admin</Nav.Link>
                    )}
                    <Nav.Link as={Link} to="/profile" className="floral-nav-link">Profile</Nav.Link>
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