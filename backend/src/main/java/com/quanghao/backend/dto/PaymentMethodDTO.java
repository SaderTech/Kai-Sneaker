package com.quanghao.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentMethodDTO {
    private Long id;
    private String name;
    private String description;
}