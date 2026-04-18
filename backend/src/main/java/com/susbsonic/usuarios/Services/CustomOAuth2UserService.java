package com.susbsonic.usuarios.Services;

import com.susbsonic.usuarios.models.AuthProvider;
import com.susbsonic.usuarios.models.DAO.User;
import com.susbsonic.usuarios.Repositories.UserRepository;
import com.susbsonic.usuarios.models.RoleList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HttpServletRequest request;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
// 1. Obtenemos los datos básicos de Google
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2. Extraemos atributos específicos de la cuenta de Google
        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");
        String googleId = oAuth2User.getAttribute("sub");

        // Validaciones para campos obligatorios en tu DB
        if (lastName == null) lastName = "";
        if (firstName == null) firstName = oAuth2User.getAttribute("name");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            // 3. Creamos el usuario cumpliendo con las restricciones de User.java
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(firstName);
            newUser.setSurname(lastName);
            newUser.setUsername(email); // Usamos el email como username único inicial
            newUser.setProvider(AuthProvider.GOOGLE);
            newUser.setProviderId(googleId);
            // Intentar extraer el rol de la cookie si existe
            RoleList assignedRole = RoleList.ROLE_USER;
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if ("oauth_role".equals(cookie.getName())) {
                        try {
                            assignedRole = RoleList.valueOf(cookie.getValue());
                        } catch (IllegalArgumentException e) {
                            // Ignorar si el rol no es válido
                        }
                    }
                }
            }

            newUser.setAdmin(assignedRole == RoleList.ROLE_ADMIN);
            newUser.setRole(assignedRole); // Ajustado según la Cookie o el valor por defecto

            // 👉 AÑADE ESTA LÍNEA: Generamos una contraseña aleatoria imposible de adivinar
            newUser.setPassword(java.util.UUID.randomUUID().toString());

            userRepository.save(newUser);
        }

        return oAuth2User;
    }
}
