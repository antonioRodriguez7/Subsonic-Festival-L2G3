package com.susbsonic.usuarios.Config;

import com.susbsonic.usuarios.Repositories.UserRepository;
import com.susbsonic.usuarios.models.AuthProvider;
import com.susbsonic.usuarios.models.DAO.User;
import com.susbsonic.usuarios.models.RoleList;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;


@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Extraemos los datos de Google
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("given_name");
        String surname = oAuth2User.getAttribute("family_name");
        String providerId = oAuth2User.getAttribute("sub");

        // Buscamos si el usuario ya existe, si no, lo creamos
        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    // Si ya existe pero no tenía providerId (ej. se registró manual antes), se lo asignamos
                    if (existingUser.getProvider() == null) {
                        existingUser.setProvider(AuthProvider.GOOGLE);
                        existingUser.setProviderId(providerId);
                        return userRepository.save(existingUser);
                    }
                    return existingUser;
                })
                .orElseGet(() -> {
                    // Usuario nuevo: lo registramos como ROLE_USER por defecto
                    User newUser = User.builder()
                            .email(email)
                            .name(name)
                            .surname(surname)
                            .provider(AuthProvider.GOOGLE)
                            .providerId(providerId)
                            .role(RoleList.ROLE_USER)
                            .isAdmin(false)
                            .build();
                    return userRepository.save(newUser);
                });

        // Generamos el token usando tu JwtService existente
        String token = jwtService.generateToken(user);

        // Redirigimos a React con el token en la URL
        // El puerto 5173 es el de tu Vite
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}