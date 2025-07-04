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
public class ShoppingCartDTO {
    private String accountId;       // String ID for Account reference
    private List<CartItemDTO> items;
    private Double totalAmount;
    private Integer totalItems;
}
