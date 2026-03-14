package com.quanghao.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 500)
    @NotNull
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;
    @OneToOne(mappedBy = "image")
    private Brand brands;
    @ManyToMany(mappedBy = "images")
    private Set<Product> products = new LinkedHashSet<>();


}