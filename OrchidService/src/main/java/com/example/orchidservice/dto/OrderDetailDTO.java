package com.example.orchidservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDTO {
    private Integer id;
    private Integer orchidId;
    private String orchidName; // For display purposes
    private String orchidUrl; // For display purposes
    private Double price;
    private Integer quantity;
    private Integer orderId;
    private Double subtotal; // Calculated field (price * quantity)
}
