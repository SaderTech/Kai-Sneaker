package com.quanghao.backend.service;

import com.quanghao.backend.dto.ChangePasswordDTO;
import com.quanghao.backend.dto.UserProfileDTO;
import com.quanghao.backend.dto.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {


    UserProfileDTO getUserProfileByEmail(String email);

    UserProfileDTO updateUserProfileByEmail(String email, UserProfileDTO request);

    String changePasswordByEmail(String email, ChangePasswordDTO request);

    Page<UserResponseDTO> getAllUsers(String keyword, Pageable pageable);

    void updateUserStatus(Long id, String status);

    void updateUserRoles(Long id, List<Long> roleIds);
}
