package com.quanghao.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BrandRequestDTO {
    private String name;
    private String description;
    private MultipartFile image; // 👉 Nhận file ảnh bìa của Brand ở đây
}