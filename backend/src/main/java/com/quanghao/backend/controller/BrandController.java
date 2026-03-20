package com.quanghao.backend.controller;

import com.quanghao.backend.dto.BrandDTO;
import com.quanghao.backend.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kaisneaker/brands")
@RequiredArgsConstructor
@CrossOrigin("*") // Để React gọi được API
public class BrandController {

    private final BrandService brandService;

    @GetMapping("/all")
    public ResponseEntity<List<BrandDTO>> getAllBrands() {
        return ResponseEntity.ok(brandService.findAll());
    }
}