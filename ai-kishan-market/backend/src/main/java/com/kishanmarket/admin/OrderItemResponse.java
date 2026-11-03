
package com.kishanmarket.admin;

import java.math.BigDecimal;

import com.kishanmarket.customer.OrderItemEntity;

public record OrderItemResponse(
        Long id,
        Long cropId,
        String cropName,
        Long farmerId,
        String farmerName,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal,
        String status
) {
    public static OrderItemResponse from(OrderItemEntity item) {
        return new OrderItemResponse(
                item.getId(),
                item.getCropId(),
                item.getCropName(),
                item.getFarmerId(),
                item.getFarmerName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getLineTotal(),
                item.getStatus()
        );
    }
}
