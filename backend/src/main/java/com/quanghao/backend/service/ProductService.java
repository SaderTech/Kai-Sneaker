package com.quanghao.backend.service;

import com.quanghao.backend.dto.HomePageDTO;
import com.quanghao.backend.dto.ProductListDTO;
import com.quanghao.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
//    List<ProductListDTO> getAllActiveProducts();
//    ProductListDTO getProductById(Long id);
//    Product getByProductName(String name);

    HomePageDTO getHomePageData();

    Page<ProductListDTO> searchProducts(String keyword, Pageable pageable);
}
