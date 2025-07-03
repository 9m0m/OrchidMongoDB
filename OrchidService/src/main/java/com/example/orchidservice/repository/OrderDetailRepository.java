package com.example.orchidservice.repository;

import com.example.orchidservice.pojo.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrderId(Integer orderId);
    List<OrderDetail> findByOrchidOrchidId(Integer orchidId);
}
