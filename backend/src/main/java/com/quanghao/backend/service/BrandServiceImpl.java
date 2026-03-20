package com.quanghao.backend.service;

import com.quanghao.backend.dto.BrandDTO;
import com.quanghao.backend.dto.BrandRequestDTO;
import com.quanghao.backend.entity.Brand;
import com.quanghao.backend.entity.Image;
import com.quanghao.backend.repository.BrandRepository;
import com.quanghao.backend.repository.ImageRepository;
import com.quanghao.backend.repository.ProductRepository;
import com.quanghao.backend.service.BrandService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final ImageRepository imageRepository;
    private final ProductRepository productRepository; // Dò mìn

    private Image saveImage(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;

        String projectDir = System.getProperty("user.dir");
        Path rootPath = Paths.get(projectDir, "uploads");

        try {
            if (!Files.exists(rootPath)) {
                Files.createDirectories(rootPath);
            }

            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            Path filePath = rootPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Image imageEntity = new Image();
            imageEntity.setImageUrl("/uploads/" + uniqueFilename);
            return imageRepository.save(imageEntity);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi nghiêm trọng khi lưu file ảnh: " + file.getOriginalFilename());
        }
    }

    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(b -> BrandDTO.builder()
                        .id(b.getId())
                        .name(b.getName())
                        .description(b.getDescription())
                        .imageUrl(b.getImage() != null ? b.getImage().getImageUrl() : null)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public BrandDTO createBrand(BrandRequestDTO request) {
        Image savedImage = saveImage(request.getImage());

        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        brand.setImage(savedImage);

        Brand savedBrand = brandRepository.save(brand);

        return BrandDTO.builder()
                .id(savedBrand.getId())
                .name(savedBrand.getName())
                .description(savedBrand.getDescription())
                .imageUrl(savedBrand.getImage() != null ? savedBrand.getImage().getImageUrl() : null)
                .build();
    }

    @Transactional
    public BrandDTO updateBrand(Long id, BrandRequestDTO request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hãng có ID: " + id));

        brand.setName(request.getName());
        brand.setDescription(request.getDescription());

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            Image newImage = saveImage(request.getImage()); // Dùng lại hàm saveImage lúc nãy
            brand.setImage(newImage); // Đè ảnh mới vào
        }

        Brand savedBrand = brandRepository.save(brand);

        return BrandDTO.builder()
                .id(savedBrand.getId())
                .name(savedBrand.getName())
                .description(savedBrand.getDescription())
                .imageUrl(savedBrand.getImage() != null ? savedBrand.getImage().getImageUrl() : null)
                .build();
    }

    public void deleteBrand(Long id) {
        if (productRepository.existsByBrandId(id)) {
            throw new RuntimeException("CẢNH BÁO: Không thể xóa! Đang có sản phẩm thuộc hãng này. Vui lòng cập nhật lại sản phẩm trước.");
        }

        brandRepository.deleteById(id);
    }
}