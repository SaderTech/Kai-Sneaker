package com.quanghao.backend.service;

import com.quanghao.backend.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();

    CategoryDTO createCategory(CategoryDTO request);

    CategoryDTO updateCategory(Long id, CategoryDTO request);

    void deleteCategory(Long id);
}
