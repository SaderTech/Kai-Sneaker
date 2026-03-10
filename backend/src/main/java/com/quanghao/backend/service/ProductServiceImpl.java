package com.quanghao.backend.service;

import com.quanghao.backend.dto.ProductListDTO;
import com.quanghao.backend.entity.Product;
import com.quanghao.backend.repository.ProductRepository;
import com.quanghao.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public List<ProductListDTO> getAllActiveProducts() {
        // Lấy danh sách sản phẩm chưa bị xóa
        List<Product> products = productRepository.findByIsDeletedFalse();

        // Dùng stream để map toàn bộ danh sách sang DTO
        return products.stream()
                .map(this::convertToDTO) // Gọi hàm hỗ trợ ở dưới cho sạch code
                .collect(Collectors.toList());
    }

    @Override
    public ProductListDTO getProductById(Long id) {
        // 1. Tìm sản phẩm đơn lẻ
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giày với ID: " + id));

        // 2. Trả về trực tiếp DTO (Không dùng .stream() ở đây)
        return convertToDTO(product);
    }

    @Override
    public Product getByProductName(String name) {
        return null;
    }

    // Hàm dùng chung để convert Entity sang DTO cho thanh lịch
    private ProductListDTO convertToDTO(Product product) {
        return ProductListDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice()) // Nhớ kiểm tra BigDecimal ở DTO nhé
                .description(product.getDescription())
                .brandName(product.getBrand() != null ? product.getBrand().getName() : "N/A")
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "N/A")
                .build();
    }
}