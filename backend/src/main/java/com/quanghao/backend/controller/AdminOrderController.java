package com.quanghao.backend.controller;

import com.quanghao.backend.dto.OrderResponseDTO;
import com.quanghao.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/kaisneaker/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<OrderResponseDTO>> getOrders(@RequestParam(required = false) Long orderId,@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(orderService.getAllOrders(pageable, orderId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        orderService.updateStatus(id, status);
        return ResponseEntity.ok("Đã cập nhật đơn hàng thành: " + status);
    }

    @PutMapping("/{id}/payment-status")
    public ResponseEntity<String> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        orderService.updatePaymentStatus(id, status);
        return ResponseEntity.ok("Đã cập nhật trạng thái thanh toán: " + status);
    }
}
