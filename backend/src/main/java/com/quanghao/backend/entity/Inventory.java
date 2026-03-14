package com.quanghao.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ColumnDefault("0")
    @Column(name = "quantity")
    private Integer quantity;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private Instant updatedAt;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;


}