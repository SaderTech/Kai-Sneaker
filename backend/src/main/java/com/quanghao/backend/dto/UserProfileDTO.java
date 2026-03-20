package com.quanghao.backend.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private String avatarUrl;
    private String provinceCity;
    private String district;
    private String ward;
    private String houseNumberStreet;
}
