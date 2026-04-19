package com.susbsonic.usuarios.Config;

import com.susbsonic.usuarios.Services.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CONFIGURACIÓN DE CORS MEJORADA
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*")); // Permitimos todos los headers para evitar el 403
                    config.setAllowCredentials(true);
                    return config;
                }))

                // 2. DESACTIVAR CSRF
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        // 0. Permitir OPTIONS para evitar bloqueos de CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        
                        // 1. Todo lo relacionado con AUTH es público
                        .requestMatchers("/api/auth/**").permitAll()

                        // 2. CONTENIDO PÚBLICO
                        .requestMatchers(HttpMethod.GET, "/api/artists/**", "/api/tickets/**", "/api/spaces/**", "/api/services", "/api/services/provider", "/uploads/**").permitAll()

                        // 3. GESTIÓN (Solo Admin)
                        .requestMatchers(HttpMethod.POST, "/api/artists/**", "/api/tickets/**", "/api/spaces/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/artists/**", "/api/tickets/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/spaces/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_PROVEEDOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/artists/**", "/api/tickets/**", "/api/spaces/**").hasAnyAuthority("ROLE_ADMIN")
                        
                        // SERVICIOS PROVEEDORES: Re-aseguramos ahora que funciona
                        .requestMatchers("/api/services/**").authenticated()

                        // 4. COMPRAS Y PERFIL: Requiere Token
                        .requestMatchers("/api/purchases/**", "/api/users/**").authenticated()
                        .requestMatchers("/api/payments/paypal/**").permitAll()

                        // 5. CUALQUIER OTRA RUTA
                        .anyRequest().authenticated()
                )

                // GOOGLE OAUTH2: Añadimos el flujo de login con OAuth2
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService) // Nuestro servicio que guarda en BD
                        )
                        .successHandler(oAuth2LoginSuccessHandler) // Nuestro manejador de éxito
                )

                // 4. GESTIÓN DE SESIÓN STATELESS (JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 5. FILTROS Y PROVEEDOR
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}