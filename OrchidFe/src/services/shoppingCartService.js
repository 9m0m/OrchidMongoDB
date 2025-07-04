import apiClient from './apiConfig';

const ShoppingCartService = {
  // Get current user's cart
  getCart: async () => {
    return apiClient.get('/cart');
  },

  // Add item to cart
  addToCart: async (orchidId, quantity) => {
    console.log('Adding to cart - orchidId:', orchidId, 'quantity:', quantity);
    // Backend expects request parameters, not JSON body
    const params = new URLSearchParams();
    params.append('orchidId', orchidId); // Keep as string, don't parse as integer
    params.append('quantity', parseInt(quantity));
    console.log('Request params:', params.toString());
    return apiClient.post('/cart/add', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },

  // Update cart item quantity
  updateCartItem: async (orchidId, quantity) => {
    const params = new URLSearchParams();
    params.append('orchidId', orchidId); // Keep as string, don't parse as integer
    params.append('quantity', parseInt(quantity));
    return apiClient.put('/cart/update', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },

  // Remove item from cart - using the correct endpoint path
  removeFromCart: async (orchidId) => {
    return apiClient.delete(`/cart/remove/${orchidId}`);
  },

  // Clear cart
  clearCart: async () => {
    return apiClient.delete('/cart/clear');
  }
};

export default ShoppingCartService;
