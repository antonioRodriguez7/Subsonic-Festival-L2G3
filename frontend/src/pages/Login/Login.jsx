import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { loginUsuario } from '../../services/api';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Por favor, rellena todos los campos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await loginUsuario(email, password);

            // Guardamos los datos necesarios en LocalStorage
            if (data && data.token) {
                localStorage.setItem('subsonic_token', data.token);
                localStorage.setItem('user_role', data.role);
                localStorage.setItem('user_email', email);
            }

            const role = data.role ? data.role.toUpperCase().trim() : '';
            console.log("Acceso concedido. Rol detectado:", role);

            // Redirigimos siempre a /perfil, para que pasen primero por "Mi Perfil"
            // y desde allí puedan acceder a sus paneles de administración o proveedor.
            window.location.href = '/perfil';

        } catch (err) {
            console.error("Error en el inicio de sesión:", err);
            setError('Email o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                {/* Logo */}
                <div className="login-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/logoPI.png" alt="Logo Subsonic" />
                </div>

                <div className="login-box">
                    <h2>Iniciar Sesión</h2>
                    <p>Bienvenido de nuevo</p>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                required
                            />
                        </div>

                        {error && (
                            <p className="error-msg" style={{ color: '#ff4d6d', fontSize: '13px', textAlign: 'center', margin: '10px 0' }}>
                                {error}
                            </p>
                        )}

                        <button type="submit" className="btn-entrar" disabled={loading}>
                            {loading ? 'CONECTANDO...' : 'ENTRAR'}
                        </button>
                    </form>

                    {/* ✅ AQUÍ ESTÁN LOS ENLACES QUE FALTABAN */}
                    <div className="login-links">
                        <a href="#olvido" className="link-olvido" style={{ display: 'block', marginBottom: '10px', fontSize: '14px', textDecoration: 'none', color: '#aaa' }}>
                            ¿Olvidaste la contraseña?
                        </a>

                        <p className="link-registro" style={{ fontSize: '14px', color: '#fff' }}>
                            ¿No tienes cuenta?
                            <span
                                onClick={() => navigate('/registro')}
                                style={{ cursor: 'pointer', color: '#df188a', fontWeight: 'bold', marginLeft: '5px' }}
                            >
                                Regístrate aquí
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="login-right">
                {/* Background image/video se gestiona por CSS */}
            </div>
        </div>
    );
}

export default Login;