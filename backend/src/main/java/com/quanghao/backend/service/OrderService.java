package com.quanghao.backend.service;

import com.quanghao.backend.dto.CheckoutRequestDTO;
import com.quanghao.backend.dto.OrderDTO;
import com.quanghao.backend.dto.OrderResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(String email, CheckoutRequestDTO requestDTO);
    List<OrderResponseDTO> getOrderHistory(String email);
    OrderDTO cancelOrder(Long orderId, String email);

    Page<OrderResponseDTO> getAllOrders(Pageable pageable,Long orderId);

    void updateStatus(Long id, String status);

    void updatePaymentStatus(Long id, String status);
}
