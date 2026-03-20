package com.quanghao.backend.service;

import com.quanghao.backend.dto.*;
import com.quanghao.backend.entity.*;
import com.quanghao.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final InventoryRepository inventoryRepository;

    @Override
    public HomePageDTO getHomePageData() {
        List<Brand> brands = brandRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        List<Product> newArrival = productRepository.findTop8ByIsDeletedFalseOrderByCreatedAtDesc();
        List<Product> featuredProducts = productRepository.findTop8ByIsDeletedFalseOrderByPriceDesc();
        List<HomeBrandSectionDTO> brandSections = brands.stream().map(brand -> {
            List<Product> productsByBrand = productRepository.findTop8ByBrandIdAndIsDeletedFalseOrderByCreatedAtDesc(brand.getId());
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
                .description(brand.getDescription())
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
    public Page<ProductListDTO> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(keyword, pageable);
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
    public ProductDetailDTO getProductDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .filter(p -> !p.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại hoặc đã bị xóa!"));

        Set<Review> reviewSet = product.getReviews();
        List<ReviewDTO> reviewDTOs = new ArrayList<>();
        Double avgRating = 0.0;
        Integer totalRev = 0;

        if (reviewSet != null && !reviewSet.isEmpty()) {
            totalRev = reviewSet.size();
            avgRating = reviewSet.stream()
                    .mapToInt(rev -> rev.getRating() != null ? rev.getRating().intValue() : 0)
                    .average()
                    .orElse(0.0);
            avgRating = Math.round(avgRating * 10.0) / 10.0;

            reviewDTOs = reviewSet.stream()
                    .map(rev -> ReviewDTO.builder()
                            .id(rev.getId())
                            .reviewerName(rev.getUser() != null && rev.getUser().getFullName() != null ? rev.getUser().getFullName() : "Khách hàng ẩn danh")
                            .rating(rev.getRating() != null ? rev.getRating().intValue() : 0)
                            .comment(rev.getComment())
                            .createdAt(rev.getCreatedAt())
                            .build())
                    .sorted(Comparator.comparing(ReviewDTO::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                    .collect(Collectors.toList());
        }

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

        List<ProductListDTO> relatedDTOs = new ArrayList<>();
        if (product.getCategory() != null) {
            Pageable limit4 = PageRequest.of(0, 4);
            List<Product> relatedProducts = productRepository.findRelatedProducts(
                    product.getCategory().getId(),
                    product.getId(),
                    limit4);
            relatedDTOs = relatedProducts.stream()
                    .map(this::convertToProductListDTO)
                    .collect(Collectors.toList());
        }

        return ProductDetailDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .imageUrls(imageUrls)
                .variants(variantDTOs)
                .averageRating(avgRating)
                .totalReviews(totalRev)
                .reviews(reviewDTOs)
                .relatedProducts(relatedDTOs)
                .build();
    }


    @Transactional
    @Override
    public Product createProduct(ProductRequestDTO requestDTO) {
        Brand brand = brandRepository.findById(requestDTO.getBrandId()).orElseThrow(() -> new RuntimeException("Thương hiệu không tồn tại !"));
        Category category = categoryRepository.findById(requestDTO.getCategoryId()).orElseThrow(() -> new RuntimeException("Danh mục không tồn tại !"));

        Product product = new Product();
        product.setName(requestDTO.getName());
        product.setDescription(requestDTO.getDescription());
        product.setPrice(requestDTO.getPrice());
        product.setBrand(brand);
        product.setCategory(category);
        product.setIsDeleted(false);
        product.setCreatedAt(Instant.now());
        product.setImages(new ArrayList<>());

        String projectDir = System.getProperty("user.dir");
        Path rootPath = Paths.get(projectDir, "uploads");

        if (requestDTO.getImages() != null && !requestDTO.getImages().isEmpty()) {
            try {
                if (!Files.exists(rootPath)) {
                    Files.createDirectories(rootPath);
                }
            } catch (IOException e) {
                throw new RuntimeException("Lỗi: Không thể tạo thư mục lưu ảnh !");
            }

            for (MultipartFile file : requestDTO.getImages()) {
                if (file.isEmpty()) continue;

                try {
                    String originalFilename = file.getOriginalFilename();
                    String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

                    Path filePath = rootPath.resolve(uniqueFilename);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    Image imageEntity = new Image();
                    imageEntity.setImageUrl("/uploads/" + uniqueFilename);
                    Image savedImage = imageRepository.save(imageEntity);
                    product.getImages().add(savedImage);
                } catch (IOException e) {
                    throw new RuntimeException("Lỗi nghiêm trọng khi lưu file ảnh: " + file.getOriginalFilename());
                }
            }
        }

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long productId, ProductRequestDTO request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có ID: " + productId));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Thương hiệu không tồn tại!"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại!"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setBrand(brand);
        product.setCategory(category);

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));

        product.setIsDeleted(true);
        productRepository.save(product);
    }

    @Transactional
    @Override
    public List<VariantDTO> bulkCreateVariants(Long productId, List<VariantRequestDTO> variantRequests) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID: " + productId));

        List<VariantDTO> resultList = new ArrayList<>();

        for (VariantRequestDTO dto : variantRequests) {
            // 1. Tạo và lưu Variant TRƯỚC để nó có ID trong Database
            ProductVariant variant = new ProductVariant();
            variant.setProduct(product);
            variant.setSize(dto.getSize());
            variant.setColor(dto.getColor());
            ProductVariant savedVariant = productVariantRepository.save(variant);

            // 2. Tạo và lưu Inventory SAU (Lúc này savedVariant đã là hàng "Auth" có ID)
            Inventory inventory = new Inventory();
            inventory.setVariant(savedVariant);
            inventory.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : 0);
            inventory.setUpdatedAt(Instant.now());
            Inventory savedInventory = inventoryRepository.save(inventory);

            // 3. Đóng gói vào DTO trả về cho ReactJS
            resultList.add(VariantDTO.builder()
                    .id(savedVariant.getId())
                    .size(savedVariant.getSize())
                    .color(savedVariant.getColor())
                    .quantity(savedInventory.getQuantity())
                    .build());
        }

        return resultList;
    }

    @Transactional
    @Override
    public VariantDTO updateVariantQuantity(Long variantId, Integer newQuantity) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể có ID: " + variantId));

        Inventory inventory = variant.getInventory();
        if (inventory == null) {
            inventory = new Inventory();
            inventory.setVariant(variant);
        }

        inventory.setQuantity(newQuantity);
        inventory.setUpdatedAt(Instant.now());

        Inventory savedInventory = inventoryRepository.save(inventory);

        return VariantDTO.builder()
                .id(variant.getId())
                .size(variant.getSize())
                .color(variant.getColor())
                .quantity(savedInventory.getQuantity())
                .build();
    }
}