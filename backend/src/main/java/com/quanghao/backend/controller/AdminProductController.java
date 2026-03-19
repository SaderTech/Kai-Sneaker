package com.quanghao.backend.controller;

import com.quanghao.backend.dto.ProductDetailDTO;
import com.quanghao.backend.dto.ProductRequestDTO;
import com.quanghao.backend.dto.VariantDTO;
import com.quanghao.backend.dto.VariantRequestDTO;
import com.quanghao.backend.entity.Product;
import com.quanghao.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/kaisneaker/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDetailDTO> createProduct(@ModelAttribute ProductRequestDTO requestDTO){
        Product savedProduct = productService.createProduct(requestDTO);

        ProductDetailDTO responseDTO = productService.getProductDetail(savedProduct.getId());

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> updateProduct(@PathVariable Long id, @ModelAttribute ProductRequestDTO request) {
        Product updatedProduct = productService.updateProduct(id, request);
        ProductDetailDTO responseDTO = productService.getProductDetail(updatedProduct.getId());
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Đã xóa sản phẩm thành công!");
    }

    @PostMapping("/{productId}/variants")
    public ResponseEntity<?> bulkCreateVariants(
            @PathVariable Long productId,
            @RequestBody List<VariantRequestDTO> variantRequests
    ) {
        try {
            List<VariantDTO> result = productService.bulkCreateVariants(productId, variantRequests);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi thêm biến thể: " + e.getMessage());
        }
    }

    @PutMapping("/variants/{variantId}/inventory")
    public ResponseEntity<?> updateInventory(
            @PathVariable Long variantId,
            @RequestBody java.util.Map<String, Integer> request // Dùng Map hứng JSON luôn cho lẹ
    ) {
        try {
            Integer newQuantity = request.get("quantity");

            if (newQuantity == null || newQuantity < 0) {
                return ResponseEntity.badRequest().body("Số lượng không hợp lệ!");
            }

            VariantDTO result = productService.updateVariantQuantity(variantId, newQuantity);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi cập nhật kho: " + e.getMessage());
        }
    }
}
