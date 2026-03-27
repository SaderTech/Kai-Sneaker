package com.quanghao.backend.service;

import com.quanghao.backend.dto.CategoryDTO;
import com.quanghao.backend.entity.Category;
import com.quanghao.backend.repository.CategoryRepository;
import com.quanghao.backend.repository.ProductRepository;
import com.quanghao.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> CategoryDTO.builder().id(c.getId()).name(c.getName()).build())
                .collect(Collectors.toList());
    }

    // 2. Thêm mới
    public CategoryDTO createCategory(CategoryDTO request) {
        Category category = new Category();
        category.setName(request.getName());
        Category saved = categoryRepository.save(category);
        return CategoryDTO.builder().id(saved.getId()).name(saved.getName()).build();
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục!"));
        category.setName(request.getName());
        Category saved = categoryRepository.save(category);
        return CategoryDTO.builder().id(saved.getId()).name(saved.getName()).build();
    }

    public void deleteCategory(Long id) {
        if (productRepository.existsByCategoryId(id)) {
            throw new RuntimeException("CẢNH BÁO: Không thể xóa! Đang có sản phẩm thuộc danh mục này. Vui lòng cập nhật lại sản phẩm trước.");
        }

        categoryRepository.deleteById(id);
    }

    // Trong CategoryServiceImpl.java
    @Override
    public List<CategoryDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }
}