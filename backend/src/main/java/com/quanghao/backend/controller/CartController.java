package com.quanghao.backend.controller;

import com.quanghao.backend.dto.AddToCartRequestDTO;
import com.quanghao.backend.dto.CartDTO;
import com.quanghao.backend.entity.Cart;
import com.quanghao.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kaisneaker/carts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable Long userId){
        return ResponseEntity.ok(cartService.getUserCart(userId));
    }

    @PostMapping("{userId}/add")
    public ResponseEntity<CartDTO> addToCart(@PathVariable Long userId, @RequestBody AddToCartRequestDTO requestDTO){
        return ResponseEntity.ok(cartService.addToCart(userId, requestDTO));
    }

    @PutMapping("{userId}/update/{cartItemId}")
    public ResponseEntity<CartDTO> updateQuantity(@PathVariable Long userId, @PathVariable Long cartItemId, @RequestParam Integer quantity){
        return ResponseEntity.ok(cartService.updateQuantity(userId,cartItemId,quantity));
    }

    @DeleteMapping("{userId}/remove/{cartItemId}")
    public ResponseEntity<CartDTO> removeItem(@PathVariable Long userId, @PathVariable Long cartItemId){
        return ResponseEntity.ok(cartService.removeFromCart(userId, cartItemId));
    }
}
