package com.quanghao.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDetailDTO {
    private Long id;
    private String name;
    private Page<ProductListDTO> products;
    private List<CategoryDTO> availableCategories;
    private List<String> availableSizes;
    private List<PriceRangeOption> priceFilters;
}
