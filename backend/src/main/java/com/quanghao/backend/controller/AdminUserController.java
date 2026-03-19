package com.quanghao.backend.controller;

import com.quanghao.backend.dto.UserResponseDTO;
import com.quanghao.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/kaisneaker/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserResponseDTO>> listUsers(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(keyword, pageable));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        userService.updateUserStatus(id, request.get("status"));
        return ResponseEntity.ok("Cập nhật trạng thái thành công!");
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<String> updateRoles(@PathVariable Long id, @RequestBody List<Long> roleIds) {
        userService.updateUserRoles(id, roleIds);
        return ResponseEntity.ok("Cập nhật quyền thành công!");
    }
}