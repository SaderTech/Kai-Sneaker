package com.quanghao.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CheckoutRequestDTO {
    @NotBlank(message = "Tên người nhận không được để trống!")
    private String fullName;

    @NotBlank(message = "Số điện thoại là bắt buộc!")
    @Pattern(regexp = "^(0[35789])[0-9]{8}$", message = "Số điện thoại không đúng định dạng Việt Nam!")
    private String phone;

    @NotBlank(message = "Vui lòng nhập địa chỉ giao hàng!")
    private String shippingAddress;

    private String note; // Ghi chú thì có thể để trống, không cần @NotBlank

    @NotNull(message = "Vui lòng chọn phương thức thanh toán!")
    private Long paymentMethodId;
}
