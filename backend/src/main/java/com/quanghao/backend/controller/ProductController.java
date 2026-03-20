package com.quanghao.backend.controller;

import com.quanghao.backend.dto.ProductDetailDTO;
import com.quanghao.backend.dto.ProductListDTO;
import com.quanghao.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kaisneaker/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProductDetail(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetail(id));
    }

    // 1. SẢN PHẨM MỚI NHẤT
    @GetMapping("/new-arrivals")
    public ResponseEntity<Page<ProductListDTO>> getNewArrivals(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) String priceRange,
            @RequestParam(required = false) String size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int sizePage) {

        // Sort theo ngày tạo mới nhất
        Pageable pageable = PageRequest.of(page, sizePage, Sort.by("createdAt").descending());
        return ResponseEntity.ok(productService.getFilteredProducts(categoryId, brandId, priceRange, size, pageable));
    }

    // 2. SẢN PHẨM NỔI BẬT
    @GetMapping("/featured")
    public ResponseEntity<Page<ProductListDTO>> getFeaturedProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) String priceRange,
            @RequestParam(required = false) String size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int sizePage) {

        // Sort theo giá giảm dần (hoặc lượt view, lượt mua tùy sếp)
        Pageable pageable = PageRequest.of(page, sizePage, Sort.by("price").descending());
        return ResponseEntity.ok(productService.getFilteredProducts(categoryId, brandId, priceRange, size, pageable));
    }
}
