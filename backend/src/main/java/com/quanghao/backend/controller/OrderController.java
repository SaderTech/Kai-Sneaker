package com.quanghao.backend.controller;

import com.quanghao.backend.dto.CheckoutRequestDTO;
import com.quanghao.backend.dto.OrderDTO;
import com.quanghao.backend.entity.Order;
import com.quanghao.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kaisneaker/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> checkout( @Valid @RequestBody CheckoutRequestDTO requestDTO){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(orderService.createOrder(email, requestDTO));
    }

    @GetMapping("/history")
    public ResponseEntity<List<OrderDTO>> getOrderHistory(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(orderService.getOrderHistory(email));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long orderId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(orderService.cancelOrder(orderId, email));
    }
}
