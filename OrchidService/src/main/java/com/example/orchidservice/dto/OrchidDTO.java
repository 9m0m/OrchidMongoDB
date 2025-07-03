package com.example.orchidservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrchidDTO {
    private Integer orchidId;
    private Boolean isNatural;
    private String orchidDescription;
    private String orchidName;
    private String orchidUrl;
    private Double price;
    private Integer categoryId;
    private String categoryName;
}
