package com.quanghao.backend.dto;

import lombok.*;
import software.amazon.awssdk.auth.signer.params.TokenSignerParams;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String message;
    private String role;


}
