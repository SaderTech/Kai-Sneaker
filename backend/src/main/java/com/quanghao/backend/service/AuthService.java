package com.quanghao.backend.service;

import com.quanghao.backend.dto.LoginRequestDTO;
import com.quanghao.backend.dto.RegisterRequestDTO;

public interface AuthService {
    String register(RegisterRequestDTO requestDTO);

    String login(LoginRequestDTO request);
}
