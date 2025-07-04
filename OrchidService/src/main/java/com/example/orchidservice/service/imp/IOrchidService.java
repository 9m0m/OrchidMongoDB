package com.example.orchidservice.service.imp;

import com.example.orchidservice.dto.OrchidDTO;
import java.util.List;
import java.util.Optional;

public interface IOrchidService {
    List<OrchidDTO> getAllOrchids();
    Optional<OrchidDTO> getOrchidById(String id);
    OrchidDTO saveOrchid(OrchidDTO orchidDTO);
    OrchidDTO updateOrchid(String id, OrchidDTO orchidDTO);
    void deleteOrchid(String id);
    List<OrchidDTO> getOrchidsByCategory(String categoryId);
    List<OrchidDTO> searchOrchidsByName(String name);
    List<OrchidDTO> getOrchidsByPriceRange(Double minPrice, Double maxPrice);
    List<OrchidDTO> getOrchidsByNaturalType(Boolean isNatural);
}
