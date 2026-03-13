package com.quanghao.backend.service;

import com.quanghao.backend.dto.BrandDTO;
import com.quanghao.backend.dto.CategoryDTO;
import com.quanghao.backend.dto.HomePageDTO;
import com.quanghao.backend.dto.ProductListDTO;
import com.quanghao.backend.entity.Brand;
import com.quanghao.backend.entity.Category;
import com.quanghao.backend.entity.Product;
import com.quanghao.backend.repository.BrandRepository;
import com.quanghao.backend.repository.CategoryRepository;
import com.quanghao.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public HomePageDTO getHomePageData(){
        List<Brand> brands = brandRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        List<Product> newArrival = productRepository.findTop8ByIsDeletedFalseOrderByCreatedAtDesc();
        List<Product> featuredProducts = productRepository.findTop8ByIsDeletedFalseOrderByPriceDesc();

        return HomePageDTO.builder()
                //Navbar
                .navbarBrands(brands.stream().map(this::convertToBrandDTO).collect(Collectors.toList()))
                .navbarCategories(categories.stream().map(this::convertToCategoryDTO).collect(Collectors.toList()))
                //San pham moi , san pham noi bat
                .newArrivals(newArrival.stream().map(this::convertToProductListDTO).collect(Collectors.toList()))
                .featuredProducts(featuredProducts.stream().map(this::convertToProductListDTO).collect(Collectors.toList()))
                .build();
    }

    private ProductListDTO convertToProductListDTO(Product product) {
        return ProductListDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice()) // BigDecimal cực chuẩn
                .brandName(product.getBrand() != null ? product.getBrand().getName() : "N/A")
                .imageUrls(product.getImages() != null && !product.getImages().isEmpty()
                        ? product.getImages().get(0).getImageUrl() : null)
                .build();
    }

    private BrandDTO convertToBrandDTO(Brand brand) {
        return BrandDTO.builder()
                .id(brand.getId())
                .name(brand.getName())
                .imageUrl(brand.getImage() != null ? brand.getImage().getImageUrl() : null)
                .build();
    }

    private CategoryDTO convertToCategoryDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }

}