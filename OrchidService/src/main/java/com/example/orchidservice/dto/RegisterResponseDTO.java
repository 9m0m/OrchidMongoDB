package com.example.orchidservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponseDTO {
    private Integer accountId;
    private String accountName;
    private String email;
    private Integer roleId;
    private String message;
}