import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Perfil.css';
import { getCurrentUser, updateUser, deleteUser } from '../../services/api';
import { getMyTickets } from "../../services/realBackend";

function Perfil() {
    const navigate = useNavigate();
    const location = useLocation();

// 1. INTERCEPTAR DATOS DE GOOGLE EN LA URL ANTES DE NADA
    const queryParams = new URLSearchParams(location.search);
    const tokenUrl = queryParams.get('token');
    const emailUrl = queryParams.get('email');
    const roleUrl = queryParams.get('role');

    if (tokenUrl) {
        // Si venimos de Google, guardamos todo en localStorage inmediatamente
        localStorage.setItem('subsonic_token', tokenUrl);
        if (emailUrl) localStorage.setItem('user_email', emailUrl);
        if (roleUrl) localStorage.setItem('user_role', roleUrl);
        
        // Limpiamos la URL para que quede bonita (/perfil) sin recargar la página
        window.history.replaceState({}, document.title, "/perfil");
    }

    // 1. LEER LOS DATOS REALES (Los que guardamos en Login.jsx)
    const token = localStorage.getItem('subsonic_token');
    const userRole = localStorage.getItem('user_role');
    const userEmail = localStorage.getItem('user_email');
    const [misEntradas, setMisEntradas] = useState([]);

    // 2. PROTECCIÓN DE RUTA: Si no hay token, fuera
    useEffect(() => {
        if (!token) {
            console.log("No hay token, redirigiendo al login...");
            navigate('/login');
        }
    }, [token, navigate]);

    // 3. ESTADO DEL PERFIL
    const [perfil, setPerfil] = useState({
        id: null,
        nombre: '',
        apellidos: '',
        username: userEmail ? userEmail.split('@')[0] : '',
        descripcion: '',
        email: userEmail || '',
        password: '',
        currentPassword: userRole === 'ROLE_ADMIN' ? 'admin123' : userRole === 'ROLE_PROVEEDOR' ? 'proveedor123' : 'cliente123'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) {
                    localStorage.setItem('user_id', String(userData.id));
                    setPerfil(prev => ({
                        ...prev,
                        id: userData.id,
                        nombre: userData.name || '',
                        apellidos: userData.surname || '',
                        username: userData.username || '',
                        email: userData.email || prev.email,
                        descripcion: userData.bio || ''
                    }));
                }
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token]);

    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    // Obtener y agrupar las compras de entradas
    useEffect(() => {
        if (!perfil.id) return;

        const fetchTickets = async () => {
            try {
                const data = await getMyTickets();

                // 🔥 AGRUPAR Y SUMAR
                const agrupadas = {};

                data.forEach(item => {
                    const key = item.category;

                    if (!agrupadas[key]) {
                        agrupadas[key] = { ...item };
                    } else {
                        agrupadas[key].cantidad += item.cantidad;
                    }
                });

                setMisEntradas(Object.values(agrupadas));

            } catch (e) {
                console.error(e);
            }
        };

        fetchTickets();
    }, [perfil.id]);

    const handleChange = (field, value) =>
        setPerfil(prev => ({ ...prev, [field]: value }));

    const handleSave = async () => {
        if (!perfil.id) return;
        try {
            const dataToUpdate = {
                name: perfil.nombre,
                surname: perfil.apellidos,
                username: perfil.username,
                email: perfil.email,
                bio: perfil.descripcion,
                password: perfil.password,
                currentPassword: perfil.currentPassword
            };
            await updateUser(perfil.id, dataToUpdate);

            // Actualizar localStorage si el email cambió
            localStorage.setItem('user_email', perfil.email);

            setMensaje({ texto: 'Perfil actualizado correctamente', tipo: 'success' });
            setPerfil(prev => ({ ...prev, password: '', currentPassword: '' })); // Limpiar campos contraseña

            setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
        } catch (error) {
            console.error("Error al guardar perfil:", error);
            const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil';
            setMensaje({ texto: errorMessage, tipo: 'error' });
            setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
        }
    };

    const nombreCompleto = [perfil.nombre, perfil.apellidos].filter(Boolean).join(' ') || (userRole === 'ROLE_ADMIN' ? 'Administrador' : userRole === 'ROLE_PROVEEDOR' ? 'Proveedor' : 'Usuario');

    const getRoleLabel = () => {
        if (userRole === 'ROLE_ADMIN') return { label: 'Administrador', class: 'admin' };
        if (userRole === 'ROLE_PROVEEDOR') return { label: 'Proveedor', class: 'proveedor' };
        return { label: 'Usuario', class: 'user' };
    };

    const roleInfo = getRoleLabel();

    // 4. LOGOUT CORREGIDO
    const handleLogout = () => {
        localStorage.removeItem('subsonic_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_id');
        window.location.href = '/login';
    };

    // 5. ELIMINAR CUENTA
    const handleDeleteCuenta = async () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.")) {
            try {
                await deleteUser(perfil.id);
                // Tras borrarla de la BD, cerramos la sesión y limpiamos los datos locales
                handleLogout();
            } catch (error) {
                console.error("Error al eliminar la cuenta:", error);
                const errorMessage = error.response?.data?.message || 'Error al eliminar la cuenta';
                setMensaje({ texto: errorMessage, tipo: 'error' });
                setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
            }
        }
    };

    return (
        <div className="perfil-page">
            {mensaje.texto && <div className={`admin-alert ${mensaje.tipo}`} style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '15px 25px',
                borderRadius: '8px',
                zIndex: 1000,
                backgroundColor: mensaje.tipo === 'success' ? '#2ecc71' : '#e74c3c',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>{mensaje.texto}</div>}

            <div className="perfil-nav">
                <button className="btn-atras" onClick={() => navigate('/')}>← Atrás</button>
                <img src="/logoPI.png" alt="Logo" className="perfil-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
                <button className="btn-logout-nav" onClick={handleLogout}>Cerrar Sesión</button>
            </div>

            <div className="perfil-container">
                <div className="perfil-top-section">
                    <div className="perfil-left">
                        <div className="avatar-circle">
                            <span>{perfil.nombre ? perfil.nombre[0].toUpperCase() : (userRole === 'ROLE_ADMIN' ? 'A' : userRole === 'ROLE_PROVEEDOR' ? 'P' : 'U')}</span>
                        </div>
                        <h3 className="perfil-username">{nombreCompleto}</h3>
                        <p className="perfil-at-username">@{perfil.username}</p>
                        <span className={`role-badge ${roleInfo.class}`}>{roleInfo.label}</span>
                        <p className="perfil-desc-text">{perfil.descripcion || <i>Sin descripción</i>}</p>
                    </div>

                    <div className="perfil-right">
                        <form className="perfil-form" onSubmit={e => e.preventDefault()}>
                            <div className="perfil-form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Tu nombre"
                                    value={perfil.nombre}
                                    onChange={e => handleChange('nombre', e.target.value)}
                                />
                            </div>
                            <div className="perfil-form-group">
                                <label>Apellidos</label>
                                <input
                                    type="text"
                                    placeholder="Tus apellidos"
                                    value={perfil.apellidos}
                                    onChange={e => handleChange('apellidos', e.target.value)}
                                />
                            </div>
                            <div className="perfil-form-group">
                                <label>Nombre de usuario</label>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={perfil.username}
                                    onChange={e => handleChange('username', e.target.value)}
                                />
                            </div>
                            <div className="perfil-form-group">
                                <label>Biografía</label>
                                <input
                                    type="text"
                                    placeholder="Cuéntanos algo sobre ti"
                                    value={perfil.descripcion}
                                    onChange={e => handleChange('descripcion', e.target.value)}
                                />
                            </div>
                            <div className="perfil-form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={perfil.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button type="button" className="btn-guardar" onClick={handleSave} style={{ flex: 1 }}>Guardar Cambios</button>
                                <button type="button" className="btn-eliminar" onClick={handleDeleteCuenta} style={{ flex: 1 }}>Eliminar Cuenta</button>
                            </div>
                        </form>
                    </div>
                </div>

                <hr className="perfil-divider" />


                <div className="perfil-bottom-section">
                    {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_PROVEEDOR') ? (
                        <div className="panel-admin-wrapper">
                            <h3 className="section-title">
                                {userRole === 'ROLE_ADMIN' ? 'Administración' : 'Panel de Proveedor'}
                            </h3>
                            <button
                                className="btn-panel-admin"
                                onClick={() => navigate(userRole === 'ROLE_ADMIN' ? '/perfil-admin' : '/perfil-proveedor')}
                            >
                                Panel de Gestión
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="section-title">Productos adquiridos</h3>

                            {/* 🔥 MOSTRAR TICKETS COMPRADOS DINÁMICAMENTE */}
                            <div className="productos-grid">
                                {misEntradas.length > 0 ? (
                                    misEntradas.map((compra, index) => (
                                        <div className="producto-card" key={index}>
                                            <div className="producto-img">
                                                <img
                                                    src={compra.imageUrl || "https://via.placeholder.com/300"}
                                                    alt={compra.category}
                                                />
                                            </div>
                                            <p>{compra.category}</p>
                                            <span className="cantidad-badge">
                                                x{compra.cantidad}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-tickets-msg">Aún no has adquirido ninguna entrada.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Perfil;