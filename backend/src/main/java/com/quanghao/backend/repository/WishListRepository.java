package com.quanghao.backend.repository;

import com.quanghao.backend.entity.Wishlist;
import com.quanghao.backend.entity.WishlistId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishListRepository extends JpaRepository<Wishlist, WishlistId> {
    boolean existsById(WishlistId id);
    List<Wishlist> findByUser_Id(Long userId);
    void deleteById(WishlistId id);
}
