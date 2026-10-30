
package com.kishanmarket.customer;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/auth")
public class CustomerAuthController {

    private final CustomerAuthService customerAuthService;

    public CustomerAuthController(
            CustomerAuthService customerAuthService) {
        this.customerAuthService = customerAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        CustomerEntity customer = customerAuthService.register(
                request.fullName(),
                request.email(),
                request.password()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(
                        customer.getId(),
                        customer.getFullName(),
                        customer.getEmail(),
                        "Customer registration successful"
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        String token = customerAuthService.login(
                request.email(),
                request.password()
        );

        return ResponseEntity.ok(
                new LoginResponse(token, "Customer login successful")
        );
    }

    public record RegisterRequest(
            @NotBlank(message = "Full name is required")
            @Size(max = 100)
            String fullName,

            @NotBlank(message = "Email is required")
            @Email(message = "Enter a valid email")
            @Size(max = 150)
            String email,

            @NotBlank(message = "Password is required")
            @Size(min = 8, max = 72,
                    message = "Password must contain 8 to 72 characters")
            String password
    ) {}

    public record LoginRequest(
            @NotBlank
            @Email
            String email,

            @NotBlank
            @Size(min = 8, max = 72)
            String password
    ) {}

    public record AuthResponse(
            Long id,
            String fullName,
            String email,
            String message
    ) {}

    public record LoginResponse(
            String token,
            String message
    ) {}
}
