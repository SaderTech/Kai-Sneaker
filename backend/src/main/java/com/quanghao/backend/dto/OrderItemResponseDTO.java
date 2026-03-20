package com.quanghao.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponseDTO {
    private String productName;
    private String size;
    private String color;
    private Integer quantity;
    private BigDecimal price;
}