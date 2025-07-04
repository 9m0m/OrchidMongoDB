package com.example.orchidservice.controller;

import com.example.orchidservice.dto.ShoppingCartDTO;
import com.example.orchidservice.service.imp.IShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    @Autowired
    private IShoppingCartService shoppingCartService;

    // Helper method to get user ID from JWT token
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName(); // This returns the user ID from JWT
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping
    public ResponseEntity<ShoppingCartDTO> getCart() {
        try {
            String userId = getCurrentUserId();
            ShoppingCartDTO cart = shoppingCartService.getCart(userId);
            if (cart.getItems() == null || cart.getItems().isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<ShoppingCartDTO> addToCart(
            @RequestParam String orchidId,
            @RequestParam Integer quantity) {
        try {
            if (quantity <= 0) {
                return ResponseEntity.badRequest().build();
            }
            String userId = getCurrentUserId();
            ShoppingCartDTO cart = shoppingCartService.addToCart(userId, orchidId, quantity);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<ShoppingCartDTO> updateCartItem(
            @RequestParam String orchidId,
            @RequestParam Integer quantity) {
        try {
            String userId = getCurrentUserId();
            ShoppingCartDTO cart = shoppingCartService.updateCartItem(userId, orchidId, quantity);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/remove/{orchidId}")
    public ResponseEntity<ShoppingCartDTO> removeFromCart(@PathVariable String orchidId) {
        try {
            String userId = getCurrentUserId();
            ShoppingCartDTO cart = shoppingCartService.removeFromCart(userId, orchidId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        try {
            String userId = getCurrentUserId();
            shoppingCartService.clearCart(userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}