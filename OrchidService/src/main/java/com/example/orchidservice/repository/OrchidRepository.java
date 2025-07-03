package com.example.orchidservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.orchidservice.pojo.Orchid;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrchidRepository extends JpaRepository<Orchid, Integer> {
    List<Orchid> findByCategoryCategoryId(Integer categoryId);
    List<Orchid> findByOrchidNameContainingIgnoreCase(String name);
    List<Orchid> findByPriceBetween(Double minPrice, Double maxPrice);
    List<Orchid> findByIsNatural(Boolean isNatural);
}
