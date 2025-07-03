package com.example.orchidservice.service;

import com.example.orchidservice.dto.CategoryDTO;
import com.example.orchidservice.dto.OrchidDTO;
import com.example.orchidservice.pojo.Category;
import com.example.orchidservice.repository.CategoryRepository;
import com.example.orchidservice.service.imp.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService implements ICategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CategoryDTO> getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setCategoryName(categoryDTO.getCategoryName());
        Category saved = categoryRepository.save(category);
        return convertToDTO(saved);
    }

    @Override
    public CategoryDTO updateCategory(Integer id, CategoryDTO categoryDTO) {
        Optional<Category> existing = categoryRepository.findById(id);
        if (existing.isPresent()) {
            Category category = existing.get();
            category.setCategoryName(categoryDTO.getCategoryName());
            Category updated = categoryRepository.save(category);
            return convertToDTO(updated);
        }
        throw new RuntimeException("Category not found with id: " + id);
    }

    @Override
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public Optional<CategoryDTO> getCategoryByName(String name) {
        return categoryRepository.findByCategoryName(name)
                .map(this::convertToDTO);
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        return dto;
    }

    private Category convertToEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setCategoryId(dto.getCategoryId());
        category.setCategoryName(dto.getCategoryName());
        // Don't set orchids during creation
        return category;
    }
}
