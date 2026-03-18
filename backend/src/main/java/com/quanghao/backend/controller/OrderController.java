package com.quanghao.backend.controller;

import com.quanghao.backend.dto.CheckoutRequestDTO;
import com.quanghao.backend.dto.OrderDTO;
import com.quanghao.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kaisneaker/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout/{userId}")
    public ResponseEntity<OrderDTO> checkout(@PathVariable Long userId, @Valid @RequestBody CheckoutRequestDTO requestDTO){
        return ResponseEntity.ok(orderService.createOrder(userId, requestDTO));
    }
}
