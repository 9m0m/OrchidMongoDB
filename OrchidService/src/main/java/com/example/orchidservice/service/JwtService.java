package com.example.orchidservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.orchidservice.pojo.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final Set<String> invalidatedTokens = ConcurrentHashMap.newKeySet();
    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String generateToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        String roleName = account.getRole().getRoleName().toUpperCase();

        // Fix: Set both subject and claims before building token
        return Jwts.builder()
                .setSubject(account.getEmail())
                .claim("role", roleName) // Use claim() instead of setClaims()
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public List<GrantedAuthority> getAuthorities(String token) {
        try {
            String role = extractRole(token);
            log.debug("Extracted role from token: {}", role);
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());
            log.debug("Created authority: {}", authority.getAuthority());
            return Collections.singletonList(authority);
        } catch (Exception e) {
            log.error("Error getting authorities from token: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public void invalidateToken(String token) {
        invalidatedTokens.add(token);
    }

    public boolean isTokenValid(String token, Account account) {
        try {
            final String email = extractEmail(token);
            final String tokenRole = extractRole(token);
            final String accountRole = account.getRole().getRoleName().toUpperCase();

            log.debug("Token validation - Email: {}, TokenRole: {}, AccountRole: {}",
                    email, tokenRole, accountRole);

            return !invalidatedTokens.contains(token)
                    && email.equals(account.getEmail())
                    && tokenRole.equals(accountRole)
                    && !isTokenExpired(token);
        } catch (Exception e) {
            log.error("Token validation error: {}", e.getMessage());
            return false;
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        String role = claims.get("role", String.class);
        if (role == null) {
            throw new IllegalStateException("Role claim not found in token");
        }
        return role.toUpperCase();
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Base64.getDecoder().decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}