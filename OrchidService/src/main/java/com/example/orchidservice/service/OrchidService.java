package com.example.orchidservice.service;

import com.example.orchidservice.dto.OrchidDTO;
import com.example.orchidservice.pojo.Orchid;
import com.example.orchidservice.pojo.Category;
import com.example.orchidservice.repository.OrchidRepository;
import com.example.orchidservice.repository.CategoryRepository;
import com.example.orchidservice.service.imp.IOrchidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrchidService implements IOrchidService {

    @Autowired
    private OrchidRepository orchidRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<OrchidDTO> getAllOrchids() {
        return orchidRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<OrchidDTO> getOrchidById(String id) {
        return orchidRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public OrchidDTO saveOrchid(OrchidDTO orchidDTO) {
        Orchid orchid = new Orchid();
        orchid.setOrchidName(orchidDTO.getOrchidName());
        orchid.setOrchidDescription(orchidDTO.getOrchidDescription());
        orchid.setPrice(orchidDTO.getPrice());
        orchid.setOrchidUrl(orchidDTO.getOrchidUrl());
        orchid.setIsNatural(orchidDTO.getIsNatural());

        if (orchidDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(orchidDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + orchidDTO.getCategoryId()));
            orchid.setCategory(category);
            // Set category name in DTO
            orchidDTO.setCategoryName(category.getCategoryName());
        }

        // Don't set ID for new entity
        orchid.setId(null);

        Orchid saved = orchidRepository.save(orchid);
        return convertToDTO(saved);
    }

    @Override
    public OrchidDTO updateOrchid(String id, OrchidDTO orchidDTO) {
        Optional<Orchid> existing = orchidRepository.findById(id);
        if (existing.isPresent()) {
            Orchid orchid = existing.get();
            orchid.setOrchidName(orchidDTO.getOrchidName());
            orchid.setOrchidDescription(orchidDTO.getOrchidDescription());
            orchid.setPrice(orchidDTO.getPrice());
            orchid.setOrchidUrl(orchidDTO.getOrchidUrl());
            orchid.setIsNatural(orchidDTO.getIsNatural());

            if (orchidDTO.getCategoryId() != null) {
                Category category = categoryRepository.findById(orchidDTO.getCategoryId())
                        .orElseThrow(() -> new RuntimeException("Category not found"));
                orchid.setCategory(category);
            }

            Orchid updated = orchidRepository.save(orchid);
            return convertToDTO(updated);
        }
        throw new RuntimeException("Orchid not found with id: " + id);
    }

    @Override
    public void deleteOrchid(String id) {
        orchidRepository.deleteById(id);
    }

    @Override
    public List<OrchidDTO> getOrchidsByCategory(String categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

        return orchidRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrchidDTO> searchOrchidsByName(String name) {
        return orchidRepository.findByOrchidNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrchidDTO> getOrchidsByPriceRange(Double minPrice, Double maxPrice) {
        return orchidRepository.findByPriceBetween(minPrice, maxPrice).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrchidDTO> getOrchidsByNaturalType(Boolean isNatural) {
        return orchidRepository.findByIsNatural(isNatural).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private OrchidDTO convertToDTO(Orchid orchid) {
        OrchidDTO dto = new OrchidDTO();
        dto.setOrchidId(orchid.getId()); // Use orchid.getId() instead of getOrchidId()
        dto.setOrchidName(orchid.getOrchidName());
        dto.setOrchidDescription(orchid.getOrchidDescription());
        dto.setPrice(orchid.getPrice());
        dto.setOrchidUrl(orchid.getOrchidUrl());
        dto.setIsNatural(orchid.getIsNatural());

        // Safely handle category
        if (orchid.getCategory() != null) {
            dto.setCategoryId(orchid.getCategory().getId()); // Use getId() instead of getCategoryId()
            dto.setCategoryName(orchid.getCategory().getCategoryName());
        }

        return dto;
    }

    private Orchid convertToEntity(OrchidDTO dto) {
        Orchid orchid = new Orchid();
        orchid.setId(dto.getOrchidId());
        orchid.setOrchidName(dto.getOrchidName());
        orchid.setOrchidDescription(dto.getOrchidDescription());
        orchid.setPrice(dto.getPrice());
        orchid.setOrchidUrl(dto.getOrchidUrl());
        orchid.setIsNatural(dto.getIsNatural());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            orchid.setCategory(category);
        }

        return orchid;
    }
}
