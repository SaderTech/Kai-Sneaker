package com.quanghao.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String email;
    private String fullName;
    private String gender;
    private String phone;
    private String avatarUrl;
    private String province_city;
    private String district;
    private String ward;
    private String houseNumberStreet;
    private String status;
    private Instant createAt;
    private Set<String> roles;
}