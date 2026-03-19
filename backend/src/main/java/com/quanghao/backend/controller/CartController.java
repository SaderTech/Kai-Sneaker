package com.quanghao.backend.controller;

import com.quanghao.backend.dto.AddToCartRequestDTO;
import com.quanghao.backend.dto.CartDTO;
import com.quanghao.backend.entity.Cart;
import com.quanghao.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kaisneaker/carts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(cartService.getUserCart(email));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart( @RequestBody AddToCartRequestDTO requestDTO){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(cartService.addToCart(email, requestDTO));
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<CartDTO> updateQuantity(@PathVariable Long cartItemId, @RequestParam Integer quantity){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(cartService.updateQuantity(email,cartItemId,quantity));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<CartDTO> removeItem( @PathVariable Long cartItemId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(cartService.removeFromCart(email, cartItemId));
    }
}
