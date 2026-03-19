package com.quanghao.backend.service;

import com.quanghao.backend.dto.LoginRequestDTO;
import com.quanghao.backend.dto.RegisterRequestDTO;
import com.quanghao.backend.entity.User;
import com.quanghao.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public String register(RegisterRequestDTO requestDTO){
        if(userRepository.findByEmail(requestDTO.getEmail()).isPresent()){
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
        userRepository.save(newUser);
        return "Đăng ký tài khoản thành công !";
    }

    @Override
    public String login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống!"));

        boolean isPasswordMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());

        if (!isPasswordMatch) {
            throw new RuntimeException("Sai mật khẩu! Vui lòng thử lại.");
        }

        return "Đăng nhập thành công! Chào mừng " + user.getFullName();
    }
}
