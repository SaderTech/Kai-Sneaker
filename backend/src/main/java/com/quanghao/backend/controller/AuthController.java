package com.quanghao.backend.controller;

import com.quanghao.backend.dto.AuthResponseDTO;
import com.quanghao.backend.dto.LoginRequestDTO;
import com.quanghao.backend.dto.RegisterRequestDTO;
import com.quanghao.backend.dto.ResetPasswordRequestDTO;
import com.quanghao.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/kaisneaker/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO requestDTO){
        return ResponseEntity.ok(authService.register(requestDTO));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        authService.sendOtp(request.get("email"));
        return ResponseEntity.ok("Mã OTP đã được gửi!");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequestDTO request) {
        // Gọi sang Service để xử lý logic
        return ResponseEntity.ok(authService.resetPasswordByOtp(request.getEmail(), request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login (@Valid @RequestBody LoginRequestDTO requestDTO){
        return ResponseEntity.ok(authService.login(requestDTO));
    }
}
