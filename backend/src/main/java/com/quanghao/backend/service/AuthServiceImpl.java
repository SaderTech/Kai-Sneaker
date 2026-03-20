package com.quanghao.backend.service;

import com.quanghao.backend.configuration.JwtUtil;
import com.quanghao.backend.dto.AuthResponseDTO;
import com.quanghao.backend.dto.LoginRequestDTO;
import com.quanghao.backend.dto.RegisterRequestDTO;
import com.quanghao.backend.entity.Role;
import com.quanghao.backend.entity.User;
import com.quanghao.backend.repository.RoleRepository;
import com.quanghao.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public String register(RegisterRequestDTO requestDTO) {
        if (userRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email này đã được đăng ký ! Vui lòng dùng email khác.");
        }

        String hashedPassword = passwordEncoder.encode(requestDTO.getPassword());

        User newUser = User.builder()
                .fullName(requestDTO.getFullName())
                .email(requestDTO.getEmail())
                .phone(requestDTO.getPhone())
                .passwordHash(hashedPassword)
                .status("ACTIVE")
                .createdAt(Instant.now())
                .build();
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy role trong DB!"));
        newUser.getRoles().add(userRole);

        userRepository.save(newUser);
        return "Đăng ký tài khoản thành công !";
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống!"));

        // 2. Kiểm tra mật khẩu
        boolean isPasswordMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!isPasswordMatch) {
            throw new RuntimeException("Sai mật khẩu! Vui lòng thử lại.");
        }

        // 3. LẤY DANH SÁCH ROLES (Dạng List<String> đúng như JwtUtil yêu cầu)
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        // 4. Sinh token (Ném Email và List Roles vào đây)
        String token = jwtUtil.generateToken(user.getEmail(), roles);

        // 5. Lấy cái Role đầu tiên để trả về cho React lưu LocalStorage (để điều hướng trang)
        String primaryRole = roles.isEmpty() ? "USER" : roles.get(0);

        // 6. Trả về DTO
        return AuthResponseDTO.builder()
                .token(token)
                .message("Đăng nhập thành công! Chào mừng " + user.getFullName())
                .role(primaryRole)
                .build();
    }
}