import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import './Registro.css';
import { registrarUsuario } from '../../services/api';

function Registro() {
    const navigate = useNavigate();

    // 1. Estados actualizados con 'surname' para evitar el error de base de datos
    const [formData, setFormData] = useState({
        name: '',
        surname: '', // <--- CAMBIO: Agregado para cumplir con el NOT NULL de SQL
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [tipoUsuario, setTipoUsuario] = useState('CLIENTE');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
        if (e.target.name === 'password') {
            setPasswordStrength(getPasswordStrength(e.target.value));
        }
    };

    // Función para validar la fortaleza de la contraseña
    const getPasswordStrength = (password) => {
        if (password.length < 8) return 'Débil: Mínimo 8 caracteres';
        if (!/[a-z]/.test(password)) return 'Débil: Debe contener al menos una letra minúscula';
        if (!/[A-Z]/.test(password)) return 'Débil: Debe contener al menos una letra mayúscula';
        if (!/\d/.test(password)) return 'Débil: Debe contener al menos un número';
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Débil: Debe contener al menos un carácter especial';
        return 'Fuerte';
    };

    const isPasswordStrong = (password) => {
        return password.length >= 8 &&
               /[a-z]/.test(password) &&
               /[A-Z]/.test(password) &&
               /\d/.test(password) &&
               /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    };

    // 2. Función de registro con el mapeo correcto a las columnas de tu DB
    const handleRegistro = async (e) => {
        if (e) e.preventDefault();
        setError('');

        // Validación de campos obligatorios
        if (!formData.name || !formData.surname || !formData.email || !formData.password) {
            setError("Por favor, rellena todos los campos (Nombre, Apellidos, Email y Contraseña).");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!isPasswordStrong(formData.password)) {
            setError("La contraseña no cumple con los requisitos de seguridad. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
            return;
        }

        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            setError("Debes aceptar los términos y condiciones.");
            return;
        }

        setLoading(true);

        try {
            // Mapeamos exactamente a lo que espera tu tabla 'users'
            const datosParaEnviar = {
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                isAdmin: tipoUsuario === 'ADMINISTRADOR',
                //Mapeamos el string de la UI al ROLE de Java
                role: tipoUsuario === 'ADMINISTRADOR' ? 'ROLE_ADMIN' :
                    tipoUsuario === 'PROVEEDOR' ? 'ROLE_PROVEEDOR' : 'ROLE_USER'
            };

            await registrarUsuario(datosParaEnviar);

            alert("¡Cuenta creada con éxito! Ya puedes iniciar sesión.");
            navigate('/login');

        } catch (err) {
            console.error("Error en el registro:", err);
            // Mostramos el error real que viene del servidor (ej: si el email ya existe)
            setError(err.response?.data?.message || "Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    // --- OAUTH2 GOOGLE REGISTRO ---
    const handleGoogleRegistro = () => {
        // Obtenemos el rol actual seleccionado en la UI y lo guardamos en una cookie
        // que el backend podrá leer durante el callback de Google.
        const role = tipoUsuario === 'ADMINISTRADOR' ? 'ROLE_ADMIN' :
                     tipoUsuario === 'PROVEEDOR' ? 'ROLE_PROVEEDOR' : 'ROLE_USER';
        
        document.cookie = `oauth_role=${role}; path=/; max-age=300`; // Expira en 5 minutos
        
        // Redirige al backend de Spring Boot para iniciar el login con Google
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };
    // ------------------------------

    return (
        <div className="registro-wrapper">
            <div className="registro-top">
                <img
                    src="/logoPI.png"
                    alt="Logo Subsonic"
                    className="registro-logo"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                />
                <h2>REGISTRO DE USUARIO</h2>
            </div>

            <div className="registro-container">
                {/* IZQUIERDA: FORMULARIO ACTUALIZADO */}
                <div className="registro-left">
                    <h3 className="section-title">👤 INFORMACIÓN PERSONAL</h3>

                    {error && (
                        <p style={{
                            color: 'white',
                            backgroundColor: '#ff4d6d',
                            padding: '10px',
                            borderRadius: '5px',
                            fontSize: '14px',
                            marginBottom: '15px'
                        }}>
                            {error}
                        </p>
                    )}

                    <form className="registro-form" onSubmit={handleRegistro}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input name="name" type="text" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
                            <input name="surname" type="text" placeholder="Apellidos" value={formData.surname} onChange={handleChange} required />
                        </div>
                        <input name="email" type="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
                        <input name="username" type="text" placeholder="Nombre de usuario" value={formData.username} onChange={handleChange} required />
                        <input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
                        {formData.password && (
                            <p style={{
                                fontSize: '12px',
                                color: passwordStrength.startsWith('Débil') ? '#ff4d6d' : '#4CAF50',
                                margin: '5px 0'
                            }}>
                                Fortaleza: {passwordStrength}
                            </p>
                        )}
                        <input name="confirmPassword" type="password" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} required />
                    </form>
                </div>

                <div className="registro-divider"></div>

                {/* DERECHA: SELECTOR Y BOTÓN */}
                <div className="registro-right">
                    <h3 className="section-title">👥 TIPO DE USUARIO</h3>

                    <div className="tipo-usuario-selector">
                        {['CLIENTE', 'PROVEEDOR', 'ADMINISTRADOR'].map((tipo) => (
                            <div
                                key={tipo}
                                className={`tipo-card ${tipoUsuario === tipo ? 'active' : ''}`}
                                onClick={() => setTipoUsuario(tipo)}
                            >
                                {tipo === 'ADMINISTRADOR' ? 'Admin' : tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                            </div>
                        ))}
                    </div>

                    <div className="terms-group">
                        <input type="checkbox" id="terms" />
                        <label htmlFor="terms">Acepto los Términos y Condiciones</label>
                    </div>

                    <button
                        className="btn-crear"
                        onClick={handleRegistro}
                        disabled={loading}
                    >
                        {loading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
                    </button>

                    {/* --- OAUTH2 GOOGLE BOTÓN --- */}
                    <div className="divider" style={{ margin: '15px 0', textAlign: 'center', color: '#888' }}>
                        <span>O regístrate con</span>
                    </div>
                    
                    <button type="button" className="btn-google" onClick={handleGoogleRegistro} style={{ width: '100%' }}>
                        <FcGoogle className="google-icon" />
                        Continuar con Google
                    </button>
                    {/* --------------------------- */}

                    <p className="login-link">
                        ¿Tienes cuenta?
                        <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', fontWeight: 'bold' }}> Inicia Sesión</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Registro;