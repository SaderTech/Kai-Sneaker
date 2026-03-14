package com.quanghao.backend.repository;

import com.quanghao.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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

    Optional<Product> findById(Long id);

    // Lay 8 doi giay moi nhap ve
    List<Product> findTop8ByIsDeletedFalseOrderByCreatedAtDesc();

    //Lay 8 doi giay noi bat nhat
    List<Product> findTop8ByIsDeletedFalseOrderByPriceDesc();

    List<Product> findTop4ByBrandIdAndIsDeletedFalseOrderByCreatedAtDesc(Long id);

    Page<Product> findByNameContainingIgnoreCaseAndIsDeletedFalse(String name, Pageable pageable);
}
