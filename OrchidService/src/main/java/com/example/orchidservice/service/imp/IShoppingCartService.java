package com.example.orchidservice.service.imp;

import com.example.orchidservice.dto.ShoppingCartDTO;

public interface IShoppingCartService {
    ShoppingCartDTO getCart(String sessionId);
    ShoppingCartDTO addToCart(String sessionId, String orchidId, Integer quantity);
    ShoppingCartDTO updateCartItem(String sessionId, String orchidId, Integer quantity);
    ShoppingCartDTO removeFromCart(String sessionId, String orchidId);
    void clearCart(String sessionId);
}
