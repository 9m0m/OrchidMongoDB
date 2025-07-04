package com.example.orchidservice.service.imp;

import com.example.orchidservice.dto.CategoryDTO;
import java.util.List;
import java.util.Optional;

public interface ICategoryService {
    List<CategoryDTO> getAllCategories();
    Optional<CategoryDTO> getCategoryById(String id);
    CategoryDTO saveCategory(CategoryDTO categoryDTO);
    CategoryDTO updateCategory(String id, CategoryDTO categoryDTO);
    void deleteCategory(String id);
    Optional<CategoryDTO> getCategoryByName(String name);
}
