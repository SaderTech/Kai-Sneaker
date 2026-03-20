package com.quanghao.backend.controller;

import com.quanghao.backend.dto.DashboardDTO;
import com.quanghao.backend.repository.OrderRepository;
import com.quanghao.backend.repository.ProductRepository;
import com.quanghao.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/kaisneaker/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardDTO> getDashboardStarts(){
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        if(totalRevenue == null){
            totalRevenue = BigDecimal.ZERO;
        }

        DashboardDTO starts = DashboardDTO.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .build();
        return ResponseEntity.ok(starts);
    }
}
