package com.example.orchidservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Integer orchidId;
    private String orchidName;
    private Double price;
    private Integer quantity;
    private Double subtotal;
    private String orchidUrl;
}
