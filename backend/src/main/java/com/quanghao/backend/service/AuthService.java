package com.quanghao.backend.service;

import com.quanghao.backend.dto.AuthResponseDTO;
import com.quanghao.backend.dto.LoginRequestDTO;
import com.quanghao.backend.dto.RegisterRequestDTO;
import com.quanghao.backend.dto.ResetPasswordRequestDTO;
import jakarta.transaction.Transactional;

public interface AuthService {
    String register(RegisterRequestDTO requestDTO);

    AuthResponseDTO login(LoginRequestDTO request);

    @Transactional
    String resetPassword(String email, String otp, String newPassword);

    void sendOtp(String email);

    String resetPasswordByOtp(String email, ResetPasswordRequestDTO request);
}
