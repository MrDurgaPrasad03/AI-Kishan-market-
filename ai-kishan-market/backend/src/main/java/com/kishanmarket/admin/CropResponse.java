
package com.kishanmarket.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.kishanmarket.crop.CropEntity;

public record CropResponse(
        Long id,
        String name,
        String location,
        BigDecimal price,
        BigDecimal quantity,
        String farmerName,
        Long farmerId,
        String description,
        LocalDateTime createdAt
) {
    public static CropResponse from(CropEntity crop) {
        return new CropResponse(
                crop.getId(),
                crop.getName(),
                crop.getLocation(),
                crop.getPrice(),
                crop.getQuantity(),
                crop.getFarmerName(),
                crop.getFarmerId(),
                crop.getDescription(),
                crop.getCreatedAt()
        );
    }
}
