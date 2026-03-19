package com.quanghao.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VariantRequestDTO {
    private String color;
    private String size;
    private Integer quantity;
}