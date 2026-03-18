package com.quanghao.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartDTO {
    private Long cartId;
    private List<CartItemDTO> items;
    private Integer totalItems;
    private BigDecimal totalPrice;
}
