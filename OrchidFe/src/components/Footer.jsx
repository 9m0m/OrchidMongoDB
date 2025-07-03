import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import '../styles/Footer.css';

export default function Footer() {
    return (
        <footer className="floral-footer">
            <Container>
                <Row className="footer-row">
                    <Col md={4} className="footer-column">
                        <h4 className="floral-footer-title">Orchid Shop</h4>
                        <p className="floral-footer-text">
                            Bringing beauty to your life with our exquisite orchids.
                        </p>
                    </Col>
                    <Col md={4} className="footer-column">
                        <h4 className="floral-footer-title">Contact Us</h4>
                        <p className="floral-footer-text">
                            Email: FBTMaiDinh.com<br />
                            Phone: 0335448184<br />
                            Address: Nha Van Hoa Sinh Vien, HCM City, Vietnam
                        </p>
                    </Col>
                    <Col md={4} className="footer-column">
                        <h4 className="floral-footer-title">Follow Us</h4>
                        <div className="social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <FaFacebookF className="floral-social-icon" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="floral-social-icon" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <FaTwitter className="floral-social-icon" />
                            </a>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center copyright">
                        <p className="floral-copyright-text">
                            © 2025 Orchid Shop. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}