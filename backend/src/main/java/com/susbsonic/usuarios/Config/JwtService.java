package com.susbsonic.usuarios.Config;

import com.susbsonic.usuarios.models.DAO.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // Ahora la clave se lee del application.yml (mejor práctica)
    @Value("${jwt.secret}")
    private String secretKey;

    // Tiempo de expiración configurable
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Extrae el username (en nuestro caso será el email)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extrae el rol (lo usamos para la autorización)
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // Método genérico para extraer claims
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Genera el token JWT incluyendo el rol
    public String generateToken(UserDetails userDetails) {

        Map<String, Object> extraClaims = new HashMap<>();

        // Cojo el rol del usuario (ROLE_ADMIN o ROLE_USER)
        String role = userDetails.getAuthorities()
                .stream()
                .findFirst()
                .get()
                .getAuthority();

        // Lo añado como claim para que luego Spring Security lo use
        extraClaims.put("role", role);

        return Jwts.builder()
                .setClaims(extraClaims)
                // Usamos EMAIL como identificador
                .setSubject(((User) userDetails).getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Valida el token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String email = extractUsername(token);
        return (email.equals(((User) userDetails).getEmail())) && !isTokenExpired(token);
    }

    // Comprueba expiración
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extrae fecha de expiración
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extrae todos los claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Genera la clave de firma
    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
}