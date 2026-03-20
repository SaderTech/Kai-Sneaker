package com.quanghao.backend.service;

import com.quanghao.backend.dto.BrandDTO;
import com.quanghao.backend.dto.BrandRequestDTO;

import java.util.List;

public interface BrandService {
    List<BrandDTO> getAllBrands();

    BrandDTO createBrand(BrandRequestDTO request);

    void deleteBrand(Long id);

    BrandDTO updateBrand(Long id, BrandRequestDTO request);

    List<BrandDTO> findAll();
}
