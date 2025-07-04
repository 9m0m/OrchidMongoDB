package com.example.orchidservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrchidDTO {
    private String orchidId;        // Changed from 'id' to 'orchidId' for consistency
    private String orchidName;
    private String orchidDescription;
    private String orchidUrl;
    private Double price;
    private Boolean isNatural;
    private String categoryId;      // String ID for Category reference
    private String categoryName;
}
