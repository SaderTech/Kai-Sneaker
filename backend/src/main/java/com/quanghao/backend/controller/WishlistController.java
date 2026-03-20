package com.quanghao.backend.controller;

import com.quanghao.backend.configuration.SecurityUtils;
import com.quanghao.backend.dto.ProductResponseDTO;
import com.quanghao.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kaisneaker/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;

    @PostMapping("/{productId}")
    public ResponseEntity<String> toggle(@PathVariable Long productId) {
        Long userId = SecurityUtils.getCurrentUserId();
        wishlistService.toggleWishlist(userId, productId);
        return ResponseEntity.ok("Cập nhật Wishlist thành công!");
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getMyWishlist() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(wishlistService.getMyWishlist(userId));
    }
}
