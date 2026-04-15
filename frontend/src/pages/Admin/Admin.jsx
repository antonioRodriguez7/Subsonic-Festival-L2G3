import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import * as api from '../../services/api'; // Import the API service

function Admin() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('ARTISTA');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingTicketId, setEditingTicketId] = useState(null);
    const [tempTicketData, setTempTicketData] = useState({});

    useEffect(() => {
        if (activeSection === 'ENTRADAS') {
            fetchTickets();
        }
    }, [activeSection]);

    const fetchTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getEntradas();
            setTickets(data);
        } catch (err) {
            console.error("Error fetching tickets:", err);
            setError("Error al cargar las entradas.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (ticket) => {
        setEditingTicketId(ticket.id);
        setTempTicketData({ ...ticket });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempTicketData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveClick = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();

            formData.append("category", tempTicketData.nombre);
            formData.append("description", tempTicketData.descripcion);
            formData.append("price", parseFloat(tempTicketData.precio));
            formData.append("feature", tempTicketData.etiqueta || "Acceso estándar");
            formData.append("stock", parseInt(tempTicketData.stock));

            if (tempTicketData.imageFile) {
                formData.append("image", tempTicketData.imageFile);
            }
            console.log("Saving ticket with ID:", id);
            console.log("FormData:", formData);
            await api.updateTicketWithImage(id, formData);
            setEditingTicketId(null);
            setTempTicketData({});
            fetchTickets(); // Re-fetch to show updated data
        } catch (err) {
            console.error("Error updating ticket:", err);
            setError("Error al guardar la entrada.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setEditingTicketId(null);
        setTempTicketData({});
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
            setLoading(true);
            setError(null);
            try {
                await api.deleteTicket(id);
                fetchTickets(); // Re-fetch to show updated data
            } catch (err) {
                console.error("Error deleting ticket:", err);
                setError("Error al eliminar la entrada.");
            } finally {
                setLoading(false);
            }
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'ARTISTA':
                return (
                    <div className="admin-content-box">
                        <h3 className="form-title">
                            RELLENA LOS CAMPOS CON EL NUEVO ARTISTA
                        </h3>

                        <form className="admin-form">
                            <div className="form-grid">
                                <input type="text" placeholder="Nombre del artista / grupo" />
                                <input type="text" placeholder="Género musical" />
                                <input type="date" />
                                <input type="time" />
                                <input type="text" placeholder="Caché (€)" />
                                <input type="text" placeholder="Escenario asignado" />
                                <input type="text" placeholder="Requisitos técnicos (Rider)" />
                                <input type="text" placeholder="URL Imagen promocional" />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-add-artist"
                                >
                                    Añadir artista
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case 'ESPACIOS':
                return (
                    <div className="admin-content-box">
                        <h3 className="form-title">Gestión de Espacios (Pendiente de implementar)</h3>
                        {/* Content for ESPACIOS */}
                    </div>
                );
            case 'HISTORIAL_COMPRA':
                return (
                    <div className="admin-content-box">
                        <h3 className="form-title">Historial de Compra (Pendiente de implementar)</h3>
                        {/* Content for HISTORIAL_COMPRA */}
                    </div>
                );
            case 'HISTORIAL_PROVEEDORES':
                return (
                    <div className="admin-content-box">
                        <h3 className="form-title">Historial de Proveedores (Pendiente de implementar)</h3>
                        {/* Content for HISTORIAL_PROVEEDORES */}
                    </div>
                );
            case 'ENTRADAS':
                return (
                    <div className="admin-content-box">
                        <h3 className="form-title">Gestión de Entradas</h3>
                        {loading && <p>Cargando entradas...</p>}
                        {error && <p className="error-message">{error}</p>}
                        {!loading && !error && (
                            <div className="tickets-table-container">
                                <table className="tickets-table">
                                    <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th>Descripción</th>
                                            <th>Precio</th>
                                            <th>Stock</th>
                                            <th>Imagen URL</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map(ticket => (
                                            <tr key={ticket.id}>
                                                <td>
                                                    {editingTicketId === ticket.id ? (
                                                        <input
                                                            type="text"
                                                            name="nombre"
                                                            value={tempTicketData.nombre || ''}
                                                            onChange={handleInputChange}
                                                        />
                                                    ) : (
                                                        <span>{ticket.nombre}</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {editingTicketId === ticket.id ? (
                                                        <textarea
                                                            name="descripcion"
                                                            value={tempTicketData.descripcion || ''}
                                                            onChange={handleInputChange}
                                                        />
                                                    ) : (
                                                        <span>{ticket.descripcion}</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {editingTicketId === ticket.id ? (
                                                        <input
                                                            type="number"
                                                            name="precio"
                                                            value={tempTicketData.precio || ''}
                                                            onChange={handleInputChange}
                                                        />
                                                    ) : (
                                                        <span>{ticket.precio}</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {editingTicketId === ticket.id ? (
                                                        <input
                                                            type="number"
                                                            name="stock"
                                                            value={tempTicketData.stock ?? 0} // Use nullish coalescing for stock
                                                            onChange={handleInputChange}
                                                        />
                                                    ) : (
                                                        <span>{ticket.stock ?? 0}</span> // Display default 0 if stock is null/undefined
                                                    )}
                                                </td>
                                                <td>
                                                    {editingTicketId === ticket.id ? (
                                                        <input
                                                            type="file"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                setTempTicketData(prev => ({
                                                                    ...prev,
                                                                    imageFile: file
                                                                }));
                                                            }}
                                                        />
                                                    ) : (
                                                        <img src={ticket.imageUrl} alt={ticket.nombre} className="ticket-img-preview" />
                                                    )}
                                                </td>
                                                <td>
                                                    {editingTicketId === ticket.id ? (
                                                        <>
                                                            <button className="btn-save" onClick={() => handleSaveClick(ticket.id)}>Guardar</button>
                                                            <button className="btn-cancel" onClick={handleCancelClick}>Cancelar</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button className="btn-edit" onClick={() => handleEditClick(ticket)}>Editar</button>
                                                            <button className="btn-delete" onClick={() => handleDeleteClick(ticket.id)}>Eliminar</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="admin-wrapper">
            {/* MENÚ LATERAL */}
            <aside className="admin-sidebar">
                <div
                    className="admin-logo-container"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <img src="/logoPI.png" alt="Logo" className="admin-logo" />
                    <p className="admin-badge">ADMIN</p>
                </div>

                <nav className="admin-nav">
                    <button
                        className={`admin-nav-btn ${activeSection === 'ARTISTA' ? 'active' : ''}`}
                        onClick={() => setActiveSection('ARTISTA')}
                    >
                        ARTISTA
                    </button>
                    <button
                        className={`admin-nav-btn ${activeSection === 'ESPACIOS' ? 'active' : ''}`}
                        onClick={() => setActiveSection('ESPACIOS')}
                    >
                        ESPACIOS
                    </button>
                    <button
                        className={`admin-nav-btn ${activeSection === 'HISTORIAL_COMPRA' ? 'active' : ''}`}
                        onClick={() => setActiveSection('HISTORIAL_COMPRA')}
                    >
                        HISTORIAL DE COMPRA
                    </button>
                    <button
                        className={`admin-nav-btn ${activeSection === 'HISTORIAL_PROVEEDORES' ? 'active' : ''}`}
                        onClick={() => setActiveSection('HISTORIAL_PROVEEDORES')}
                    >
                        HISTORIAL DE PROVEEDORES
                    </button>
                    <button
                        className={`admin-nav-btn ${activeSection === 'ENTRADAS' ? 'active' : ''}`}
                        onClick={() => setActiveSection('ENTRADAS')}
                    >
                        ENTRADAS
                    </button>
                </nav>

                <div className="admin-sidebar-footer">
                    <button
                        className="admin-logout-btn"
                        onClick={() => navigate('/login')}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* ÁREA PRINCIPAL */}
            <main className="admin-main">
                <header className="admin-header">
                    <h2>Gestión de {activeSection === 'HISTORIAL_COMPRA' ? 'Historial de Compra' : activeSection === 'HISTORIAL_PROVEEDORES' ? 'Historial de Proveedores' : activeSection === 'ENTRADAS' ? 'Entradas' : activeSection === 'ESPACIOS' ? 'Espacios' : 'Artistas'}</h2>
                    <div className="admin-profile-circle">A</div>
                </header>

                {renderContent()}

            </main>
        </div>
    );
}

export default Admin;