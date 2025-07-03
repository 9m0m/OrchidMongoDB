package com.example.orchidservice.service.imp;

import com.example.orchidservice.dto.AccountDTO;
import com.example.orchidservice.dto.RegisterRequestDTO;
import com.example.orchidservice.dto.RegisterResponseDTO;
import com.example.orchidservice.dto.LoginRequestDTO;
import com.example.orchidservice.dto.LoginResponseDTO;
import com.example.orchidservice.pojo.Account;

import java.util.List;
import java.util.Optional;

public interface IAccountService {
    List<Account> getAllAccounts();
    Optional<Account> getAccountById(Integer id);
    Account saveAccount(Account account);
    void deleteAccount(Integer id);
    Optional<Account> getAccountByEmail(String email);
    List<Account> getAccountsByRoleId(Integer roleId);
    RegisterResponseDTO register(RegisterRequestDTO request);
    LoginResponseDTO login(LoginRequestDTO request);
    void logout(String token);

    // Admin operations
    Account createAccount(AccountDTO accountDTO);
    Account updateAccount(Integer id, AccountDTO accountDTO);
}
