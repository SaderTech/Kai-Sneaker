package com.quanghao.backend.dto;

import lombok.Data;

@Data
public class AddToCartRequestDTO {
    private Long variantId;
    private Integer quantity;
}
