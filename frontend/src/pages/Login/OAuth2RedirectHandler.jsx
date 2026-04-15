import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../services/realBackend'; // Ajusta la ruta si es necesario

const OAuth2RedirectHandler = ({ setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUserData = async (token) => {
            try {
                // 1. Guardamos el token en localStorage primero. 
                // Así, el interceptor de Axios en realBackend.js lo cogerá para la siguiente petición.
                localStorage.setItem('subsonic_token', token);

                // 2. Pedimos los datos del usuario a Spring Boot
                const userData = await getCurrentUser();

                // 3. Guardamos el resto de datos que necesita tu App
                localStorage.setItem('user_id', userData.id);
                localStorage.setItem('user_email', userData.email);
                localStorage.setItem('user_role', userData.role);

                // 4. Actualizamos el estado global de App.jsx
                setUser({ token: token, role: userData.role, email: userData.email });

                // 5. ¡Listo! Redirigimos al sistema de perfiles
                navigate('/perfil');
            } catch (error) {
                console.error("Error obteniendo datos del usuario tras login con Google:", error);
                // Si algo falla, limpiamos y mandamos al login normal
                localStorage.clear();
                navigate('/login');
            }
        };

        // Extraemos el token que Spring Boot puso en la URL (ej: ?token=eyJhbG...)
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');

        if (token) {
            fetchUserData(token);
        } else {
            console.error("No se encontró ningún token en la URL");
            navigate('/login');
        }
    }, [location, navigate, setUser]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: 'white' }}>
            <h2>Autenticando de forma segura con Google...</h2>
        </div>
    );
};

export default OAuth2RedirectHandler;