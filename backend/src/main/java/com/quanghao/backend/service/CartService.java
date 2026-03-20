package com.quanghao.backend.service;

import com.quanghao.backend.dto.AddToCartRequestDTO;
import com.quanghao.backend.dto.CartDTO;

public interface CartService {
    CartDTO addToCart(String email, AddToCartRequestDTO requestDTO);
    CartDTO getUserCart(String email);
    CartDTO updateQuantity(String email, Long cartItemId, Integer newQuantity);
    CartDTO removeFromCart(String email, Long cartItemId);
}
