package com.quanghao.backend.service;

import com.quanghao.backend.dto.AddToCartRequestDTO;
import com.quanghao.backend.dto.CartDTO;

public interface CartService {
    CartDTO addToCart(Long userId, AddToCartRequestDTO requestDTO);
    CartDTO getUserCart(Long userId);
}
