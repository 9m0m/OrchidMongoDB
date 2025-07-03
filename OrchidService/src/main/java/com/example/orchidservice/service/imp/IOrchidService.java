package com.example.orchidservice.service.imp;

import com.example.orchidservice.dto.OrchidDTO;
import com.example.orchidservice.pojo.Orchid;
import java.util.List;
import java.util.Optional;

public interface IOrchidService {
    List<OrchidDTO> getAllOrchids();
    Optional<OrchidDTO> getOrchidById(Integer id);
    OrchidDTO saveOrchid(OrchidDTO orchidDTO);
    OrchidDTO updateOrchid(Integer id, OrchidDTO orchidDTO);
    void deleteOrchid(Integer id);
    List<OrchidDTO> getOrchidsByCategory(Integer categoryId);
    List<OrchidDTO> searchOrchidsByName(String name);
    List<OrchidDTO> getOrchidsByPriceRange(Double minPrice, Double maxPrice);
    List<OrchidDTO> getOrchidsByNaturalType(Boolean isNatural);
}
