package com.quanghao.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @Size(max = 255)
    @NotNull
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Size(max = 255)
    @Column(name = "full_name")
    private String fullName;

    @Size(max = 10)
    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "phone", length = 15)
    private String phone;

    @Size(max = 500)
    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Size(max = 100)
    @Column(name = "province_city", length = 100)
    private String provinceCity;

    @Size(max = 100)
    @Column(name = "district", length = 100)
    private String district;

    @Size(max = 100)
    @Column(name = "ward", length = 100)
    private String ward;

    @Size(max = 255)
    @Column(name = "house_number_street")
    private String houseNumberStreet;

    @ColumnDefault("'ACTIVE'")
    @Column(name = "status" , length = 20)
    private String status;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;
    @OneToOne(mappedBy = "user")
    private Cart cart;
    @Builder.Default
    @OneToMany(mappedBy = "user")
    private Set<Order> orders = new LinkedHashSet<>();
    @Builder.Default
    @OneToMany(mappedBy = "user")
    private Set<Review> reviews = new LinkedHashSet<>();
    @Builder.Default
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")})
    private Set<Role> roles = new LinkedHashSet<>();
    @Builder.Default
    @ManyToMany(mappedBy = "users")
    private Set<Product> products = new LinkedHashSet<>();
    private String otp;
    private Instant otpExpiry;
}