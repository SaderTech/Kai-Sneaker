package com.quanghao.backend.service;

import com.quanghao.backend.dto.AddToCartRequestDTO;
import com.quanghao.backend.dto.CartDTO;
import com.quanghao.backend.dto.CartItemDTO;
import com.quanghao.backend.entity.Cart;
import com.quanghao.backend.entity.CartItem;
import com.quanghao.backend.entity.ProductVariant;
import com.quanghao.backend.entity.User;
import com.quanghao.backend.repository.CartItemRepository;
import com.quanghao.backend.repository.CartRepository;
import com.quanghao.backend.repository.ProductVariantRepository;
import com.quanghao.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService{
    private final CartRepository cartRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    @Transactional
    public CartDTO addToCart(Long userId, AddToCartRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Biến thể sản phẩm không còn tồn tại"));

        int stock = variant.getInventory() != null ? variant.getInventory().getQuantity() : 0;
        if(request.getQuantity() > stock){
            throw new RuntimeException("Số lượng trong kho không đủ ? Chỉ còn " + stock + " sản phẩm.");
        }

        Optional<CartItem> existingItemOpt = cart.getCartItems().stream()
                .filter(item -> item.getVariant().getId().equals(variant.getId()))
                .findFirst();

        if(existingItemOpt.isPresent()){
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQuantity();

            if(newQuantity > stock){
                throw new RuntimeException("Bạn không thể thêm quá số lượng tồn kho !");
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .build();
            cart.getCartItems().add(newItem);
            cartItemRepository.save(newItem);
        }
        cartRepository.save(cart);
        return getUserCart(userId);
    }

    @Override
    public CartDTO getUserCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Giỏ hàng trống!"));

        BigDecimal totalPrice = BigDecimal.ZERO;
        int totalItems = 0;
        List<CartItemDTO> itemDTOs = new ArrayList<>();
        for (CartItem item : cart.getCartItems()){
            ProductVariant variant = item.getVariant();
            if (variant == null || variant.getProduct() == null) {
                continue; // Bỏ qua món đồ lỗi, không tính tiền nó nữa
            }
            BigDecimal price = variant.getProduct().getPrice();
            BigDecimal subTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));

            totalPrice = totalPrice.add(subTotal);
            totalItems += item.getQuantity();

            itemDTOs.add(CartItemDTO.builder()
                            .cartItemId(item.getId())
                            .variantId(variant.getId())
                            .productName(variant.getProduct().getName())
                            .size(variant.getSize())
                            .color(variant.getColor())
                            .price(price)
                            .quantity(item.getQuantity())
                            .subTotal(subTotal)
                            .imageUrl(variant.getProduct().getImages().isEmpty() ? null : variant.getProduct().getImages().iterator().next().getImageUrl())
                            .stockQuantity(variant.getInventory() != null ? variant.getInventory().getQuantity() : 0)
                    .build());
        }

        return CartDTO.builder()
                .cartId(cart.getId())
                .items(itemDTOs)
                .totalItems(totalItems)
                .totalPrice(totalPrice)
                .build();
    }

    @Override
    @Transactional
    public CartDTO updateQuantity(Long userId, Long cartItemId, Integer newQuantity){
        CartItem item = cartItemRepository.findById(cartItemId).orElseThrow(() -> new RuntimeException("Không tìm thấy món đồ trong giỏ hàng !"));

        if(!item.getCart().getUser().getId().equals(userId)){
            throw new RuntimeException("Bạn không có quyền chỉnh sửa giỏ hàng này !");
        }

        if(newQuantity <= 0){
            return removeFromCart(userId, cartItemId);
        }

        int stock = item.getVariant().getInventory() != null ? item.getVariant().getInventory().getQuantity() : 0;
        if(newQuantity > stock){
            throw new RuntimeException("Rất tiếc, kho chỉ còn " + stock + " sản phẩm !");
        }

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);
        return getUserCart(userId);
    }

    @Override
    @Transactional
    public CartDTO removeFromCart(Long userId, Long cartItemId){
        CartItem item = cartItemRepository.findById(cartItemId).orElseThrow(() -> new RuntimeException("Món đồ không tồn tại !"));

        if(!item.getCart().getUser().getId().equals(userId)){
            throw new RuntimeException("Bạn không có quyền xóa món đồ này !");
        }

        cartItemRepository.delete(item);
        return getUserCart(userId);
    }

}
