package com.quanghao.backend.service;

import com.quanghao.backend.configuration.JwtUtil;
import com.quanghao.backend.dto.AuthResponseDTO;
import com.quanghao.backend.dto.LoginRequestDTO;
import com.quanghao.backend.dto.RegisterRequestDTO;
import com.quanghao.backend.entity.Role;
import com.quanghao.backend.entity.User;
import com.quanghao.backend.repository.RoleRepository;
import com.quanghao.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;

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
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống!"));

        boolean isPasswordMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!isPasswordMatch) {
            throw new RuntimeException("Sai mật khẩu! Vui lòng thử lại.");
        }

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        String token = jwtUtil.generateToken(user.getEmail(), roles);

        String primaryRole = roles.isEmpty() ? "USER" : roles.get(0);

        return AuthResponseDTO.builder()
                .token(token)
                .message("Đăng nhập thành công! Chào mừng " + user.getFullName())
                .role(primaryRole)
                .build();
    }

    public void sendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại!"));

        String otp = String.valueOf(new Random().nextInt(899999) + 100000);
        user.setOtp(otp);
        user.setOtpExpiry(Instant.now().plus(5, ChronoUnit.MINUTES));
        userRepository.save(user);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mã OTP Quên mật khẩu - KAI SNEAKER");
        message.setText("Mã OTP của bạn là: " + otp + ". Hiệu lực trong 5 phút.");
        mailSender.send(message);
    }

    @Transactional
    @Override
    public String resetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại!"));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Mã OTP không chính xác!");
        }

        if (user.getOtpExpiry().isBefore(Instant.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn!");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return "Đổi mật khẩu thành công!";
    }
}