package com.example.orchidservice.repository;

import com.example.orchidservice.pojo.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    // Find orders by account ID (using DBRef)
    List<Order> findByAccount_Id(String accountId);

    // Find orders by status
    List<Order> findByOrderStatus(String orderStatus);

    // Find orders between two dates
    List<Order> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);

    // Find orders by account and status
    List<Order> findByAccount_IdAndOrderStatus(String accountId, String orderStatus);

    // Find orders by account and date range
    List<Order> findByAccount_IdAndOrderDateBetween(String accountId, LocalDate startDate, LocalDate endDate);
}