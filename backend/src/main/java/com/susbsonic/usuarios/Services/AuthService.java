package com.susbsonic.usuarios.Services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.susbsonic.usuarios.Config.JwtService;
import com.susbsonic.usuarios.models.DAO.User;
import com.susbsonic.usuarios.models.DTO.AuthResponseDTO;
import com.susbsonic.usuarios.models.DTO.UserRegisterDTO;
import com.susbsonic.usuarios.models.RoleList;
import com.susbsonic.usuarios.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${google.client.id}")
    private String googleClientId;

    // --- REGISTRO MANUAL ---
    public AuthResponseDTO register(UserRegisterDTO registerDTO) {

        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        if (userRepository.findByUsername(registerDTO.getUsername()).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        // 🔍 LÓGICA DE ROL DINÁMICA
        // Convertimos el String que viene de React (ej: "ROLE_PROVEEDOR") al Enum de Java
        RoleList roleToAssign;
        try {
            if (registerDTO.getRole() != null && !registerDTO.getRole().isEmpty()) {
                roleToAssign = RoleList.valueOf(registerDTO.getRole().toUpperCase());
            } else {
                roleToAssign = RoleList.ROLE_USER;
            }
        } catch (IllegalArgumentException e) {
            roleToAssign = RoleList.ROLE_USER; // Si el rol no existe, por defecto USER
        }

        User user = User.builder()
                .name(registerDTO.getName())
                .surname(registerDTO.getSurname())
                .username(registerDTO.getUsername())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(roleToAssign) // ✅ AHORA USA EL ROL CORRECTO
                .isAdmin(roleToAssign == RoleList.ROLE_ADMIN) // Si es Admin, ponemos isAdmin a true
                .verified(false)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return AuthResponseDTO.builder()
                .id(savedUser.getId())
                .token(token)
                .role(savedUser.getRole().name())
                .message("Usuario registrado con éxito")
                .build();
    }

    // --- LOGIN MANUAL (Se queda igual, ya estaba bien) ---
    public AuthResponseDTO login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtService.generateToken(user);

        return AuthResponseDTO.builder()
                .id(user.getId())
                .token(token)
                .role(user.getRole().name())
                .message("Login exitoso")
                .build();
    }

    // --- LOGIN CON GOOGLE ---
    public AuthResponseDTO loginConGoogle(String tokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(tokenString);

            if (idToken == null) {
                throw new RuntimeException("Token de Google inválido");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();

            User usuarioSistema = userRepository.findByEmail(email).orElseGet(() -> {
                String baseUsername = email.split("@")[0];

                return userRepository.save(User.builder()
                        .email(email)
                        .name((String) payload.get("given_name"))
                        .surname((String) payload.get("family_name"))
                        .username(baseUsername)
                        .password("")
                        .role(RoleList.ROLE_USER) // Google siempre es USER por defecto
                        .isAdmin(false)
                        .verified(true)
                        .build());
            });

            String token = jwtService.generateToken(usuarioSistema);

            return AuthResponseDTO.builder()
                    .id(usuarioSistema.getId())
                    .token(token)
                    .role(usuarioSistema.getRole().name())
                    .message("Login con Google exitoso")
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Error en Google Auth: " + e.getMessage());
        }
    }
}