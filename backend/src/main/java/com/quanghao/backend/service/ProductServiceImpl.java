package com.quanghao.backend.service;

import com.quanghao.backend.dto.*;
import com.quanghao.backend.entity.Brand;
import com.quanghao.backend.entity.Category;
import com.quanghao.backend.entity.Image;
import com.quanghao.backend.entity.Product;
import com.quanghao.backend.repository.BrandRepository;
import com.quanghao.backend.repository.CategoryRepository;
import com.quanghao.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
        List<HomeBrandSectionDTO> brandSections = brands.stream().map(brand -> {
            List<Product> productsByBrand = productRepository.findTop4ByBrandIdAndIsDeletedFalseOrderByCreatedAtDesc(brand.getId());
            return HomeBrandSectionDTO.builder()
                    .brand(convertToBrandDTO(brand)) // Dùng lại hàm convert Brand
                    .products(productsByBrand.stream().map(this::convertToProductListDTO).collect(Collectors.toList()))
                    .build();
        }).collect(Collectors.toList());

        return HomePageDTO.builder()
                //Navbar
                .navbarBrands(brands.stream().map(this::convertToBrandDTO).collect(Collectors.toList()))
                .navbarCategories(categories.stream().map(this::convertToCategoryDTO).collect(Collectors.toList()))
                //San pham moi , san pham noi bat
                .newArrivals(newArrival.stream().map(this::convertToProductListDTO).collect(Collectors.toList()))
                .featuredProducts(featuredProducts.stream().map(this::convertToProductListDTO).collect(Collectors.toList()))
                .brandSections(brandSections)
                .build();
    }

    private ProductListDTO convertToProductListDTO(Product product) {
        return ProductListDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
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

    @Override
    public Page<ProductListDTO> searchProducts(String keyword, Pageable pageable){
        Page <Product> products = productRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(keyword,pageable);
        return products.map(this::convertToProductListDTO);
    }


    @Override
    public BrandDetailDTO getBrandFullData(Long brandId, Long catId, String priceRange, String size, Pageable pageable) {

        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hãng"));

        BigDecimal min = null;
        BigDecimal max = null;
        if (priceRange != null) {
            switch (priceRange) {
                case "UNDER_1M" -> {
                    min = BigDecimal.ZERO;
                    max = new BigDecimal("1000000");
                }
                case "1M_2M" -> {
                    min = new BigDecimal("1000000");
                    max = new BigDecimal("2000000");
                }
                case "2M_4M" -> {
                    min = new BigDecimal("2000000");
                    max = new BigDecimal("4000000");
                }
                case "ABOVE_4M" -> {
                    min = new BigDecimal("4000000");
                    max = new BigDecimal("100000000");
                }
            }
        }
        Page<Product> productPage = productRepository.findByBrandAndFilters(brandId, catId, min, max, size, pageable);

        List<PriceRangeOption> priceOptions = List.of(
                new PriceRangeOption("Dưới 1 triệu", "UNDER_1M"),
                new PriceRangeOption("1 - 2 triệu", "1M_2M"),
                new PriceRangeOption("2 - 4 triệu", "2M_4M"),
                new PriceRangeOption("Trên 4 triệu", "ABOVE_4M")
        );

        return BrandDetailDTO.builder()
                .id(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .imageUrl(brand.getImage() != null ? brand.getImage().getImageUrl() : null)
                .availableCategories(productRepository.findUniqueCategoriesByBrand(brandId))
                .availableSizes(productRepository.findUniqueSizesByBrand(brandId))
                .priceFilters(priceOptions)
                .products(productPage.map(this::convertToProductListDTO))
                .build();
    }

    @Override
    public ProductDetailDTO getProductDetail(Long productId){
        Product product = productRepository.findById(productId)
                .filter(p -> !p.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại hoặc đã bị xóa!"));

        List<String> imageUrls = product.getImages().stream()
                .map(Image::getImageUrl)
                .collect(Collectors.toList());

        List<VariantDTO> variantDTOs = product.getVariants().stream()
                .map(variant -> VariantDTO.builder()
                        .id(variant.getId())
                        .size(variant.getSize())
                        .color(variant.getColor())
                        .quantity(variant.getInventory() != null ? variant.getInventory().getQuantity() : 0)
                        .build())
                .collect(Collectors.toList());

        return ProductDetailDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .imageUrls(imageUrls)
                .variants(variantDTOs)
                .build();
    }

}