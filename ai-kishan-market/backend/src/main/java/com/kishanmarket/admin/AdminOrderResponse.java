
package com.kishanmarket.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.kishanmarket.customer.OrderEntity;

public record AdminOrderResponse(
        Long id,
        Long customerId,
        String customerName,
        String customerEmail,
        String paymentMethod,
        String paymentStatus,
        BigDecimal totalAmount,
        String status,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
    public static AdminOrderResponse from(
            OrderEntity order,
            List<OrderItemResponse> items) {

        return new AdminOrderResponse(
                order.getId(),
                order.getCustomerId(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                items
        );
    }
}
