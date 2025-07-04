package com.example.orchidservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private String accountId;       // Changed from 'id' to 'accountId' to match controller usage
    private String accountName;
    private String email;
    private String roleId;          // String ID for Role reference
    private String roleName;
}