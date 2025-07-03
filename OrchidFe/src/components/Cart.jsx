import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Image, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ShoppingCartService from '../services/shoppingCartService';
import '../styles/Cart.css';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ShoppingCartService.getCart();
            console.log('Cart response:', response.data); // Debug log to see the actual structure
            const items = response.data.items || [];
            console.log('Cart items:', items); // Debug log to see the items structure
            setCartItems(items);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setError('Failed to load cart items. Please try again later.');
            toast.error('Error loading cart items');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (orchidId) => {
        try {
            setIsProcessing(true);
            await ShoppingCartService.removeFromCart(orchidId);
            // Instead of filtering local state, refetch the cart data from server
            await fetchCartItems();
            toast.success('Item removed from cart!');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Failed to remove item. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDecreaseQuantity = async (orchidId, currentQuantity) => {
        try {
            setIsProcessing(true);
            if (currentQuantity <= 1) {
                // If quantity is 1 or less, remove the item completely
                await ShoppingCartService.removeFromCart(orchidId);
                toast.success('Item removed from cart!');
            } else {
                // Decrease quantity by 1
                await ShoppingCartService.updateCartItem(orchidId, currentQuantity - 1);
                toast.success('Quantity decreased!');
            }
            await fetchCartItems();
        } catch (error) {
            console.error('Error updating item quantity:', error);
            toast.error('Failed to update quantity. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleIncreaseQuantity = async (orchidId, currentQuantity) => {
        try {
            setIsProcessing(true);
            await ShoppingCartService.updateCartItem(orchidId, currentQuantity + 1);
            await fetchCartItems();
            toast.success('Quantity increased!');
        } catch (error) {
            console.error('Error updating item quantity:', error);
            toast.error('Failed to update quantity. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClearCart = async () => {
        try {
            setIsProcessing(true);
            await ShoppingCartService.clearCart();
            // Instead of setting empty array, refetch to ensure consistency
            await fetchCartItems();
            toast.success('Cart cleared!');
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <Container className="cart-container text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading your cart...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="cart-container">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="cart-container">
            <Toaster />
            <h2 className="floral-title mb-4">Your Cart</h2>
            {cartItems.length === 0 ? (
                <div className="text-center py-4">
                    <p className="floral-text">Your cart is empty.</p>
                    <Link to="/shop" className="btn btn-primary floral-button mt-3">Shop Now</Link>
                </div>
            ) : (
                <>
                    <Table striped bordered hover className="floral-table">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Orchid Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item) => {
                            // Add safety checks to prevent undefined errors
                            const orchid = item.orchid || item; // Handle case where orchid data might be directly on item
                            const orchidImage = orchid?.orchidUrl || orchid?.image || 'https://via.placeholder.com/50';
                            const orchidName = orchid?.orchidName || 'Unknown Orchid';
                            const orchidPrice = orchid?.price || 0;
                            const orchidId = orchid?.orchidId || orchid?.id || item.id;

                            return (
                                <tr key={item.id || orchidId}>
                                    <td>
                                        <Image
                                            src={orchidImage}
                                            width={50}
                                            rounded
                                            className="floral-image"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/50';
                                            }}
                                        />
                                    </td>
                                    <td>{orchidName}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Button
                                                variant="outline-secondary"
                                                className="floral-button-outline me-2"
                                                onClick={() => handleDecreaseQuantity(orchidId, item.quantity)}
                                                disabled={isProcessing}
                                            >
                                                -
                                            </Button>
                                            <span>{item.quantity || 1}</span>
                                            <Button
                                                variant="outline-secondary"
                                                className="floral-button-outline ms-2"
                                                onClick={() => handleIncreaseQuantity(orchidId, item.quantity)}
                                                disabled={isProcessing}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>
                                    <td>${(orchidPrice * (item.quantity || 1)).toFixed(2)}</td>
                                    <td>
                                        <Button
                                            variant="outline-danger"
                                            className="floral-button-outline"
                                            onClick={() => handleRemoveItem(orchidId)}
                                            disabled={isProcessing}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="3" className="text-end fw-bold">Total:</td>
                            <td colSpan="2" className="fw-bold">
                                ${cartItems.reduce((total, item) => {
                                    const orchid = item.orchid || item;
                                    const orchidPrice = orchid?.price || 0;
                                    const quantity = item.quantity || 1;
                                    return total + (orchidPrice * quantity);
                                }, 0).toFixed(2)}
                            </td>
                        </tr>
                        </tfoot>
                    </Table>
                    <div className="d-flex justify-content-between">
                        <Button
                            variant="outline-danger"
                            className="floral-button-outline"
                            onClick={handleClearCart}
                            disabled={isProcessing}
                        >
                            Clear Cart
                        </Button>
                        <Link to="/checkout">
                            <Button className="floral-button" disabled={isProcessing}>
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </div>
                </>
            )}
        </Container>
    );
}