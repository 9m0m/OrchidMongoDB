package com.example.orchidservice.controller;

import com.example.orchidservice.dto.AccountDTO;
import com.example.orchidservice.dto.ApiResponse;
import com.example.orchidservice.dto.LoginRequestDTO;
import com.example.orchidservice.dto.LoginResponseDTO;
import com.example.orchidservice.dto.RegisterRequestDTO;
import com.example.orchidservice.dto.RegisterResponseDTO;
import com.example.orchidservice.service.imp.IAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private IAccountService accountService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponseDTO>> register(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            RegisterResponseDTO response = accountService.register(request);
            return ResponseEntity.ok(ApiResponse.<RegisterResponseDTO>builder()
                .code(1000)
                .message("Registration successful")
                .result(response)
                .build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<RegisterResponseDTO>builder()
                .code(1001)
                .message(e.getMessage())
                .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO response = accountService.login(request);
            return ResponseEntity.ok(ApiResponse.<LoginResponseDTO>builder()
                .code(1000)
                .message("Login successful")
                .result(response)
                .build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.<LoginResponseDTO>builder()
                .code(1001)
                .message("Invalid credentials")
                .build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String authHeader) {
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        accountService.logout(token);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(1000)
                .message("Logged out successfully")
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDTO>> getAccount(@PathVariable String id) {
        try {
            AccountDTO account = accountService.getAccountById(id);
            return ResponseEntity.ok(ApiResponse.<AccountDTO>builder()
                .code(1000)
                .message("Account retrieved successfully")
                .result(account)
                .build());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountDTO>>> getAllAccounts() {
        List<AccountDTO> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.<List<AccountDTO>>builder()
            .code(1000)
            .message("Accounts retrieved successfully")
            .result(accounts)
            .build());
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<AccountDTO>> getCurrentUserProfile(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            com.example.orchidservice.pojo.Account current = (com.example.orchidservice.pojo.Account) authentication.getPrincipal();
            AccountDTO dto = accountService.getAccountById(current.getId());
            return ResponseEntity.ok(ApiResponse.<AccountDTO>builder()
                    .code(1000)
                    .message("Profile retrieved successfully")
                    .result(dto)
                    .build());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDTO>> updateAccount(@PathVariable String id, @Valid @RequestBody AccountDTO accountDTO) {
        try {
            AccountDTO updatedAccount = accountService.updateAccount(id, accountDTO);
            return ResponseEntity.ok(ApiResponse.<AccountDTO>builder()
                .code(1000)
                .message("Account updated successfully")
                .result(updatedAccount)
                .build());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable String id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(1000)
                .message("Account deleted successfully")
                .build());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
