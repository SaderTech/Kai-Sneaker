package com.quanghao.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartItemDTO {
    private Long cartItemId;
    private Long variantId;
    private String productName;
    private String size;
    private String color;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subTotal;
    private String imageUrl;
    private Integer stockQuantity;
}
