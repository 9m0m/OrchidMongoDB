package com.example.orchidservice.service;

import com.example.orchidservice.dto.CartItemDTO;
import com.example.orchidservice.dto.ShoppingCartDTO;
import com.example.orchidservice.pojo.Orchid;
import com.example.orchidservice.repository.OrchidRepository;
import com.example.orchidservice.service.imp.IShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ShoppingCartService implements IShoppingCartService {

    @Autowired
    private OrchidRepository orchidRepository;

    // In-memory storage for shopping carts (in production, use Redis or database)
    private final Map<String, Map<Integer, CartItemDTO>> carts = new ConcurrentHashMap<>();

    @Override
    public ShoppingCartDTO getCart(String sessionId) {
        Map<Integer, CartItemDTO> cart = carts.get(sessionId);
        if (cart == null || cart.isEmpty()) {
            return new ShoppingCartDTO(new ArrayList<>(), 0.0, 0);
        }
        return buildCartDTO(cart);
    }

    @Override
    public ShoppingCartDTO addToCart(String sessionId, Integer orchidId, Integer quantity) {
        Orchid orchid = orchidRepository.findById(orchidId)
                .orElseThrow(() -> new RuntimeException("Orchid not found: " + orchidId));

        Map<Integer, CartItemDTO> cart = carts.computeIfAbsent(sessionId, k -> new HashMap<>());

        CartItemDTO existingItem = cart.get(orchidId);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setSubtotal(existingItem.getQuantity() * existingItem.getPrice());
        } else {
            CartItemDTO newItem = new CartItemDTO();
            newItem.setOrchidId(orchid.getOrchidId());
            newItem.setOrchidName(orchid.getOrchidName());
            newItem.setPrice(orchid.getPrice());
            newItem.setQuantity(quantity);
            newItem.setSubtotal(orchid.getPrice() * quantity);
            newItem.setOrchidUrl(orchid.getOrchidUrl());
            cart.put(orchidId, newItem);
        }

        carts.put(sessionId, cart);
        return buildCartDTO(cart);
    }

    @Override
    public ShoppingCartDTO updateCartItem(String sessionId, Integer orchidId, Integer quantity) {
        Map<Integer, CartItemDTO> cart = carts.get(sessionId);
        if (cart != null && cart.containsKey(orchidId)) {
            if (quantity <= 0) {
                cart.remove(orchidId);
            } else {
                CartItemDTO item = cart.get(orchidId);
                item.setQuantity(quantity);
                item.setSubtotal(item.getPrice() * quantity);
            }
        }
        return buildCartDTO(cart != null ? cart : new HashMap<>());
    }

    @Override
    public ShoppingCartDTO removeFromCart(String sessionId, Integer orchidId) {
        Map<Integer, CartItemDTO> cart = carts.get(sessionId);
        if (cart != null) {
            cart.remove(orchidId);
        }
        return buildCartDTO(cart != null ? cart : new HashMap<>());
    }

    @Override
    public void clearCart(String sessionId) {
        carts.remove(sessionId);
    }

    private ShoppingCartDTO buildCartDTO(Map<Integer, CartItemDTO> cart) {
        if (cart == null || cart.isEmpty()) {
            return new ShoppingCartDTO(new ArrayList<>(), 0.0, 0);
        }

        List<CartItemDTO> items = new ArrayList<>(cart.values());
        Double totalAmount = items.stream()
                .mapToDouble(CartItemDTO::getSubtotal)
                .sum();
        Integer totalItems = items.stream()
                .mapToInt(CartItemDTO::getQuantity)
                .sum();

        return new ShoppingCartDTO(items, totalAmount, totalItems);
    }
}
