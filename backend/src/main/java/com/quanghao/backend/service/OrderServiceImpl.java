package com.quanghao.backend.service;

import com.quanghao.backend.dto.*;
import com.quanghao.backend.entity.*;
import com.quanghao.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final InventoryRepository inventoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderDTO createOrder(String email, CheckoutRequestDTO requestDTO) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại !"));

        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Giỏ hàng trống !"));
        if (cart.getCartItems().isEmpty()) throw new RuntimeException("Không có sản phẩm nào để thanh toán !");

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

        BigDecimal shippingFee = BigDecimal.valueOf(30000);
        order.setTotalAmount(totalAmount.add(shippingFee));
        Order savedOrder = orderRepository.saveAndFlush(order);
        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cartRepository.save(cart);
        return convertToOrderDTO(savedOrder);
    }

    @Override
    public List<OrderDTO> getOrderHistory(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại !"));

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if(orders.isEmpty()){
            return new ArrayList<>();
        }

        return orders.stream()
                .map(this::convertToOrderDTO)
                .toList();
    }

    @Override
    public OrderDTO cancelOrder(Long orderId, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại !"));

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại !"));
        if(!order.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này !");
        }

        if(!order.getOrderStatus().equals("PENDING")){
            throw new RuntimeException("Không thể hủy đơn hàng vì đơn đã được xử lý : " + order.getOrderStatus());

        }

        for(OrderItem item : order.getOrderItems()){
            ProductVariant variant = item.getVariant();
            Inventory inventory = variant.getInventory();

            if(inventory != null){
                int newQuantity = inventory.getQuantity() + item.getQuantity();
                inventory.setQuantity(newQuantity);
                inventoryRepository.save(inventory);
            }
        }
        order.setOrderStatus("CANCELLED");
        Order savedOrder = orderRepository.save(order);
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
                paymentMethodName = order.getPaymentMethod().getName();
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

    public Page<OrderResponseDTO> getAllOrders(Pageable pageable, Long orderId) {
        if (orderId != null) {
            return orderRepository.findById(orderId)
                    .map(order -> {
                        OrderResponseDTO dto = convertToDTO(order);
                        return (Page<OrderResponseDTO>) new PageImpl<>(
                                List.of(dto),
                                pageable,
                                1
                        );
                    })
                    .orElseGet(() -> new PageImpl<>(Collections.emptyList(), pageable, 0));
        }

        return orderRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional
    public void updateStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        String oldStatus = order.getOrderStatus();

        if ("CANCELLED".equalsIgnoreCase(newStatus) && !"CANCELLED".equalsIgnoreCase(oldStatus)) {
            for (OrderItem item : order.getOrderItems()) {
                ProductVariant variant = item.getVariant();
                Inventory inv = variant.getInventory();
                if (inv != null) {
                    inv.setQuantity(inv.getQuantity() + item.getQuantity());
                    inventoryRepository.save(inv);
                }
            }
        }

        if ("DELIVERED".equalsIgnoreCase(newStatus)) {
            order.setPaymentStatus("PAID");
        }

        order.setOrderStatus(newStatus.toUpperCase());
        orderRepository.save(order);
    }

    @Transactional
    public void updatePaymentStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng!"));

        order.setPaymentStatus(newStatus.toUpperCase());
        orderRepository.save(order);
    }

    private OrderResponseDTO convertToDTO(Order order) {
        return OrderResponseDTO.builder()
                .id(order.getId())
                .fullName(order.getFullName())
                .phone(order.getPhone())
                .shippingAddress(order.getShippingAddress())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .note(order.getNote())
                .paymentMethodName(order.getPaymentMethod() != null ? order.getPaymentMethod().getName() : "N/A")
                .createdAt(order.getCreatedAt())
                .items(order.getOrderItems().stream().map(item -> {
                    ProductVariant variant = item.getVariant();
                    String firstImage = (variant.getProduct().getImages() != null && !variant.getProduct().getImages().isEmpty())
                            ? variant.getProduct().getImages().iterator().next().getImageUrl()
                            : null;
                    return OrderItemResponseDTO.builder()
                            .productName(variant.getProduct().getName())
                            .size(variant.getSize() != null ? variant.getSize() : "N/A")
                            .color(variant.getColor() != null ? variant.getColor() : "N/A")
                            .quantity(item.getQuantity())
                            .price(item.getUnitPrice())
                            .thumbnail(firstImage)
                            .build();

                }).collect(Collectors.toList()))
                .build();
    }
}
