package com.example.orchidservice.repository;

import com.example.orchidservice.pojo.Orchid;
import com.example.orchidservice.pojo.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrchidRepository extends MongoRepository<Orchid, String> {
    List<Orchid> findByCategory(Category category);
    List<Orchid> findByOrchidNameContainingIgnoreCase(String name);
    List<Orchid> findByPriceBetween(Double minPrice, Double maxPrice);
    List<Orchid> findByIsNatural(Boolean isNatural);
}