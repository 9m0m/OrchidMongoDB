package com.example.orchidservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDTO {
    private String orderDetailId;   // Changed from 'id' to 'orderDetailId' for consistency
    private String orderId;         // String ID for Order reference
    private String orchidId;        // String ID for Orchid reference
    private String orchidName;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;
}
