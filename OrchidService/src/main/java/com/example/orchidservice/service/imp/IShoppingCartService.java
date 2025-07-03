package com.example.orchidservice.service.imp;

import com.example.orchidservice.dto.CartItemDTO;
import com.example.orchidservice.dto.ShoppingCartDTO;

public interface IShoppingCartService {
    ShoppingCartDTO getCart(String sessionId);
    ShoppingCartDTO addToCart(String sessionId, Integer orchidId, Integer quantity);
    ShoppingCartDTO updateCartItem(String sessionId, Integer orchidId, Integer quantity);
    ShoppingCartDTO removeFromCart(String sessionId, Integer orchidId);
    void clearCart(String sessionId);
}
