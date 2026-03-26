package com.quanghao.backend.service;

import com.quanghao.backend.dto.ReviewRequestDTO;
import com.quanghao.backend.entity.Product;
import com.quanghao.backend.entity.Review;
import com.quanghao.backend.entity.User;
import com.quanghao.backend.repository.ProductRepository;
import com.quanghao.backend.repository.ReviewRepository;
import com.quanghao.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    @Transactional
    @Override
    public void addReview(String email, ReviewRequestDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Bạn chưa đăng nhập hoặc User không tồn tại!"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm này không còn tồn tại!"));
        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new RuntimeException("Số sao chỉ từ 1 đến 5 thôi sếp ơi!");
        }
        if (reviewRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            throw new RuntimeException("Bạn ơi, mỗi sản phẩm chỉ được đánh giá một lần thôi nhé!");
        }
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        if (dto.getRating() != null) {
            review.setRating(dto.getRating().byteValue());
        } else {
            review.setRating((byte) 5); // Mặc định 5 sao cho nó xịn sếp nhé
        }
        review.setComment(dto.getComment());
        review.setCreatedAt(Instant.now());

        reviewRepository.save(review);
    }
}
