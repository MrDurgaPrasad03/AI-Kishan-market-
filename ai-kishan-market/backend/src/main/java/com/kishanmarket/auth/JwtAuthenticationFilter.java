
package com.kishanmarket.auth;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {
                System.out.println(
    "JWT FILTER REACHED: " + request.getMethod() + " " + request.getRequestURI()
);

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                Claims claims = jwtService.validateAndGetClaims(token);
                 System.out.println("JWT valid: true");
                    System.out.println("JWT subject: " + claims.getSubject());
                    System.out.println("JWT role: " + claims.get("role", String.class));
                String email = claims.getSubject();
                String role = claims.get("role", String.class);
                Long farmerId = claims.get("farmerId", Long.class);
                if (email != null && role != null && farmerId != null
        && SecurityContextHolder.getContext().getAuthentication() == null) {

    var authentication = new UsernamePasswordAuthenticationToken(
            email,
            farmerId,
            java.util.List.of(new SimpleGrantedAuthority("ROLE_" + role))
    );

    SecurityContextHolder.getContext().setAuthentication(authentication);
}

            } catch (JwtException | IllegalArgumentException ex) {
                System.out.println("JWT validation failed: " + ex.getClass().getSimpleName());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"message\":\"Invalid or expired access token\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
