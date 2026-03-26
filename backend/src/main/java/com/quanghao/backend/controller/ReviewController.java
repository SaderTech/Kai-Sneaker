package com.quanghao.backend.controller;

import com.quanghao.backend.dto.ReviewRequestDTO;
import com.quanghao.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kaisneaker/reviews")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<String> createReview(@RequestBody ReviewRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if ("anonymousUser".equals(email)) {
            return ResponseEntity.status(401).body("Đăng nhập mới được review !");
        }
        reviewService.addReview(email, dto);
        return ResponseEntity.ok("Đánh giá thành công !");
    }
}
