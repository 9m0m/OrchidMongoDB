package com.example.orchidservice.service;

import com.example.orchidservice.dto.AccountDTO;
import com.example.orchidservice.dto.LoginRequestDTO;
import com.example.orchidservice.dto.LoginResponseDTO;
import com.example.orchidservice.dto.RegisterRequestDTO;
import com.example.orchidservice.dto.RegisterResponseDTO;
import com.example.orchidservice.pojo.Account;
import com.example.orchidservice.pojo.Role;
import com.example.orchidservice.repository.AccountRepository;
import com.example.orchidservice.repository.RoleRepository;
import com.example.orchidservice.service.imp.IAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService implements IAccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Override
    public RegisterResponseDTO register(RegisterRequestDTO request) {
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Account account = new Account();
        account.setAccountName(request.getAccountName());
        account.setEmail(request.getEmail());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(role);

        Account savedAccount = accountRepository.save(account);

        return RegisterResponseDTO.builder()
                .accountId(savedAccount.getId())
                .accountName(savedAccount.getAccountName())
                .email(savedAccount.getEmail())
                .roleName(savedAccount.getRole().getRoleName())
                .message("Account registered successfully")
                .build();
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        Account account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(account);

        return LoginResponseDTO.builder()
                .token(token)
                .accountId(account.getId())
                .accountName(account.getAccountName())
                .email(account.getEmail())
                .roleName(account.getRole().getRoleName())
                .build();
    }

    @Override
    public AccountDTO getAccountById(String id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return convertToDTO(account);
    }

    @Override
    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDTO updateAccount(String id, AccountDTO accountDTO) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setAccountName(accountDTO.getAccountName());
        account.setEmail(accountDTO.getEmail());

        Account updatedAccount = accountRepository.save(account);
        return convertToDTO(updatedAccount);
    }

    @Override
    public void deleteAccount(String id) {
        if (!accountRepository.existsById(id)) {
            throw new RuntimeException("Account not found");
        }
        accountRepository.deleteById(id);
    }

    @Override
    public Account findByEmail(String email) {
        return accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Override
    public void logout(String token) {
        if (token != null) {
            jwtService.invalidateToken(token);
        }
    }

    @Override
    public Account createAccount(AccountDTO accountDTO) {
        if (accountRepository.existsByEmail(accountDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findById(accountDTO.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Account account = new Account();
        account.setAccountName(accountDTO.getAccountName());
        account.setEmail(accountDTO.getEmail());
        // Default password same as email or a generated one; adjust as needed
        String defaultPassword = accountDTO.getEmail();
        account.setPassword(passwordEncoder.encode(defaultPassword));
        account.setRole(role);

        Account savedAccount = accountRepository.save(account);
        return savedAccount;
    }

    @Override
    public Account getAccountEntityById(String id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Override
    public AccountDTO saveAccountEntity(Account account) {
        Account saved = accountRepository.save(account);
        return convertToDTO(saved);
    }

    private AccountDTO convertToDTO(Account account) {
        return new AccountDTO(
                account.getId(),
                account.getAccountName(),
                account.getEmail(),
                account.getRole().getId(),
                account.getRole().getRoleName()
        );
    }
}