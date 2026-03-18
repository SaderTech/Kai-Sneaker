package com.quanghao.backend.dto;

import lombok.Data;

@Data
public class CheckoutRequestDTO {
    private String fullName;
    private String phone;
    private String address;
    private String note;
}
