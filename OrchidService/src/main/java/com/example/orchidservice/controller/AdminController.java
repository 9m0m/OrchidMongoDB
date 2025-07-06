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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
                    .roleId(account.getRoleId())
                    .roleName(account.getRoleName())
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
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable String id) {
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
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable String id, @RequestBody CategoryDTO categoryDTO) {
        try {
            CategoryDTO updated = categoryService.updateCategory(id, categoryDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
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
    public ResponseEntity<OrchidDTO> getOrchidById(@PathVariable String id) {
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
    public ResponseEntity<OrchidDTO> updateOrchid(@PathVariable String id, @RequestBody OrchidDTO orchidDTO) {
        try {
            OrchidDTO updated = orchidService.updateOrchid(id, orchidDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/orchids/{id}")
    public ResponseEntity<Void> deleteOrchid(@PathVariable String id) {
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
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable String id) {
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
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable String id, @RequestBody OrderDTO orderDTO) {
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
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        try {
            orderService.deleteOrder(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> statusUpdate) {
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
                    .roleId(account.getRoleId())
                    .roleName(account.getRoleName())
                    .build())
                .collect(Collectors.toList());
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve accounts: " + e.getMessage()));
        }
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<?> getAccountById(@PathVariable String id) {
        try {
            AccountDTO account = accountService.getAccountById(id);
            return ResponseEntity.ok(account);
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
                .accountId(createdAccount.getId())
                .accountName(createdAccount.getAccountName())
                .email(createdAccount.getEmail())
                .roleId(createdAccount.getRole().getId())
                .roleName(createdAccount.getRole().getRoleName())
                .build();
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Failed to create account: " + e.getMessage()));
        }
    }

    @PutMapping("/accounts/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable String id, @RequestBody AccountDTO accountDTO) {
        try {
            AccountDTO updatedAccount = accountService.updateAccount(id, accountDTO);
            return ResponseEntity.ok(updatedAccount);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update account: " + e.getMessage()));
        }
    }

    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable String id) {
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

    // Update account role with hierarchy rules
    @PatchMapping("/accounts/{accountId}/role")
    public ResponseEntity<?> updateAccountRole(@PathVariable String accountId,
                                               @RequestParam String roleId) {
        try {
            // authenticated admin
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getPrincipal() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
            }

            Account acting = (Account) auth.getPrincipal();
            String actingRole = acting.getRole().getRoleName();

            Account target = accountService.getAccountEntityById(accountId);
            Role newRole = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            // Permission rules
            if ("SUPERADMIN".equalsIgnoreCase(actingRole)) {
                // allowed anything
            } else if ("ADMIN".equalsIgnoreCase(actingRole)) {
                // cannot touch superadmins
                if ("SUPERADMIN".equalsIgnoreCase(target.getRole().getRoleName())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot modify SuperAdmin");
                }
                // can assign only ADMIN or USER
                if (!List.of("ADMIN", "USER").contains(newRole.getRoleName().toUpperCase())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin can assign only ADMIN or USER roles");
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permission");
            }

            target.setRole(newRole);
            AccountDTO updated = accountService.saveAccountEntity(target);
            return ResponseEntity.ok(updated);

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + ex.getMessage());
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
                    roleMap.put("id", role.getId());
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
    public ResponseEntity<?> getRoleById(@PathVariable String id) {
        try {
            Optional<Role> roleOpt = roleRepository.findById(id);
            if (roleOpt.isPresent()) {
                Role role = roleOpt.get();
                Map<String, Object> roleData = new HashMap<>();
                roleData.put("id", role.getId());
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
