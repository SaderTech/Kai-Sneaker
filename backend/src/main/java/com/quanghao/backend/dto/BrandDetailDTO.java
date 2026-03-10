package com.quanghao.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BrandDetailDTO extends BrandDTO{
    private String description;
   // ...
}
