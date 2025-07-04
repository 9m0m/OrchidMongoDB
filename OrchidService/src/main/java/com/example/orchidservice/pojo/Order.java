package com.example.orchidservice.pojo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.time.LocalDate;

@Document(collection = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    private String id;

    @DBRef
    private Account account;

    private LocalDate orderDate;
    private String orderStatus = "pending";
    private Double totalAmount;

    @DBRef
    private List<OrderDetail> orderDetails;
}