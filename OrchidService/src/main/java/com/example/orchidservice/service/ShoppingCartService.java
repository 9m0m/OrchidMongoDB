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
    // Changed from Integer to String for orchid IDs
    private final Map<String, Map<String, CartItemDTO>> carts = new ConcurrentHashMap<>();

    @Override
    public ShoppingCartDTO getCart(String sessionId) {
        Map<String, CartItemDTO> cart = carts.get(sessionId);
        if (cart == null || cart.isEmpty()) {
            return ShoppingCartDTO.builder()
                .accountId(sessionId)
                .items(new ArrayList<>())
                .totalAmount(0.0)
                .totalItems(0)
                .build();
        }
        return buildCartDTO(sessionId, cart);
    }

    @Override
    public ShoppingCartDTO addToCart(String sessionId, String orchidId, Integer quantity) {
        Orchid orchid = orchidRepository.findById(orchidId)
                .orElseThrow(() -> new RuntimeException("Orchid not found: " + orchidId));

        Map<String, CartItemDTO> cart = carts.computeIfAbsent(sessionId, k -> new HashMap<>());

        CartItemDTO existingItem = cart.get(orchidId);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setSubtotal(existingItem.getQuantity() * existingItem.getUnitPrice());
        } else {
            CartItemDTO newItem = CartItemDTO.builder()
                .orchidId(orchidId)
                .orchidName(orchid.getOrchidName())
                .orchidUrl(orchid.getOrchidUrl())
                .unitPrice(orchid.getPrice())
                .quantity(quantity)
                .subtotal(orchid.getPrice() * quantity)
                .build();
            cart.put(orchidId, newItem);
        }

        return buildCartDTO(sessionId, cart);
    }

    @Override
    public ShoppingCartDTO updateCartItem(String sessionId, String orchidId, Integer quantity) {
        Map<String, CartItemDTO> cart = carts.get(sessionId);
        if (cart == null) {
            throw new RuntimeException("Cart not found for session: " + sessionId);
        }

        CartItemDTO item = cart.get(orchidId);
        if (item == null) {
            throw new RuntimeException("Item not found in cart: " + orchidId);
        }

        if (quantity <= 0) {
            cart.remove(orchidId);
        } else {
            item.setQuantity(quantity);
            item.setSubtotal(item.getUnitPrice() * quantity);
        }

        return buildCartDTO(sessionId, cart);
    }

    @Override
    public ShoppingCartDTO removeFromCart(String sessionId, String orchidId) {
        Map<String, CartItemDTO> cart = carts.get(sessionId);
        if (cart != null) {
            cart.remove(orchidId);
        }
        return buildCartDTO(sessionId, cart);
    }

    @Override
    public void clearCart(String sessionId) {
        carts.remove(sessionId);
    }

    private ShoppingCartDTO buildCartDTO(String sessionId, Map<String, CartItemDTO> cart) {
        if (cart == null || cart.isEmpty()) {
            return ShoppingCartDTO.builder()
                .accountId(sessionId)
                .items(new ArrayList<>())
                .totalAmount(0.0)
                .totalItems(0)
                .build();
        }

        List<CartItemDTO> items = new ArrayList<>(cart.values());
        double totalAmount = items.stream().mapToDouble(CartItemDTO::getSubtotal).sum();
        int totalItems = items.stream().mapToInt(CartItemDTO::getQuantity).sum();

        return ShoppingCartDTO.builder()
            .accountId(sessionId)
            .items(items)
            .totalAmount(totalAmount)
            .totalItems(totalItems)
            .build();
    }
}
