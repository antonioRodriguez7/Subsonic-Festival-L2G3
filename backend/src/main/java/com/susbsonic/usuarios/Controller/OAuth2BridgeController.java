package com.susbsonic.usuarios.Controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class OAuth2BridgeController {
    @GetMapping("/api/auth/google-login")
    public void googleLoginBridge(
            @RequestParam(defaultValue = "ROLE_USER") String role,
            HttpServletResponse response) throws IOException {

        // 1. Creamos la cookie PERO directamente en el servidor del backend
        Cookie roleCookie = new Cookie("oauth_role", role);
        roleCookie.setPath("/");
        roleCookie.setMaxAge(300); // 5 minutos de vida
        roleCookie.setSecure(true); // Requiere HTTPS
        response.addCookie(roleCookie);

        // 2. Ahora sí, le pasamos el control al flujo normal de Google
        response.sendRedirect("/oauth2/authorization/google");
    }
}
