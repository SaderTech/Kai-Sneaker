package com.quanghao.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class OrderResponseDTO {
    private Long id;
    private String fullName;
    private String phone;
    private String shippingAddress;
    private BigDecimal totalAmount;
    private String orderStatus;
    private String paymentStatus;
    private String note;
    private String paymentMethodName;
    private Instant createdAt;
    private List<OrderItemResponseDTO> items;
}
