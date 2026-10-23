
package com.kishanmarket.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        FarmerEntity farmer = authService.register(
                request.fullName(),
                request.email(),
                request.password()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(
                        farmer.getId(),
                        farmer.getFullName(),
                        farmer.getEmail(),
                        "Registration successful"
                ));
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
    ) {
    }

    public record AuthResponse(
            Long id,
            String fullName,
            String email,
            String message
    ) {
    }
    
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(
        @Valid @RequestBody LoginRequest request) {

    String token = authService.login(
            request.email(),
            request.password()
    );

    return ResponseEntity.ok(
            new LoginResponse(token, "Login successful")
    );
}

public record LoginRequest(
        @jakarta.validation.constraints.NotBlank
        @jakarta.validation.constraints.Email
        String email,

        @jakarta.validation.constraints.NotBlank
        @jakarta.validation.constraints.Size(min = 8, max = 72)
        String password
) {
}

public record LoginResponse(
        String token,
        String message
) {
}

}
