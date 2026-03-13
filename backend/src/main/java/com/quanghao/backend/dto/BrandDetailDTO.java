package com.quanghao.backend.dto;

import lombok.*;
import org.springframework.data.domain.Page;

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
}
