package com.quanghao.backend.service;

import com.quanghao.backend.dto.CheckoutRequestDTO;
import com.quanghao.backend.dto.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(Long userId, CheckoutRequestDTO requestDTO);
    List<OrderDTO> getOrderHistory(Long userId);
    OrderDTO cancelOrder(Long orderId, Long userId);
}
