package com.quanghao.backend.service;

import com.quanghao.backend.dto.AuthResponseDTO;
import com.quanghao.backend.dto.LoginRequestDTO;
import com.quanghao.backend.dto.RegisterRequestDTO;

public interface AuthService {
    String register(RegisterRequestDTO requestDTO);

    AuthResponseDTO login(LoginRequestDTO request);
}
