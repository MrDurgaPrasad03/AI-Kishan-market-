
package com.kishanmarket.customer;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.kishanmarket.auth.JwtService;

@Service
public class CustomerAuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public CustomerAuthService(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public CustomerEntity register(
            String fullName,
            String email,
            String password) {

        String normalizedEmail = email.trim().toLowerCase();

        if (customerRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered");
        }

        CustomerEntity customer = new CustomerEntity();
        customer.setFullName(fullName.trim());
        customer.setEmail(normalizedEmail);
        customer.setPassword(passwordEncoder.encode(password));

        return customerRepository.save(customer);
    }

    public String login(String email, String rawPassword) {
        String normalizedEmail = email.trim().toLowerCase();

        CustomerEntity customer = customerRepository
                .findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"));

        if (!passwordEncoder.matches(
                rawPassword, customer.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password");
        }

        return jwtService.generateCustomerToken(customer);
    }
}
