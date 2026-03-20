package com.quanghao.backend.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cấu hình để link /uploads/** trỏ thẳng vào thư mục uploads/ ở gốc project
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/"); // 👉 Cách viết này tự hiểu đường dẫn tương đối, cực chuẩn!
    }
}
