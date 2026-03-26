package com.quanghao.backend.service;

import com.quanghao.backend.dto.ReviewRequestDTO;
import jakarta.transaction.Transactional;

public interface ReviewService {
    @Transactional
    void addReview(String email, ReviewRequestDTO dto);
}
