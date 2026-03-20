package com.quanghao.backend.configuration;


import com.quanghao.backend.configuration.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RuntimeException("Bạn chưa đăng nhập!");
        }
        Object principal = auth.getPrincipal();

        if (principal instanceof UserPrincipal) {
            return ((UserPrincipal) principal).getId();
        }

        throw new RuntimeException("Phiên đăng nhập không hợp lệ hoặc đã hết hạn!");
    }
}