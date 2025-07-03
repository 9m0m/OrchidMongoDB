package com.example.orchidservice.controller;

import com.example.orchidservice.dto.AccountDTO;
import com.example.orchidservice.dto.CategoryDTO;
import com.example.orchidservice.dto.OrchidDTO;
import com.example.orchidservice.dto.OrderDTO;
import com.example.orchidservice.pojo.Account;
import com.example.orchidservice.pojo.Role;
import com.example.orchidservice.service.imp.IAccountService;
import com.example.orchidservice.service.imp.ICategoryService;
import com.example.orchidservice.service.imp.IOrchidService;
import com.example.orchidservice.service.imp.IOrderService;
import com.example.orchidservice.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
public class AdminController {

    @Autowired
    private ICategoryService categoryService;

    @Autowired
    private IOrchidService orchidService;

    @Autowired
    private IOrderService orderService;

    @Autowired
    private IAccountService accountService;
    @Autowired
    private RoleRepository roleRepository;

    // Dashboard endpoint
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData() {
        try {
            // You can customize this to return whatever dashboard data you need
            return ResponseEntity.ok(Map.of(
                "totalOrchids", orchidService.getAllOrchids().size(),
                "totalOrders", orderService.getAllOrders().size(),
                "totalUsers", accountService.getAllAccounts().size(),
                "message", "Dashboard data retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve dashboard data: " + e.getMessage()));
        }
    }

    // Get all users endpoint (renamed from employees to users)
    @GetMapping("/employees")
    public ResponseEntity<?> getAllEmployees() {
        try {
            List<AccountDTO> users = accountService.getAllAccounts().stream()
                .map(account -> AccountDTO.builder()
                    .accountId(account.getAccountId())
                    .accountName(account.getAccountName())
                    .email(account.getEmail())
                    .roleId(account.getRole().getRoleId())
                    .roleName(account.getRole().getRoleName())
                    .build())
                .collect(Collectors.toList());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve users: " + e.getMessage()));
        }
    }

    // Category CRUD Operations
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Integer id) {
        Optional<CategoryDTO> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO categoryDTO) {
        try {
            CategoryDTO created = categoryService.saveCategory(categoryDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Integer id, @RequestBody CategoryDTO categoryDTO) {
        try {
            CategoryDTO updated = categoryService.updateCategory(id, categoryDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // Orchid CRUD Operations
    @GetMapping("/orchids")
    public ResponseEntity<List<OrchidDTO>> getAllOrchids() {
        List<OrchidDTO> orchids = orchidService.getAllOrchids();
        return ResponseEntity.ok(orchids);
    }

    @GetMapping("/orchids/{id}")
    public ResponseEntity<OrchidDTO> getOrchidById(@PathVariable Integer id) {
        Optional<OrchidDTO> orchid = orchidService.getOrchidById(id);
        return orchid.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/orchids")
    public ResponseEntity<OrchidDTO> createOrchid(@RequestBody OrchidDTO orchidDTO) {
        try {
            OrchidDTO created = orchidService.saveOrchid(orchidDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/orchids/{id}")
    public ResponseEntity<OrchidDTO> updateOrchid(@PathVariable Integer id, @RequestBody OrchidDTO orchidDTO) {
        try {
            OrchidDTO updated = orchidService.updateOrchid(id, orchidDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/orchids/{id}")
    public ResponseEntity<Void> deleteOrchid(@PathVariable Integer id) {
        orchidService.deleteOrchid(id);
        return ResponseEntity.noContent().build();
    }

    // Order CRUD Operations
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        try {
            List<OrderDTO> orders = orderService.getAllOrders();
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Integer id) {
        try {
            Optional<OrderDTO> order = orderService.getOrderById(id);
            return order.map(o -> new ResponseEntity<>(o, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO savedOrder = orderService.saveOrder(orderDTO);
            return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/orders/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Integer id, @RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO updatedOrder = orderService.updateOrder(id, orderDTO);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        try {
            orderService.deleteOrder(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Integer id, @RequestBody Map<String, String> statusUpdate) {
        try {
            String newStatus = statusUpdate.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            OrderDTO updatedOrder = orderService.updateOrderStatus(id, newStatus);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Account/User Management Operations
    @GetMapping("/accounts")
    public ResponseEntity<?> getAllAccounts() {
        try {
            List<AccountDTO> accounts = accountService.getAllAccounts().stream()
                .map(account -> AccountDTO.builder()
                    .accountId(account.getAccountId())
                    .accountName(account.getAccountName())
                    .email(account.getEmail())
                    .roleId(account.getRole().getRoleId())
                    .roleName(account.getRole().getRoleName())
                    .build())
                .collect(Collectors.toList());
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve accounts: " + e.getMessage()));
        }
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<?> getAccountById(@PathVariable Integer id) {
        try {
            Optional<Account> accountOpt = accountService.getAccountById(id);
            if (accountOpt.isPresent()) {
                Account account = accountOpt.get();
                AccountDTO accountDTO = AccountDTO.builder()
                    .accountId(account.getAccountId())
                    .accountName(account.getAccountName())
                    .email(account.getEmail())
                    .roleId(account.getRole().getRoleId())
                    .roleName(account.getRole().getRoleName())
                    .build();
                return ResponseEntity.ok(accountDTO);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve account: " + e.getMessage()));
        }
    }

    @PostMapping("/accounts")
    public ResponseEntity<?> createAccount(@RequestBody AccountDTO accountDTO) {
        try {
            Account createdAccount = accountService.createAccount(accountDTO);
            AccountDTO responseDTO = AccountDTO.builder()
                .accountId(createdAccount.getAccountId())
                .accountName(createdAccount.getAccountName())
                .email(createdAccount.getEmail())
                .roleId(createdAccount.getRole().getRoleId())
                .roleName(createdAccount.getRole().getRoleName())
                .build();
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Failed to create account: " + e.getMessage()));
        }
    }

    @PutMapping("/accounts/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Integer id, @RequestBody AccountDTO accountDTO) {
        try {
            Account updatedAccount = accountService.updateAccount(id, accountDTO);
            AccountDTO responseDTO = AccountDTO.builder()
                .accountId(updatedAccount.getAccountId())
                .accountName(updatedAccount.getAccountName())
                .email(updatedAccount.getEmail())
                .roleId(updatedAccount.getRole().getRoleId())
                .roleName(updatedAccount.getRole().getRoleName())
                .build();
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update account: " + e.getMessage()));
        }
    }

    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Integer id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete account: " + e.getMessage()));
        }
    }

    // Role Management Operations
    @GetMapping("/roles")
    public ResponseEntity<?> getAllRoles() {
        try {
            List<Role> roles = roleRepository.findAll();
            List<Map<String, Object>> roleData = roles.stream()
                .map(role -> {
                    Map<String, Object> roleMap = new HashMap<>();
                    roleMap.put("id", role.getRoleId());
                    roleMap.put("name", role.getRoleName());
                    return roleMap;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(roleData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve roles: " + e.getMessage()));
        }
    }

    @GetMapping("/roles/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable Integer id) {
        try {
            Optional<Role> roleOpt = roleRepository.findById(id);
            if (roleOpt.isPresent()) {
                Role role = roleOpt.get();
                Map<String, Object> roleData = new HashMap<>();
                roleData.put("id", role.getRoleId());
                roleData.put("name", role.getRoleName());
                return ResponseEntity.ok(roleData);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve role: " + e.getMessage()));
        }
    }
}
