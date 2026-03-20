package com.quanghao.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VariantDTO {
    private Long id;
    private String size;
    private String color;
    private Integer quantity;
}
