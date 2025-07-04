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

    public void initializeData(RoleRepository roleRepository, AccountRepository accountRepository) {
        try {
            // Create SuperAdmin role if not exists
            Role superAdmin = roleRepository.findByRoleName("SuperAdmin");
            if (superAdmin == null) {
                superAdmin = new Role();
                superAdmin.setRoleName("SuperAdmin");
                superAdmin = roleRepository.save(superAdmin);
            }

            // Create Admin role if not exists
            Role admin = roleRepository.findByRoleName("Admin");
            if (admin == null) {
                admin = new Role();
                admin.setRoleName("Admin");
                admin = roleRepository.save(admin);
            }

            // Create User role if not exists
            Role user = roleRepository.findByRoleName("User");
            if (user == null) {
                user = new Role();
                user.setRoleName("User");
                user = roleRepository.save(user);
            }

            // Create default SuperAdmin account if not exists
            if (!accountRepository.existsByEmail("superadmin@gmail.com")) {
                Account defaultAdmin = new Account();
                defaultAdmin.setEmail("superadmin@gmail.com");
                defaultAdmin.setPassword(passwordEncoder.encode("123456"));
                defaultAdmin.setAccountName("SuperAdmin");
                defaultAdmin.setRole(superAdmin);
                accountRepository.save(defaultAdmin);
            }

            System.out.println("Data initialization completed successfully");
        } catch (Exception e) {
            System.err.println("Error during data initialization: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize data", e);
        }
    }
}