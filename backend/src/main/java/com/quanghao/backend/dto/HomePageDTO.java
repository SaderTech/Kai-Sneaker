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
// Dữ liệu cho Narbar
    private List<BrandDTO> navbarBrands;
    private List<CategoryDTO> navbarCategories;
//Dữ liệu cho các List sản phẩm gợi ý
    private List<ProductListDTO> featuredProducts;
    private List<ProductListDTO> newArrivals;
//Dữ liệu cho các List sản phẩm của các brand
    private List<HomeBrandSectionDTO> brandSections;
}
