package com.quanghao.backend.service;

import com.quanghao.backend.dto.ChangePasswordDTO;
import com.quanghao.backend.dto.UserProfileDTO;
import com.quanghao.backend.dto.UserResponseDTO;
import com.quanghao.backend.entity.Role;
import com.quanghao.backend.entity.User;
import com.quanghao.backend.repository.RoleRepository;
import com.quanghao.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<UserResponseDTO> getAllUsers(String keyword, Pageable pageable) {
        Page<User> users = (keyword == null || keyword.isEmpty())
                ? userRepository.findAll(pageable)
                : userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword, pageable);

        return users.map(this::convertToDTO);
    }

    // 1. XEM PROFILE
    @Override
    public UserProfileDTO getUserProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAvatarUrl(user.getAvatarUrl());
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
        user.setAvatarUrl(request.getAvatarUrl());
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

    @Transactional
    public void updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        user.setStatus(status);
        userRepository.save(user);
    }

    @Transactional
    public void updateUserRoles(Long userId, List<Long> roleIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        List<Role> newRoles = roleRepository.findAllById(roleIds);
        user.setRoles(new HashSet<>(newRoles));
        userRepository.save(user);
    }

    private UserResponseDTO convertToDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .gender(user.getGender())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .province_city(user.getProvinceCity())
                .district(user.getDistrict())
                .ward(user.getWard())
                .houseNumberStreet(user.getHouseNumberStreet())
                .status(user.getStatus())
                .createAt(user.getCreatedAt())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .build();
    }
}