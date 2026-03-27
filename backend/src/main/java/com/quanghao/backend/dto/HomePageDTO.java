package com.quanghao.backend.dto;

import com.quanghao.backend.entity.Brand;
import com.quanghao.backend.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HomePageDTO {
    private List<BrandDTO> navbarBrands;
    private List<CategoryDTO> navbarCategories;
    private List<ProductListDTO> featuredProducts;
    private List<ProductListDTO> newArrivals;
    private List<HomeBrandSectionDTO> brandSections;
}
