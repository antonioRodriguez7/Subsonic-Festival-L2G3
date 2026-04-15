package com.susbsonic.usuarios.Config;

import com.susbsonic.usuarios.Repositories.UserRepository;
import com.susbsonic.usuarios.models.AuthProvider;
import com.susbsonic.usuarios.models.DAO.User;
import com.susbsonic.usuarios.models.RoleList;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;



@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

// 1. Obtenemos el email que nos da Google
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // 2. Buscamos al usuario en PostgreSQL (sabemos que existe porque lo acabamos de crear en el UserService)
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 3. Generamos el JWT pasando el objeto User entero
        String token = jwtService.generateToken(user);
        String role = user.getRole().name(); // Extraemos el rol (ej. ROLE_USER)

        // 4. Redirigimos a React pasando los 3 datos clave por la URL
        String targetUrl = "http://localhost:5173/perfil?token=" + token + "&email=" + email + "&role=" + role;

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}