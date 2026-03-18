package com.quanghao.backend.repository;

import com.quanghao.backend.entity.Cart;
import com.quanghao.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserId(Long userId);

    Long user(User user);
}
