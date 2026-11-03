
package com.kishanmarket.admin;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kishanmarket.auth.JwtService;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminService(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String login(String email, String password) {

        String normalizedEmail = email.trim().toLowerCase();

        AdminEntity admin = adminRepository
                .findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        boolean passwordMatches =
                passwordEncoder.matches(password, admin.getPassword());

        System.out.println("Admin found: " + admin.getEmail());
        System.out.println("Role: " + admin.getRole());
        System.out.println("Password matches: " + passwordMatches);

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtService.generateAdminToken(admin);
    }
}
