package com.f4.forum.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMaterialCommand {

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "Loại tài liệu không được để trống")
    private String materialType;

    @NotBlank(message = "Đường dẫn file không được để trống")
    private String fileUrl;
}
