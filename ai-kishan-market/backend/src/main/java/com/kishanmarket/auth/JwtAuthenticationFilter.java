
package com.kishanmarket.auth;

import java.io.IOException;
import java.util.List;

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

        String header = request.getHeader("Authorization");
        System.out.println("JWT DEBUG - Request: " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("JWT DEBUG - Authorization header present: " + (header != null));
        System.out.println("JWT DEBUG - Method and path: "
        + request.getMethod() + " " + request.getRequestURI());
        
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                Claims claims = jwtService.validateAndGetClaims(token);
                System.out.println("JWT DEBUG - Token validated successfully");
                System.out.println("JWT DEBUG - Role: " + claims.get("role"));
                 System.out.println("JWT DEBUG - Customer ID: " + claims.get("customerId"));
                System.out.println("JWT DEBUG - Farmer ID: " + claims.get("farmerId"));
                String email = claims.getSubject();
                String role = claims.get("role", String.class);

                Long accountId = null;

                if ("FARMER".equals(role)) {
                    accountId = claims.get("farmerId", Long.class);
                } else if ("CUSTOMER".equals(role)) {
                    accountId = claims.get("customerId", Long.class);
                }

                if (email != null
                        && role != null
                        && accountId != null
                        && SecurityContextHolder.getContext()
                                .getAuthentication() == null) {

                    var authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    accountId,
                                    List.of(new SimpleGrantedAuthority(
                                            "ROLE_" + role))
                            );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }

            } catch (JwtException | IllegalArgumentException ex) {
                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write(
                        "{\"message\":\"Invalid or expired access token\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
