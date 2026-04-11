package com.susbsonic.usuarios.Controller;

import com.susbsonic.usuarios.models.DTO.AuthResponseDTO;
import com.susbsonic.usuarios.models.DTO.GoogleTokenDTO;
import com.susbsonic.usuarios.models.DTO.UserLoginDTO;
import com.susbsonic.usuarios.models.DTO.UserRegisterDTO;
import com.susbsonic.usuarios.Services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// Importante: Asegúrate de que el CORS esté permitido para el puerto de React
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody UserRegisterDTO registerDTO) {
        try {
            AuthResponseDTO response = authService.register(registerDTO);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // CORRECCIÓN: Usamos Builder para evitar errores de constructor
            return ResponseEntity.badRequest()
                    .body(AuthResponseDTO.builder()
                            .message("Error al registrar: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody UserLoginDTO loginDTO) {
        try {
            AuthResponseDTO response = authService.login(
                    loginDTO.getEmail(),
                    loginDTO.getPassword()
            );
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // CORRECCIÓN: Usamos Builder y status 401 para credenciales fallidas
            return ResponseEntity.status(401)
                    .body(AuthResponseDTO.builder()
                            .message("Error de autenticación: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponseDTO> googleLogin(@RequestBody GoogleTokenDTO googleTokenDTO) {
        try {
            AuthResponseDTO response = authService.loginConGoogle(googleTokenDTO.getToken());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                    .body(AuthResponseDTO.builder()
                            .message("Error en Google Auth: " + e.getMessage())
                            .build());
        }
    }
}