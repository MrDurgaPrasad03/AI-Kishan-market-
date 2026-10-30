
package com.kishanmarket.customer;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

   
@GetMapping
public List<CartItemResponse> getCart(Authentication authentication) {
    requireCustomer(authentication);
    Long customerId = (Long) authentication.getCredentials();
    return cartService.getCart(customerId);
}


    
@PostMapping("/items")
@ResponseStatus(HttpStatus.CREATED)
public CartItemResponse addItem(
        Authentication authentication,
        @Valid @RequestBody CartRequest request) {

    requireCustomer(authentication);
    Long customerId = (Long) authentication.getCredentials();

    CartItemEntity savedItem = cartService.addOrUpdate(
            customerId,
            request.cropId(),
            request.quantity());

    return cartService.getCart(customerId)
            .stream()
            .filter(item -> item.id().equals(savedItem.getId()))
            .findFirst()
            .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Cart item not found"));
}


   @PutMapping("/items/{itemId}")
public CartItemResponse updateItem(
        Authentication authentication,
        @PathVariable Long itemId,
        @Valid @RequestBody UpdateCartRequest request) {
    requireCustomer(authentication);
    Long customerId = (Long) authentication.getCredentials();

    cartService.updateItem(customerId, itemId, request.quantity());

    return cartService.getCart(customerId)
            .stream()
            .filter(item -> item.id().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Cart item not found"));
}

    @DeleteMapping("/items/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(
            Authentication authentication,
            @PathVariable Long itemId) {
        requireCustomer(authentication);
        Long customerId = (Long) authentication.getCredentials();

        cartService.remove(customerId, itemId);
    }

    private void requireCustomer(Authentication authentication) {
        if (authentication == null
                || !authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"))) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN,
                    "Customer account required");
        }
    }

    public record CartRequest(
            @NotNull @Positive Long cropId,
            @NotNull @DecimalMin(value = "0.01")
            BigDecimal quantity) {}

    public record UpdateCartRequest(
            @NotNull @DecimalMin(value = "0.01")
            BigDecimal quantity) {}
}
