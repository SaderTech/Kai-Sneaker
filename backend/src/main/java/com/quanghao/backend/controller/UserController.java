package com.quanghao.backend.controller;

import com.quanghao.backend.dto.ChangePasswordDTO;
import com.quanghao.backend.dto.UserProfileDTO;
import com.quanghao.backend.dto.UserResponseDTO;
import com.quanghao.backend.entity.User;
import com.quanghao.backend.repository.UserRepository;
import com.quanghao.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/kaisneaker/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.getUserProfileByEmail(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@RequestBody UserProfileDTO request){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.updateUserProfileByEmail(email, request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordDTO request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.changePasswordByEmail(email, request));
    }

    @PostMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            System.out.println("DEBUG: Đang upload cho user: " + email); // Kiểm tra xem email có đúng không

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

            // 1. Lưu file vào ổ cứng (Sếp đã làm tốt phần này)
            Path uploadPath = Paths.get("uploads/");
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 2. Tạo URL
            String avatarUrl = "http://localhost:8080/uploads/" + fileName;

            // 3. CẬP NHẬT VÀ LƯU VÀO DATABASE
            user.setAvatarUrl(avatarUrl);
            User savedUser = userRepository.save(user); // 👉 Lưu và hứng lại kết quả

            System.out.println("DEBUG: Đã lưu vào DB thành công cho user: " + savedUser.getEmail());
            System.out.println("DEBUG: Link ảnh trong DB là: " + savedUser.getAvatarUrl());
            return ResponseEntity.ok(avatarUrl);

        } catch (Exception e) {
            e.printStackTrace(); // 👉 In lỗi ra Console IntelliJ để sếp nhìn thấy nó báo lỗi gì
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }

}
