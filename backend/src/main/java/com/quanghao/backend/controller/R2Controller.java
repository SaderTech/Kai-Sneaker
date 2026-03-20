package com.quanghao.backend.controller;

import com.quanghao.backend.service.R2Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kaisneaker/r2")
@RequiredArgsConstructor
public class R2Controller {

    private final R2Service r2Service;

    @GetMapping("/get-upload-url")
    public ResponseEntity<String> getPresignedUrl(
            @RequestParam String fileName,
            @RequestParam String contentType) {

        return ResponseEntity.ok(r2Service.generatePresignedUrl(fileName, contentType));
    }
}