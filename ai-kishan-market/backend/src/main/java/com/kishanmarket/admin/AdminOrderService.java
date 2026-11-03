
package com.kishanmarket.admin;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kishanmarket.customer.OrderEntity;
import com.kishanmarket.customer.OrderRepository;
import com.kishanmarket.customer.OrderItemEntity;
import com.kishanmarket.customer.OrderItemRepository;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public AdminOrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> getAllOrders() {

        return orderRepository.findAll().stream().map(order -> {

            List<OrderItemResponse> items =
                    orderItemRepository.findByOrder_Id(order.getId())
                            .stream()
                            .map(OrderItemResponse::from)
                            .toList();

            return AdminOrderResponse.from(order, items);

        }).toList();
    }

    // Admin updates an individual order item's status
    @Transactional
    public OrderItemResponse updateOrderItemStatus(
            Long itemId,
            String requestedStatus) {

        if (requestedStatus == null) {
            throw new IllegalArgumentException("Status is required");
        }

        String status = requestedStatus.trim().toUpperCase();

        if (!List.of(
                "PENDING",
                "ACCEPTED",
                "REJECTED",
                "COMPLETED",
                "CANCELLED"
        ).contains(status)) {
            throw new IllegalArgumentException("Invalid order item status");
        }

        OrderItemEntity item = orderItemRepository.findById(itemId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order item not found"));

        if ("COMPLETED".equals(status)
                && !"ACCEPTED".equals(item.getStatus())) {

            throw new IllegalArgumentException(
                    "Only accepted orders can be completed");
        }

        item.setStatus(status);

        OrderItemEntity savedItem =
                orderItemRepository.save(item);

        // Update the parent order status
        updateOverallOrderStatus(savedItem.getOrder().getId());

        return OrderItemResponse.from(savedItem);
    }

    // Calculate overall order status from all its items
   
    // Calculate overall order status from all its items
    private void updateOverallOrderStatus(Long orderId) {

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order not found"));

        List<OrderItemEntity> items =
                orderItemRepository.findByOrder_Id(orderId);

        if (items.isEmpty()) {
            return;
        }

        List<String> statuses = items.stream()
                .map(OrderItemEntity::getStatus)
                .toList();

        String overallStatus;

        if (statuses.stream().allMatch("PENDING"::equals)) {
            overallStatus = "PLACED";
        } else if (statuses.stream().allMatch("ACCEPTED"::equals)) {
            overallStatus = "ACCEPTED";
        } else if (statuses.stream().allMatch("COMPLETED"::equals)) {
            overallStatus = "COMPLETED";
        } else if (statuses.stream().allMatch("REJECTED"::equals)) {
            overallStatus = "REJECTED";
        } else if (statuses.stream().allMatch("CANCELLED"::equals)) {
            overallStatus = "CANCELLED";
        } else {
            overallStatus = "PROCESSING";
        }

        order.setStatus(overallStatus);
        orderRepository.save(order);
    }

    // Recalculate all existing order statuses
    @Transactional
    public void recalculateAllOrderStatuses() {

        List<OrderEntity> orders = orderRepository.findAll();

        for (OrderEntity order : orders) {
            updateOverallOrderStatus(order.getId());
        }
    }

}
