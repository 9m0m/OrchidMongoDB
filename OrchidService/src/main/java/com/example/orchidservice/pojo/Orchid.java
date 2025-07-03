package com.example.orchidservice.pojo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "orchids")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orchid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orchid_id")
    private Integer orchidId;

    @Column(name = "is_natural")
    private Boolean isNatural = true;

    @Column(name = "orchid_description", columnDefinition = "TEXT")
    private String orchidDescription;

    @Column(name = "orchid_name", nullable = false)
    private String orchidName;

    @Column(name = "orchid_url", length = 500)
    private String orchidUrl;

    @Column(name = "price")
    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "orchid", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;
}
