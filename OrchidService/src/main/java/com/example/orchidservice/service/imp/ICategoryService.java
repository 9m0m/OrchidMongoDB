package com.example.orchidservice.service.imp;

import com.example.orchidservice.dto.CategoryDTO;
import java.util.List;
import java.util.Optional;

public interface ICategoryService {
    List<CategoryDTO> getAllCategories();
    Optional<CategoryDTO> getCategoryById(Integer id);
    CategoryDTO saveCategory(CategoryDTO categoryDTO);
    CategoryDTO updateCategory(Integer id, CategoryDTO categoryDTO);
    void deleteCategory(Integer id);
    Optional<CategoryDTO> getCategoryByName(String name);
}
