package com.quanghao.backend.controller;

import com.quanghao.backend.dto.BrandDetailDTO;
import com.quanghao.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kaisneaker/brands")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BrandDetailController {
    private final ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<BrandDetailDTO> getBrandDetail(
            @PathVariable Long id,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String priceRange,
            @RequestParam(required = false) String size,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int sizePage){

        Sort sort = switch (sortBy) {
            case "priceAsc" -> Sort.by("price").ascending();
            case "priceDesc" -> Sort.by("price").descending();
            default -> Sort.by("createdAt").descending();
        };

        Pageable pageable = PageRequest.of(page, sizePage, sort);
        return ResponseEntity.ok(productService.getBrandFullData (id, categoryId, priceRange, size,pageable));
    }
}
