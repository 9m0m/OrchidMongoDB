package com.example.orchidservice.service.imp;

import com.example.orchidservice.dto.AccountDTO;
import com.example.orchidservice.dto.LoginRequestDTO;
import com.example.orchidservice.dto.LoginResponseDTO;
import com.example.orchidservice.dto.RegisterRequestDTO;
import com.example.orchidservice.dto.RegisterResponseDTO;
import com.example.orchidservice.pojo.Account;

import java.util.List;

public interface IAccountService {
    RegisterResponseDTO register(RegisterRequestDTO request);
    LoginResponseDTO login(LoginRequestDTO request);
    AccountDTO getAccountById(String id);
    List<AccountDTO> getAllAccounts();
    AccountDTO updateAccount(String id, AccountDTO accountDTO);
    void deleteAccount(String id);
    Account findByEmail(String email);
    void logout(String token); 
    Account createAccount(AccountDTO accountDTO);
}
