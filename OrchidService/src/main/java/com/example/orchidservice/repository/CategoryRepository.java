package com.example.orchidservice.repository;

import com.example.orchidservice.pojo.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findAll();
    Optional<Category> findById(Integer id);
    Category save(Category category);
    void deleteById(Integer id);
    Optional<Category> findByCategoryName(String categoryName);
}
