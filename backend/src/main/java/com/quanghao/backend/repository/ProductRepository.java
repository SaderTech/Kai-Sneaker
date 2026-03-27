package com.quanghao.backend.repository;

import com.quanghao.backend.dto.CategoryDTO;
import com.quanghao.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findById(Long id);

    List<Product> findTop8ByIsDeletedFalseOrderByCreatedAtDesc();

    List<Product> findTop8ByIsDeletedFalseOrderByPriceDesc();

    List<Product> findTop8ByBrandIdAndIsDeletedFalseOrderByCreatedAtDesc(Long id);

    Page<Product> findByNameContainingIgnoreCaseAndIsDeletedFalse(String name, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN p.variants v " +
            "WHERE p.brand.id = :brandId " +
            "AND (:catId IS NULL OR p.category.id = :catId) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "AND (:size IS NULL OR v.size = :size) " +
            "AND p.isDeleted = false")
    Page<Product> findByBrandAndFilters(
            @Param("brandId") Long brandId,
            @Param("catId") Long catId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("size") String size,
            Pageable pageable
    );

    @Query("SELECT DISTINCT v.size FROM ProductVariant v WHERE v.product.brand.id = :brandId")
    List<String> findUniqueSizesByBrand(@Param("brandId") Long brandId);

    @Query("SELECT DISTINCT new com.quanghao.backend.dto.CategoryDTO(c.id, c.name) " +
            "FROM Product p JOIN p.category c " +
            "WHERE p.brand.id = :brandId AND p.isDeleted = false")
    List<CategoryDTO> findUniqueCategoriesByBrand(@Param("brandId") Long brandId);

@Query("SELECT p FROM Product p " +
        "WHERE p.category.id = :categoryId " +
        "AND p.id != :productId " +
        "AND p.isDeleted = false " +
        "ORDER BY p.createdAt DESC")
List<Product> findRelatedProducts(
        @Param("categoryId") Long categoryId,
        @Param("productId") Long productId,
        Pageable pageable);

    Page<Product> findByIsDeletedFalse(Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN p.variants v WHERE p.category.id = :categoryId AND p.isDeleted = false " +
            "AND (:size IS NULL OR v.size = :size) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> findProductsByCategoryAndFilters(
            @Param("categoryId") Long categoryId,
            @Param("size") String size,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN p.variants v " +
            "WHERE p.isDeleted = false " +
            "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
            "AND (:brandId IS NULL OR p.brand.id = :brandId) " +
            "AND (:size IS NULL OR v.size = :size) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> findProductsWithFilters(
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("size") String size,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable);

    long count();
    boolean existsByCategoryId(Long categoryId);
    boolean existsByBrandId(Long brandId);

    List<Product> findAllByIsDeletedFalse();
}