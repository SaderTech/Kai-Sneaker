package com.quanghao.backend.service;

import com.quanghao.backend.dto.CheckoutRequestDTO;
import com.quanghao.backend.dto.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(String email, CheckoutRequestDTO requestDTO);
    List<OrderDTO> getOrderHistory(String email);
    OrderDTO cancelOrder(Long orderId, String email);
}
