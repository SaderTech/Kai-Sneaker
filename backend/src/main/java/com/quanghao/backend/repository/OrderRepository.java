package com.quanghao.backend.repository;

import com.quanghao.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    long count();
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderStatus = 'DELIVERED'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COUNT(o) > 0 FROM Order o " +
            "JOIN o.orderItems oi " +
            "WHERE o.user.id = :userId " +
            "AND oi.variant.product.id = :productId " +
            "AND o.orderStatus = 'COMPLETED'")
    boolean hasPurchasedProduct(@Param("userId") Long userId, @Param("productId") Long productId);

    @Query("SELECT COUNT(o) > 0 FROM Order o " +
            "JOIN o.orderItems i " +
            "WHERE o.user.id = :userId " +
            "AND i.variant.product.id = :productId " +
            "AND (o.orderStatus = 'DELIVERED' OR o.orderStatus = 'COMPLETED')")
    boolean existsCompletedOrder(@Param("userId") Long userId, @Param("productId") Long productId);
}
