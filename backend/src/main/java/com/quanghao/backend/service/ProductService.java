package com.quanghao.backend.service;

import com.quanghao.backend.dto.BrandDetailDTO;
import com.quanghao.backend.dto.HomePageDTO;
import com.quanghao.backend.dto.ProductDetailDTO;
import com.quanghao.backend.dto.ProductListDTO;
import com.quanghao.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    HomePageDTO getHomePageData();

    Page<ProductListDTO> searchProducts(String keyword, Pageable pageable);

    BrandDetailDTO getBrandFullData(Long brandId, Long catId, String priceRange, String size, Pageable pageable);

    ProductDetailDTO getProductDetail(Long productId);
}
