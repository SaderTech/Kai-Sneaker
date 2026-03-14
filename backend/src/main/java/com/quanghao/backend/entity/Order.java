package com.quanghao.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "total_amount", precision = 19, scale = 2)
    private BigDecimal totalAmount;

    @ColumnDefault("'PENDING'")
    @Lob
    @Column(name = "order_status")
    private String orderStatus;

    @ColumnDefault("'UNPAID'")
    @Lob
    @Column(name = "payment_status")
    private String paymentStatus;

    @Size(max = 500)
    @Column(name = "shipping_address", length = 500)
    private String shippingAddress;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;


}