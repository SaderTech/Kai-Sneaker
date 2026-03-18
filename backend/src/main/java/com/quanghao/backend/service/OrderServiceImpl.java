package com.quanghao.backend.service;

import com.quanghao.backend.dto.CheckoutRequestDTO;
import com.quanghao.backend.dto.OrderDTO;
import com.quanghao.backend.dto.OrderItemDTO;
import com.quanghao.backend.entity.*;
import com.quanghao.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final InventoryRepository inventoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    @Transactional
    public OrderDTO createOrder(Long userId, CheckoutRequestDTO requestDTO) {
        System.out.println("ID phương thức thanh toán từ Postman gửi lên là: " + requestDTO.getPaymentMethodId());
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Giỏ hàng trống !"));
        if (cart.getCartItems().isEmpty()) throw new RuntimeException("Không có sản phẩm nào để thanh toán !");
        User user = cart.getUser();

        String finalPhone = (requestDTO.getPhone() != null && !requestDTO.getPhone().isEmpty()) ? requestDTO.getPhone() : user.getPhone();
        PaymentMethod paymentMethod = null;
        if (requestDTO.getPaymentMethodId() != null) {
            paymentMethod = paymentMethodRepository.findById(requestDTO.getPaymentMethodId())
                    .orElseThrow(() -> new RuntimeException("Phương thức thanh toán không tồn tại!"));
        }
        String finalAddress = requestDTO.getShippingAddress();

        if (finalAddress == null || finalAddress.trim().isEmpty()) {
            finalAddress = String.format("%s, %s, %s, %s",
                    user.getHouseNumberStreet(),
                    user.getWard(),
                    user.getDistrict(),
                    user.getProvinceCity());
            finalAddress = finalAddress.replace("null", "").replace(", , , ", "").trim();
        }
        Order order = Order.builder()
                .user(user)
                .fullName(requestDTO.getFullName())
                .phone(finalPhone)
                .shippingAddress(finalAddress)
                .note(requestDTO.getNote())
                .orderStatus("PENDING")
                .paymentStatus("UNPAID")
                .paymentMethod(paymentMethod)
                .createdAt(Instant.now())
                .totalAmount(BigDecimal.ZERO)
                .orderItems(new ArrayList<>())
                .build();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getCartItems()) {
            ProductVariant variant = cartItem.getVariant();
            Inventory inv = variant.getInventory();
            if (inv == null || inv.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + variant.getProduct().getName() + " đã hết hàng !");
            }
            inv.setQuantity(inv.getQuantity() - cartItem.getQuantity());
            inventoryRepository.save(inv);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .variant(variant)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(variant.getProduct().getPrice())
                    .build();
            order.getOrderItems().add(orderItem);
            totalAmount = totalAmount.add(orderItem.getUnitPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.saveAndFlush(order);
        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cartRepository.save(cart);
        return convertToOrderDTO(savedOrder);
    }


        private OrderDTO convertToOrderDTO(Order order){
            List<OrderItemDTO> itemDTOs = order.getOrderItems().stream().map(item -> {
                String imageUrl = (item.getVariant().getProduct().getImages() != null && !item.getVariant().getProduct().getImages().isEmpty())
                        ? item.getVariant().getProduct().getImages().iterator().next().getImageUrl() : null;

                return OrderItemDTO.builder()
                        .id(item.getId())
                        .variantId(item.getVariant().getId())
                        .productName(item.getVariant().getProduct().getName())
                        .size(item.getVariant().getSize())
                        .color(item.getVariant().getColor())
                        .imageUrl(imageUrl)
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build();
            }).toList();

            String paymentMethodName = null;
            if (order.getPaymentMethod() != null) {
                paymentMethodName = order.getPaymentMethod().getName(); // Giả sử Entity của Hào có trường 'name'
            }

            return OrderDTO.builder()
                    .id(order.getId())
                    .fullName(order.getFullName())
                    .phone(order.getPhone())
                    .shippingAddress(order.getShippingAddress())
                    .note(order.getNote())
                    .orderStatus(order.getOrderStatus())
                    .paymentStatus(order.getPaymentStatus())
                    .paymentMethod(paymentMethodName)
                    .createdAt(order.getCreatedAt())
                    .totalAmount(order.getTotalAmount())
                    .items(itemDTOs)
                    .build();
    }
}
