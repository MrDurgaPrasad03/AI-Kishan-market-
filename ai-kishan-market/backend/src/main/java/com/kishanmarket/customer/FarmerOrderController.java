
package com.kishanmarket.customer;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@RestController
@RequestMapping("/api/farmer/orders")
public class FarmerOrderController {

    private final OrderItemRepository orderItemRepository;

    public FarmerOrderController(
            OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    // View only this farmer's ordered crop items
    @GetMapping
    public List<OrderItemEntity> getFarmerOrderItems(
            Authentication authentication) {

        requireFarmer(authentication);

        Long farmerId = (Long) authentication.getCredentials();

        return orderItemRepository.findByFarmerId(farmerId);
    }

    // Update an individual order item's status
    @PatchMapping("/items/{itemId}/status")
    public OrderItemEntity updateOrderItemStatus(
            Authentication authentication,
            @PathVariable Long itemId,
            @Valid @RequestBody StatusRequest request) {

        requireFarmer(authentication);

        Long farmerId = (Long) authentication.getCredentials();

        OrderItemEntity item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Order item not found"));

        if (!farmerId.equals(item.getFarmerId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot update another farmer's order item");
        }

        if ("COMPLETED".equals(request.status())
                && !"ACCEPTED".equals(item.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only accepted orders can be completed");
        }

        item.setStatus(request.status());

        return orderItemRepository.save(item);
    }

    private void requireFarmer(Authentication authentication) {
        if (authentication == null
                || authentication.getAuthorities().stream()
                .noneMatch(a ->
                        a.getAuthority().equals("ROLE_FARMER"))) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Farmer account required");
        }
    }

    public record StatusRequest(
            @NotBlank(message = "Order status is required")
            @Pattern(
                regexp = "ACCEPTED|REJECTED|COMPLETED|CANCELLED",
                message = "Invalid order status"
            )
            String status) {
    }
}
