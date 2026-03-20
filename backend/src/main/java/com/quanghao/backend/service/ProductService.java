package com.quanghao.backend.service;

import com.quanghao.backend.dto.*;
import com.quanghao.backend.entity.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    HomePageDTO getHomePageData();

    Page<ProductListDTO> searchProducts(String keyword, Pageable pageable);

    BrandDetailDTO getBrandFullData(Long brandId, Long catId, String priceRange, String size, Pageable pageable);

    ProductDetailDTO getProductDetail(Long productId);

    @Transactional
    Product createProduct(ProductRequestDTO requestDTO);

    Product updateProduct(Long productId, ProductRequestDTO request);

    void deleteProduct(Long productId);
    List<VariantDTO> bulkCreateVariants(Long productId, List<VariantRequestDTO> variantRequests);
    VariantDTO updateVariantQuantity(Long variantId, Integer newQuantity);
}
