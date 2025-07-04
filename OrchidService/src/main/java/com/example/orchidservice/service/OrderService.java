package com.example.orchidservice.service;

import com.example.orchidservice.dto.OrderDTO;
import com.example.orchidservice.dto.OrderDetailDTO;
import com.example.orchidservice.pojo.Order;
import com.example.orchidservice.pojo.OrderDetail;
import com.example.orchidservice.pojo.Account;
import com.example.orchidservice.pojo.Orchid;
import com.example.orchidservice.repository.OrderRepository;
import com.example.orchidservice.repository.AccountRepository;
import com.example.orchidservice.repository.OrchidRepository;
import com.example.orchidservice.service.imp.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService implements IOrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private OrchidRepository orchidRepository;

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<OrderDTO> getOrderById(String id) {
        return orderRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public OrderDTO saveOrder(OrderDTO orderDTO) {
        Order order = convertToEntity(orderDTO);

        // Set order date if not provided
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDate.now());
        }

        // Calculate total amount
        Double totalAmount = calculateTotalFromDetails(orderDTO.getOrderDetails());
        order.setTotalAmount(totalAmount);

        Order saved = orderRepository.save(order);
        return convertToDTO(saved);
    }

    @Override
    public OrderDTO updateOrder(String id, OrderDTO orderDTO) {
        Optional<Order> existing = orderRepository.findById(id);
        if (existing.isPresent()) {
            Order order = existing.get();
            order.setOrderStatus(orderDTO.getOrderStatus());

            // Update account if provided
            if (orderDTO.getAccountId() != null) {
                Account account = accountRepository.findById(orderDTO.getAccountId())
                        .orElseThrow(() -> new RuntimeException("Account not found"));
                order.setAccount(account);
            }

            // Recalculate total if order details are updated
            if (orderDTO.getOrderDetails() != null) {
                Double totalAmount = calculateTotalFromDetails(orderDTO.getOrderDetails());
                order.setTotalAmount(totalAmount);
            }

            Order updated = orderRepository.save(order);
            return convertToDTO(updated);
        }
        throw new RuntimeException("Order not found with id: " + id);
    }

    @Override
    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }

    @Override
    public List<OrderDTO> getOrdersByAccount(String accountId) {
        return orderRepository.findByAccount_Id(accountId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByStatus(String status) {
        return orderRepository.findByOrderStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByDateRange(LocalDate startDate, LocalDate endDate) {
        return orderRepository.findByOrderDateBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO updateOrderStatus(String id, String status) {
        Optional<Order> existing = orderRepository.findById(id);
        if (existing.isPresent()) {
            Order order = existing.get();
            order.setOrderStatus(status);
            Order updated = orderRepository.save(order);
            return convertToDTO(updated);
        }
        throw new RuntimeException("Order not found with id: " + id);
    }

    @Override
    public Double calculateOrderTotal(String orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isPresent()) {
            return order.get().getOrderDetails().stream()
                    .mapToDouble(detail -> detail.getPrice() * detail.getQuantity())
                    .sum();
        }
        throw new RuntimeException("Order not found with id: " + orderId);
    }

    private Double calculateTotalFromDetails(List<OrderDetailDTO> orderDetails) {
        if (orderDetails == null || orderDetails.isEmpty()) {
            return 0.0;
        }
        return orderDetails.stream()
                .mapToDouble(detail -> detail.getUnitPrice() * detail.getQuantity())
                .sum();
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getId());
        dto.setAccountId(order.getAccount() != null ? order.getAccount().getId() : null);
        dto.setAccountName(order.getAccount() != null ? order.getAccount().getAccountName() : null);
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setTotalAmount(order.getTotalAmount());

        if (order.getOrderDetails() != null) {
            List<OrderDetailDTO> detailDTOs = order.getOrderDetails().stream()
                    .map(this::convertOrderDetailToDTO)
                    .collect(Collectors.toList());
            dto.setOrderDetails(detailDTOs);
        }

        return dto;
    }

    private Order convertToEntity(OrderDTO orderDTO) {
        Order order = new Order();
        order.setId(orderDTO.getOrderId());
        order.setOrderDate(orderDTO.getOrderDate());
        order.setOrderStatus(orderDTO.getOrderStatus());
        order.setTotalAmount(orderDTO.getTotalAmount());

        // Set account if provided
        if (orderDTO.getAccountId() != null) {
            Account account = accountRepository.findById(orderDTO.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            order.setAccount(account);
        }

        // Convert order details if provided
        if (orderDTO.getOrderDetails() != null) {
            List<OrderDetail> orderDetails = orderDTO.getOrderDetails().stream()
                    .map(detailDTO -> convertOrderDetailToEntity(detailDTO, order))
                    .collect(Collectors.toList());
            order.setOrderDetails(orderDetails);
        }

        return order;
    }

    private OrderDetailDTO convertOrderDetailToDTO(OrderDetail orderDetail) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderDetailId(orderDetail.getId());
        dto.setOrderId(orderDetail.getOrder() != null ? orderDetail.getOrder().getId() : null);
        dto.setOrchidId(orderDetail.getOrchid() != null ? orderDetail.getOrchid().getId() : null);
        dto.setOrchidName(orderDetail.getOrchid() != null ? orderDetail.getOrchid().getOrchidName() : null);
        dto.setUnitPrice(orderDetail.getPrice());
        dto.setQuantity(orderDetail.getQuantity());
        dto.setSubtotal(orderDetail.getPrice() * orderDetail.getQuantity());
        return dto;
    }

    private OrderDetail convertOrderDetailToEntity(OrderDetailDTO detailDTO, Order order) {
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setId(detailDTO.getOrderDetailId());
        orderDetail.setPrice(detailDTO.getUnitPrice());
        orderDetail.setQuantity(detailDTO.getQuantity());
        orderDetail.setOrder(order);

        // Set orchid if provided
        if (detailDTO.getOrchidId() != null) {
            Orchid orchid = orchidRepository.findById(detailDTO.getOrchidId())
                    .orElseThrow(() -> new RuntimeException("Orchid not found"));
            orderDetail.setOrchid(orchid);
        }

        return orderDetail;
    }
}