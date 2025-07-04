package com.example.orchidservice.pojo;

    import org.springframework.data.annotation.Id;
    import org.springframework.data.mongodb.core.mapping.Document;
    import org.springframework.data.mongodb.core.mapping.DBRef;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;

    @Document(collection = "order_details")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class OrderDetail {
        @Id
        private String id;

        @DBRef
        private Orchid orchid;

        private Double price;
        private Integer quantity = 1;

        @DBRef
        private Order order;
    }