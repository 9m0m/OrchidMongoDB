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
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService implements IAccountService {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Override
    public Optional<Account> getAccountById(Integer id) {
        return accountRepository.findById(id);
    }

    @Override
    @Transactional
    public Account saveAccount(Account account) {
        if (account.getPassword() != null && !account.getPassword().isEmpty()) {
            account.setPassword(passwordEncoder.encode(account.getPassword()));
        }
        return accountRepository.save(account);
    }

    @Override
    @Transactional
    public void deleteAccount(Integer id) {
        accountRepository.deleteById(id);
    }

    @Override
    public Optional<Account> getAccountByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    @Override
    public List<Account> getAccountsByRoleId(Integer roleId) {
        return accountRepository.findByRoleRoleId(roleId);
    }

    @Override
    @Transactional
    public RegisterResponseDTO register(RegisterRequestDTO request) {
        // Check if email already exists
        if (accountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        // Get User role (default role)
        Role userRole = roleRepository.findByRoleName("User")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User role not found"));

        Account account = new Account();
        account.setAccountName(request.getAccountName());
        account.setEmail(request.getEmail());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(userRole);

        Account savedAccount = accountRepository.save(account);

        return RegisterResponseDTO.builder()
                .accountId(savedAccount.getAccountId())
                .accountName(savedAccount.getAccountName())
                .email(savedAccount.getEmail())
                .message("Registration successful")
                .build();
    }

    @Override
    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request) {
        Account account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(account);

        return LoginResponseDTO.builder()
                .token(token)
                .accountId(account.getAccountId())
                .accountName(account.getAccountName())
                .email(account.getEmail())
                .roleName(account.getRole().getRoleName())
                .message("Login successful")
                .build();
    }

    @Override
    @Transactional
    public void logout(String token) {
        // Add token to blacklist or invalidate token logic here if needed
        // For now, we'll just let the token expire naturally
    }

    // Admin operations
    @Override
    @Transactional
    public Account createAccount(AccountDTO accountDTO) {
        // Check if email already exists
        if (accountRepository.findByEmail(accountDTO.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        Role role = roleRepository.findById(accountDTO.getRoleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role not found"));

        Account account = new Account();
        account.setAccountName(accountDTO.getAccountName());
        account.setEmail(accountDTO.getEmail());
        account.setPassword(passwordEncoder.encode(accountDTO.getPassword()));
        account.setRole(role);

        return accountRepository.save(account);
    }

    @Override
    @Transactional
    public Account updateAccount(Integer id, AccountDTO accountDTO) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));

        // Check if email is being changed and if the new email already exists
        if (!account.getEmail().equals(accountDTO.getEmail())) {
            if (accountRepository.findByEmail(accountDTO.getEmail()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
            }
        }

        Role role = roleRepository.findById(accountDTO.getRoleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role not found"));

        account.setAccountName(accountDTO.getAccountName());
        account.setEmail(accountDTO.getEmail());

        // Only update password if provided
        if (accountDTO.getPassword() != null && !accountDTO.getPassword().isEmpty()) {
            account.setPassword(passwordEncoder.encode(accountDTO.getPassword()));
        }

        account.setRole(role);

        return accountRepository.save(account);
    }
}