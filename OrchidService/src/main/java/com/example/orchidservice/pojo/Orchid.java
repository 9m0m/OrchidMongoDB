package com.example.orchidservice.pojo;

    import org.springframework.data.annotation.Id;
    import org.springframework.data.mongodb.core.mapping.Document;
    import org.springframework.data.mongodb.core.mapping.DBRef;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;
    import java.util.List;

    @Document(collection = "orchids")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Orchid {
        @Id
        private String id;

        private Boolean isNatural = true;
        private String orchidDescription;
        private String orchidName;
        private String orchidUrl;
        private Double price;

        @DBRef
        private Category category;

        @DBRef
        private List<OrderDetail> orderDetails;
    }