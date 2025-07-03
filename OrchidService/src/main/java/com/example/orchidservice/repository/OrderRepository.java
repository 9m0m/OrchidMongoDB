package com.example.orchidservice.repository;

import com.example.orchidservice.pojo.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByAccount_AccountId(Integer accountId);

    List<Order> findByOrderStatus(String orderStatus);

    List<Order> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);

    List<Order> findByOrderDate(LocalDate orderDate);

}
