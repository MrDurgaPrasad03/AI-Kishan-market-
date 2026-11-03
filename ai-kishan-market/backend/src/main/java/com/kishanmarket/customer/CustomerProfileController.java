
package com.kishanmarket.customer;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/customer")
public class CustomerProfileController {

    private final CustomerRepository customerRepository;

    public CustomerProfileController(
            CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping("/profile")
    public CustomerProfileResponse getProfile(
            Authentication authentication) {

        if (authentication == null ||
                authentication.getAuthorities().stream()
                .noneMatch(a ->
                    a.getAuthority().equals("ROLE_CUSTOMER"))) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Customer account required"
            );
        }

        Long customerId = (Long) authentication.getCredentials();

        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Customer not found"
                ));

        return new CustomerProfileResponse(
            customer.getId(),
            customer.getFullName(),
            customer.getEmail(),
            customer.getRole(),
            customer.getCreatedAt()
        );
    }

    public record CustomerProfileResponse(
        Long id,
        String fullName,
        String email,
        String role,
        java.time.LocalDateTime createdAt
    ) {}
}
