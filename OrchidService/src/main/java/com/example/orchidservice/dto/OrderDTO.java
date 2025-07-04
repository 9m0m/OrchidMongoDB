package com.example.orchidservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private String orderId;         // Changed from 'id' to 'orderId' for consistency
    private String accountId;       // String ID for Account reference
    private String accountName;
    private LocalDate orderDate;
    private String orderStatus;
    private Double totalAmount;
    private List<OrderDetailDTO> orderDetails;
}
