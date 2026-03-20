package com.quanghao.backend.service;

import com.quanghao.backend.dto.ProductResponseDTO;
import com.quanghao.backend.entity.Product;
import com.quanghao.backend.entity.User;
import com.quanghao.backend.entity.Wishlist;
import com.quanghao.backend.entity.WishlistId;
import com.quanghao.backend.repository.ProductRepository;
import com.quanghao.backend.repository.UserRepository;
import com.quanghao.backend.repository.WishListRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishListRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void toggleWishlist(Long userId, Long productId) {
        WishlistId id = new WishlistId();
        id.setUserId(userId);
        id.setProductId(productId);

        if (wishlistRepository.existsById(id)) {
            wishlistRepository.deleteById(id);
        } else {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy người dùng ID " + userId));
            Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Lỗi: Sản phẩm này không tồn tại trong hệ thống!"));
            Wishlist wl = new Wishlist();
            wl.setId(id); wl.setUser(user); wl.setProduct(product);
            wishlistRepository.save(wl);
        }
    }

    public List<ProductResponseDTO> getMyWishlist(Long userId) {
        return wishlistRepository.findByUser_Id(userId).stream()
                .map(item -> convertToDTO(item.getProduct()))
                .collect(Collectors.toList());
    }

    private ProductResponseDTO convertToDTO(Product p) {
        return ProductResponseDTO.builder()
                .id(p.getId()).name(p.getName()).price(p.getPrice())
                .brandName(p.getBrand() != null ? p.getBrand().getName() : "N/A")
                .imageUrl(!p.getImages().isEmpty() ? p.getImages().iterator().next().getImageUrl() : null)
                .build();
    }
}