package com.example.orchidservice.config;

import com.example.orchidservice.pojo.Account;
import com.example.orchidservice.pojo.Role;
import com.example.orchidservice.repository.AccountRepository;
import com.example.orchidservice.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataInitializationConfig {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase(RoleRepository roleRepository, AccountRepository accountRepository) {
        return args -> {
            initializeData(roleRepository, accountRepository);
        };
    }

    @Transactional
    public void initializeData(RoleRepository roleRepository, AccountRepository accountRepository) {
        try {
            // Create SuperAdmin role if not exists
            Role superAdmin = roleRepository.findById(1)
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setRoleId(1); // Explicitly set ID
                        role.setRoleName("SuperAdmin");
                        return roleRepository.saveAndFlush(role);
                    });

            // Create Admin role if not exists
            roleRepository.findById(2)
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setRoleId(2); // Explicitly set ID
                        role.setRoleName("Admin");
                        return roleRepository.saveAndFlush(role);
                    });

            // Create User role if not exists
            roleRepository.findById(3)
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setRoleId(3); // Explicitly set ID
                        role.setRoleName("User");
                        return roleRepository.saveAndFlush(role);
                    });

            // Create default SuperAdmin account if not exists
            accountRepository.findByEmail("superadmin@gmail.com")
                    .orElseGet(() -> {
                        Account defaultAdmin = new Account();
                        defaultAdmin.setEmail("superadmin@gmail.com");
                        defaultAdmin.setPassword(passwordEncoder.encode("123456"));
                        defaultAdmin.setAccountName("SuperAdmin");
                        defaultAdmin.setRole(superAdmin);
                        return accountRepository.saveAndFlush(defaultAdmin);
                    });
        } catch (Exception e) {
            System.err.println("Error during data initialization: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}