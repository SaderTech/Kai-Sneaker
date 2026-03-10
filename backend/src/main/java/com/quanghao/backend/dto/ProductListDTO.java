package com.quanghao.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductListDTO {
    private Long id;
    private String name;
    private Double price;
    private String description;
    private String brandName;
    private String categoryName;
    private List<String> imageUrls;
}
