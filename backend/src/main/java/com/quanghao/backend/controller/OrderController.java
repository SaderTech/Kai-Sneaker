package com.quanghao.backend.controller;

import com.quanghao.backend.dto.CheckoutRequestDTO;
import com.quanghao.backend.dto.OrderDTO;
import com.quanghao.backend.entity.Order;
import com.quanghao.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kaisneaker/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private final OrderService orderService;

    @PostMapping("/checkout/{userId}")
    public ResponseEntity<OrderDTO> checkout(@PathVariable Long userId, @Valid @RequestBody CheckoutRequestDTO requestDTO){
        return ResponseEntity.ok(orderService.createOrder(userId, requestDTO));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrderHistory(@PathVariable Long userId){
        List<OrderDTO> history = orderService.getOrderHistory(userId);
        return ResponseEntity.ok(history);
    }
}
