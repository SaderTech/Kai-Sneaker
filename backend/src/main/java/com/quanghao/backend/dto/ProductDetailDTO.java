package com.quanghao.backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
    private Boolean isDeleted;
    private String brandName;
    private String categoryName;
    private List<String> imageUrls;
    private List<VariantDTO> variants;
    private Double averageRating;
    private Integer totalReviews;
    private Long brandId;
    private Long categoryId;
    private List<ReviewDTO> reviews;
    private List<ProductListDTO> relatedProducts;
    private boolean canReview;
}
