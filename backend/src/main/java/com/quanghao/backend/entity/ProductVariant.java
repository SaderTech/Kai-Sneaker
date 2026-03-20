package com.quanghao.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "product_variants")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 20)
    @Column(name = "size", length = 20)
    private String size;

    @Size(max = 50)
    @Column(name = "color", length = 50)
    private String color;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;
    @OneToMany(mappedBy = "variant")
    private Set<CartItem> cartItems = new LinkedHashSet<>();
    @OneToOne(mappedBy = "variant")
    private Inventory inventory;
    @OneToMany(mappedBy = "variant")
    private Set<OrderItem> orderItems = new LinkedHashSet<>();


}