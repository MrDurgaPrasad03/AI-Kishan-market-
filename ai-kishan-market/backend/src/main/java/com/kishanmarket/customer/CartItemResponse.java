
package com.kishanmarket.customer;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CartItemResponse(
        Long id,
        Long customerId,
        Long cropId,
        String cropName,
        String location,
        BigDecimal price,
        BigDecimal availableQuantity,
        String farmerName,
        Long farmerId,
        BigDecimal quantity,
        LocalDateTime createdAt
) {
}
