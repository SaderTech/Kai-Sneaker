package com.quanghao.backend.repository;

import com.quanghao.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Tìm tất cả giày theo thương hiệu (Nike, Adidas...)
    List<Product> findByBrandId(Long brandId);

    // Tìm giày theo danh mục (Running, Lifestyle...)
    List<Product> findByCategoryId(Long categoryId);

    // Tìm kiếm giày theo tên (Dùng cho thanh Search của Hào)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Lấy những đôi giày chưa bị xóa (is_deleted = false)
    List<Product> findByIsDeletedFalse();
}
