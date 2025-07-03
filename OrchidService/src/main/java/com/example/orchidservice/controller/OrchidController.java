package com.example.orchidservice.controller;

import com.example.orchidservice.dto.OrchidDTO;
import com.example.orchidservice.service.imp.IOrchidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orchids")
public class OrchidController {

    @Autowired
    private IOrchidService orchidService;

    @GetMapping
    public ResponseEntity<List<OrchidDTO>> getAllOrchids() {
        List<OrchidDTO> orchids = orchidService.getAllOrchids();
        return ResponseEntity.ok(orchids);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrchidDTO> getOrchidById(@PathVariable Integer id) {
        Optional<OrchidDTO> orchid = orchidService.getOrchidById(id);
        return orchid.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<OrchidDTO>> getOrchidsByCategory(@PathVariable Integer categoryId) {
        List<OrchidDTO> orchids = orchidService.getOrchidsByCategory(categoryId);
        return ResponseEntity.ok(orchids);
    }

    @GetMapping("/search")
    public ResponseEntity<List<OrchidDTO>> searchOrchids(@RequestParam String name) {
        List<OrchidDTO> orchids = orchidService.searchOrchidsByName(name);
        return ResponseEntity.ok(orchids);
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<OrchidDTO>> getOrchidsByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        List<OrchidDTO> orchids = orchidService.getOrchidsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(orchids);
    }

    @GetMapping("/natural/{isNatural}")
    public ResponseEntity<List<OrchidDTO>> getOrchidsByNaturalType(@PathVariable Boolean isNatural) {
        List<OrchidDTO> orchids = orchidService.getOrchidsByNaturalType(isNatural);
        return ResponseEntity.ok(orchids);
    }
}