
package com.kishanmarket.admin;

import java.time.LocalDateTime;

import com.kishanmarket.auth.FarmerEntity;

public record FarmerResponse(
        Long id,
        String fullName,
        String email,
        String role,
        LocalDateTime createdAt
) {
    public static FarmerResponse from(FarmerEntity farmer) {
        return new FarmerResponse(
                farmer.getId(),
                farmer.getFullName(),
                farmer.getEmail(),
                farmer.getRole(),
                farmer.getCreatedAt()
        );
    }
}
