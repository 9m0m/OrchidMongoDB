package com.example.orchidservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private String accountId;       // String ID for Account reference
    private List<OrderDetailDTO> orderDetails;
    private String shippingAddress;
    private String paymentMethod;
}
