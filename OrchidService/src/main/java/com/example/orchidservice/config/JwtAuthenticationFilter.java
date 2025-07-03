package com.example.orchidservice.config;

import com.example.orchidservice.pojo.Account;
import com.example.orchidservice.repository.AccountRepository;
import com.example.orchidservice.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = authHeader.substring(7);
            String email = jwtService.extractEmail(jwt);

            log.debug("Processing request for email: {}", email);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Optional<Account> accountOpt = accountRepository.findByEmailWithRole(email);

                if (accountOpt.isPresent()) {
                    Account account = accountOpt.get();

                    if (jwtService.isTokenValid(jwt, account)) {
                        List<GrantedAuthority> authorities = jwtService.getAuthorities(jwt);

                        log.debug("User: {}, Authorities: {}", email, authorities);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                account,
                                null,
                                authorities
                        );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);

                        log.debug("Authentication successful for user: {}", email);
                    } else {
                        log.warn("Invalid token for user: {}", email);
                    }
                } else {
                    log.warn("User not found: {}", email);
                }
            }
        } catch (Exception e) {
            log.error("Authentication error: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        log.debug("Request path: {}, method: {}", path, method);

        // Skip authentication for public endpoints
        return path.startsWith("/api/accounts/register") ||
                path.startsWith("/api/accounts/login") ||
                path.startsWith("/api/accounts/logout") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/api-docs") ||
                path.startsWith("/webjars") ||
                // Skip authentication for public GET requests to orchids and categories
                (method.equals("GET") && path.startsWith("/api/orchids")) ||
                (method.equals("GET") && path.startsWith("/api/categories"));
    }
}