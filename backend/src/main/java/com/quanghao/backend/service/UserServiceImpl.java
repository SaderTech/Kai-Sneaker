package com.quanghao.backend.service;

import com.quanghao.backend.dto.ChangePasswordDTO;
import com.quanghao.backend.dto.UserProfileDTO;
import com.quanghao.backend.entity.User;
import com.quanghao.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Gọi vũ khí mã hóa ra để xài

    // 1. XEM PROFILE
    @Override
    public UserProfileDTO getUserProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAvatar(user.getAvatarUrl());
        dto.setGender(user.getGender());
        dto.setProvinceCity(user.getProvinceCity());
        dto.setDistrict(user.getDistrict());
        dto.setWard(user.getWard());
        dto.setHouseNumberStreet(user.getHouseNumberStreet());

        return dto;
    }

    // 2. CẬP NHẬT PROFILE
    @Override
    public UserProfileDTO updateUserProfileByEmail(String email, UserProfileDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        // Cập nhật các trường mới
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAvatarUrl(request.getAvatar());
        user.setGender(request.getGender());
        user.setProvinceCity(request.getProvinceCity());
        user.setDistrict(request.getDistrict());
        user.setWard(request.getWard());
        user.setHouseNumberStreet(request.getHouseNumberStreet());

        userRepository.save(user);
        return request;
    }

    @Override
    public String changePasswordByEmail(String email, ChangePasswordDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác!");
        }

        String newHashedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPasswordHash(newHashedPassword);
        userRepository.save(user);

        return "Đổi mật khẩu thành công!";
    }
}