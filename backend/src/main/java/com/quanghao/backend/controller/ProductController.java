package com.quanghao.backend.controller;

import com.quanghao.backend.dto.ProductDetailDTO;
import com.quanghao.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kaisneaker/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProductDetail(@PathVariable Long id){
        return ResponseEntity.ok(productService.getProductDetail(id));
    }
}
