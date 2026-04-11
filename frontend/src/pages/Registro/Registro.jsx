import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
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