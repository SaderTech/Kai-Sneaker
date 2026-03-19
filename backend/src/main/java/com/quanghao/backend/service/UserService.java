package com.quanghao.backend.service;

import com.quanghao.backend.dto.ChangePasswordDTO;
import com.quanghao.backend.dto.UserProfileDTO;

public interface UserService {


    UserProfileDTO getUserProfileByEmail(String email);

    UserProfileDTO updateUserProfileByEmail(String email, UserProfileDTO request);

    String changePasswordByEmail(String email, ChangePasswordDTO request);
}
