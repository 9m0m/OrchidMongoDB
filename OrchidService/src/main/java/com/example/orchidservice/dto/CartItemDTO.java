package com.example.orchidservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private String orchidId;        // String ID for Orchid reference
    private String orchidName;
    private String orchidUrl;
    private Double unitPrice;
    private Integer quantity;
    private Double subtotal;
}
