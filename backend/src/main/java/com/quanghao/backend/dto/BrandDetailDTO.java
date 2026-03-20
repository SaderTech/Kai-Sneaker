package com.quanghao.backend.dto;

import lombok.*;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BrandDetailDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Page<ProductListDTO> products;
    private List<CategoryDTO> availableCategories;
    private List<String> availableSizes;
    private List<PriceRangeOption> priceFilters;
}
