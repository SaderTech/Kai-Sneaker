package com.quanghao.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductListDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
    private String brandName;
    private String categoryName;
    private String imageUrls;
}
