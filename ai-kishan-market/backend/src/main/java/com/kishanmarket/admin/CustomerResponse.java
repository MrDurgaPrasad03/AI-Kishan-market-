
package com.kishanmarket.admin;

import java.time.LocalDateTime;

import com.kishanmarket.customer.CustomerEntity;

public record CustomerResponse(
        Long id,
        String fullName,
        String email,
        String role,
        LocalDateTime createdAt
) {
    public static CustomerResponse from(CustomerEntity customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getRole(),
                customer.getCreatedAt()
        );
    }
}
