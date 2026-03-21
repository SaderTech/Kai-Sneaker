package com.quanghao.backend.controller;

import com.quanghao.backend.dto.PaymentMethodDTO;
import com.quanghao.backend.entity.PaymentMethod;
import com.quanghao.backend.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/kaisneaker/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodRepository paymentMethodRepository;

    @GetMapping
    public ResponseEntity<List<PaymentMethodDTO>> getAllPaymentMethods() {
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findAll();
        List<PaymentMethodDTO> dtoList = paymentMethods.stream()
                .map(pm -> PaymentMethodDTO.builder()
                        .id(pm.getId())
                        .name(pm.getName())
                        .description(pm.getDescription())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }
}