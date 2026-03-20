package com.quanghao.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class OrderDTO {
    private Long id;
    private String fullName;
    private String phone;
    private String shippingAddress;
    private String note;
    private String orderStatus;
    private String paymentStatus;
    private String paymentMethod;
    private Instant createdAt;
    private BigDecimal totalAmount;
    private List<OrderItemDTO> items;
}
