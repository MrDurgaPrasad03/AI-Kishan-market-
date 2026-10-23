
package com.kishanmarket.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
@Service
public class AuthService {

    private final FarmerRepository farmerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

 public AuthService(
        FarmerRepository farmerRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService) {
    this.farmerRepository = farmerRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}

    @Transactional
    public FarmerEntity register(
            String fullName,
            String email,
            String password) {

        String normalizedEmail = email.trim().toLowerCase();

        if (farmerRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered");
        }

        FarmerEntity farmer = new FarmerEntity();
        farmer.setFullName(fullName.trim());
        farmer.setEmail(normalizedEmail);
        farmer.setPassword(passwordEncoder.encode(password));

        return farmerRepository.save(farmer);
    }
    
public String login(String email, String rawPassword) {
    String normalizedEmail = email.trim().toLowerCase();

    FarmerEntity farmer = farmerRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new org.springframework.web.server
                    .ResponseStatusException(
                            org.springframework.http.HttpStatus.UNAUTHORIZED,
                            "Invalid email or password"));

    if (!passwordEncoder.matches(rawPassword, farmer.getPassword())) {
        throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED,
                "Invalid email or password");
    }

    return jwtService.generateToken(farmer);
}

}
