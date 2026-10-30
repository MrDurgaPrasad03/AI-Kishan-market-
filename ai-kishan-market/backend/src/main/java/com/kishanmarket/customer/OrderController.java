
package com.kishanmarket.customer;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderEntity checkout(
            Authentication authentication,
            @Valid @RequestBody CheckoutRequest request) {

        requireCustomer(authentication);

        Long customerId = (Long) authentication.getCredentials();

        return orderService.checkout(
                customerId, request.paymentMethod());
    }

    @GetMapping("/my")
    public List<OrderEntity> myOrders(Authentication authentication) {
        requireCustomer(authentication);

        Long customerId = (Long) authentication.getCredentials();

        return orderService.getCustomerOrders(customerId);
    }

    private void requireCustomer(Authentication authentication) {
        if (authentication == null
                || authentication.getAuthorities().stream()
                .noneMatch(a ->
                        a.getAuthority().equals("ROLE_CUSTOMER"))) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN,
                    "Customer account required");
        }
    }

    public record CheckoutRequest(
            @NotBlank
            @Pattern(
                regexp = "CASH_ON_DELIVERY|DIRECT_TO_FARMER",
                message = "Choose CASH_ON_DELIVERY or DIRECT_TO_FARMER"
            )
            String paymentMethod) {
    }
}
