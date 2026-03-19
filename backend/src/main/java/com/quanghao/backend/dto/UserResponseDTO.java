package com.quanghao.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
public class UserResponseDTO {
    private Long id;
    private String email;
    private String fullName;
    private String gender;
    private String phone;
    private String province_city;
    private String district;
    private String ward;
    private String houseNumberStreet;
    private String status;
    private Instant createAt;
    private Set<String> roles;
}
