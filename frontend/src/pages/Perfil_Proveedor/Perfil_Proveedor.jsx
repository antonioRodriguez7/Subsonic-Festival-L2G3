import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil_Proveedor.css';
import {
    getEspaciosContratadosProveedor,
    getServiciosProveedor,
    getEspaciosDisponibles,
    createService,
    rentSpace,
    getEspacios,
    assignSpaceToService
} from '../../services/api';

function Perfil_Proveedor() {

    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('MIS_SERVICIOS');
    const [selectedEspacio, setSelectedEspacio] = useState(null);
    const [idServicioSeleccionado, setIdServicioSeleccionado] = useState(''); // Para elegir servicio al contratar space

    const [filtros, setFiltros] = useState({
        zona: [],
        tamano: [],
        precio: []
    });

    const [espaciosContratados, setEspaciosContratados] = useState([]);
    const [serviciosProveedor, setServiciosProveedor] = useState([]);
    const [espaciosDisponibles, setEspaciosDisponibles] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formServicio, setFormServicio] = useState({
        nombre: '',
        tipo: 'Restauración',
        descripcion: '',
        fechas: '17-20 Julio 2026',
        imagen: null
    });

    const fetchProveedorData = async () => {
        setIsLoading(true);
        try {
            const [espaciosData, serviciosData] = await Promise.all([
                getEspacios(),
                getServiciosProveedor()
            ]);
            
            // Filtramos los que están alquilados vs disponibles según su propiedad
            const contratados = espaciosData.filter(e => e.isRented === true || e.disponibilidad === 'Reservado');
            const disponibles = espaciosData.filter(e => e.isRented === false || e.disponibilidad === 'Disponible');

            setEspaciosContratados(contratados);
            setEspaciosDisponibles(disponibles);
            setServiciosProveedor(serviciosData);
        } catch (err) {
            console.error("Error cargando datos de proveedor:", err);
            setError("No se pudieron cargar los datos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProveedorData();
    }, []);

    const handleFiltroChange = (categoria, valor) => {
        setFiltros(prev => {
            const nuevosValores = prev[categoria].includes(valor)
                ? prev[categoria].filter(v => v !== valor)
                : [...prev[categoria], valor];
            return { ...prev, [categoria]: nuevosValores };
        });
    };

    const espaciosFiltrados = espaciosDisponibles.filter(espacio => {
        
        // 1. Filtrar los que NO están disponibles
        const isActuallyAvailable = 
            espacio.isRented === false || 
            espacio.isRented === undefined || // Por si el backend no lo manda, lo asumimos libre si está en esta lista
            espacio.disponibilidad === 'Disponible';
            
        if (!isActuallyAvailable) return false;

        // 2. Filtro por Zona o Categoría (type en realBackend)
        if (filtros.zona.length > 0) {
            const zonaReal = espacio.zonaGeneral || espacio.type;
            if (!filtros.zona.includes(zonaReal)) return false;
        }

        // 3. Filtro por Tamaño
        if (filtros.tamano.length > 0) {
            let size = 0;
            if (typeof espacio.sizeSquareMeters === 'number') {
                size = espacio.sizeSquareMeters;
            } else if (espacio.tamano) {
                size = parseInt(espacio.tamano.replace(/\D/g, '')) || 0;
            }

            let cumpleTamano = false;
            if (filtros.tamano.includes('< 200m²') && size < 200) cumpleTamano = true;
            if (filtros.tamano.includes('200 - 500m²') && size >= 200 && size <= 500) cumpleTamano = true;
            if (filtros.tamano.includes('> 500m²') && size > 500) cumpleTamano = true;

            if (!cumpleTamano) return false;
        }

        return true;
    });

    const handleCreateService = async () => {
        if (!formServicio.nombre) return;
        try {
            const imagenUrl = formServicio.imagen
                ? URL.createObjectURL(formServicio.imagen)
                : '';
            const dataToSend = {
                nombre: formServicio.nombre,
                tipo: formServicio.tipo,
                descripcion: formServicio.descripcion,
                fechas: formServicio.fechas,
                imagenUrl
            };
            await createService(dataToSend);
            alert("Servicio creado correctamente. Ahora puedes asignarlo a un espacio en la sección 'CONTRATAR ESPACIOS'.");
            setFormServicio({ nombre: '', tipo: 'Restauración', descripcion: '', fechas: '17-20 Julio 2026', imagen: null });
            fetchProveedorData();
        } catch (err) {
            alert("Error al crear el servicio");
        }
    };

    const getNormalizedSpace = (espacio) => {
        return {
            id: espacio.id,
            name: espacio.nombre || espacio.name || "Espacio Sin Nombre",
            type: espacio.caracteristica || espacio.type || "Foodtruck",
            price: parseFloat(espacio.precio?.toString().replace(/[€.,]/g, '') || espacio.price || 0),
            sizeSquareMeters: parseInt(espacio.tamano?.toString().replace(/\D/g, '') || espacio.sizeSquareMeters || 0),
            isRented: true
        };
    };

    const handleContratarEspacio = async (espacio) => {
        if (!idServicioSeleccionado) {
            alert("Por favor, selecciona el servicio que vas a poner en este espacio.");
            return;
        }
        try {
            const normalizedSpace = getNormalizedSpace(espacio);
            console.log("Enviando contratación para:", normalizedSpace);
            
            await rentSpace(espacio.id, normalizedSpace);
            
            // También asignar el espacio al servicio
            await assignSpaceToService(idServicioSeleccionado, espacio.id);
            
            alert(`¡Espacio "${normalizedSpace.name}" contratado y asignado al servicio con éxito!`);
            setSelectedEspacio(null);
            setIdServicioSeleccionado('');
            fetchProveedorData();
        } catch (err) {
            console.error("Error al contratar:", err);
            alert("Error al contratar el espacio. Revisa la consola (F12) para ver el error técnico.");
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
                    <p className="admin-badge">PROVEEDOR</p>
                </div>

                <nav className="admin-nav">
                    <button
                        className={`admin-nav-btn ${activeSection === 'MIS_SERVICIOS' ? 'active' : ''}`}
                        onClick={() => setActiveSection('MIS_SERVICIOS')}
                    >
                        MIS SERVICIOS
                    </button>
                    <button
                        className={`admin-nav-btn ${activeSection === 'ESPACIOS' ? 'active' : ''}`}
                        onClick={() => setActiveSection('ESPACIOS')}
                    >
                        CONTRATAR ESPACIOS
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
                    <h2>{activeSection === 'MIS_SERVICIOS' ? 'Gestión de mis Servicios' : 'Contratar Espacios Disponibles'}</h2>
                    <div
                        className="admin-profile-circle"
                        onClick={() => navigate('/perfil')}
                        style={{ cursor: 'pointer' }}
                        title="Ir a mi perfil"
                    >P</div>
                </header>

                {/* SECCIÓN MIS SERVICIOS */}
                {activeSection === 'MIS_SERVICIOS' && (
                    <div className="mis-espacios-container">
                        {/* Lado izquierdo: Mis servicios ya creados */}
                        <div className="mis-espacios-left">
                            <div className="mis-espacios-box">
                                <h3 className="box-title">Mis Servicios Registrados</h3>
                                {serviciosProveedor.length === 0 ? (
                                    <div className="no-servicios-empty">
                                        <p>No tienes servicios creados todavía.</p>
                                        <p style={{fontSize: '13px', color: '#666'}}>Crea uno a la derecha para poder contratar espacios.</p>
                                    </div>
                                ) : (
                                    <div className="espacios-contratados-list">
                                        {serviciosProveedor.map(servicio => (
                                            <div key={servicio.id} className="espacio-contratado-item">
                                                <div className="contratado-header">
                                                    <h4>{servicio.nombre}</h4>
                                                    <span className="tipo-badge">{servicio.tipo}</span>
                                                </div>
                                                <p className="contratado-detalle">📅 {servicio.fechas}</p>
                                                <p className="servicio-asignado-descripcion">{servicio.descripcion}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lado derecho: Formulario para crear servicio */}
                        <div className="mis-espacios-right">
                            <div className="admin-content-box">
                                <h3 className="form-title">REGISTRAR NUEVO NEGOCIO / SERVICIO</h3>
                                <form className="admin-form">
                                    <div className="form-grid">
                                        <div className="field-group" style={{gridColumn: '1 / -1'}}>
                                            <label>Nombre del Negocio</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Foodie Truck, Merch Shop..."
                                                value={formServicio.nombre}
                                                onChange={(e) => setFormServicio({ ...formServicio, nombre: e.target.value })}
                                            />
                                        </div>
                                        
                                        <div className="field-group">
                                            <label>Tipo de Negocio</label>
                                            <select
                                                value={formServicio.tipo}
                                                onChange={(e) => setFormServicio({ ...formServicio, tipo: e.target.value })}
                                            >
                                                <option value="Restauración">Restauración</option>
                                                <option value="Merchandising">Merchandising</option>
                                                <option value="Entretenimiento">Entretenimiento</option>
                                                <option value="Bebidas">Bebidas</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                        </div>

                                        <div className="field-group">
                                            <label>Imagen del Negocio</label>
                                            <label className="artista-imagen-upload">
                                                {formServicio.imagen ? (
                                                    <div className="artista-imagen-preview-wrapper">
                                                        <img
                                                            src={URL.createObjectURL(formServicio.imagen)}
                                                            alt="preview"
                                                            className="artista-imagen-preview"
                                                        />
                                                        <span className="artista-imagen-change-label">🖼️ Cambiar imagen</span>
                                                    </div>
                                                ) : (
                                                    <span>🖼️ Seleccionar imagen</span>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={e => setFormServicio(p => ({ ...p, imagen: e.target.files[0] || null }))}
                                                />
                                            </label>
                                        </div>

                                        <div className="field-group" style={{gridColumn: '1 / -1'}}>
                                            <label>Descripción del Servicio</label>
                                            <textarea
                                                placeholder="Cuéntanos qué ofreces..."
                                                value={formServicio.descripcion}
                                                onChange={(e) => setFormServicio({ ...formServicio, descripcion: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn-add-artist"
                                            disabled={!formServicio.nombre}
                                            onClick={handleCreateService}
                                        >
                                            Crear Servicio
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* SECCIÓN ESPACIOS DISPONIBLES */}
                {activeSection === 'ESPACIOS' && (
                    <div className="espacios-container">
                        {/* Filtros laterales */}
                        <aside className="espacios-filters">
                            <div className="filter-section">
                                <h4>Categoría</h4>
                                {['Foodtruck', 'Escenario', 'Zona VIP', 'Merchandising'].map(z => (
                                    <label key={z}>
                                        <input
                                            type="checkbox"
                                            checked={filtros.zona.includes(z)}
                                            onChange={() => handleFiltroChange('zona', z)}
                                        />
                                        {z}
                                    </label>
                                ))}
                            </div>

                            <div className="filter-section">
                                <h4>Superficie</h4>
                                {['< 200m²', '200 - 500m²', '> 500m²'].map(t => (
                                    <label key={t}>
                                        <input
                                            type="checkbox"
                                            checked={filtros.tamano.includes(t)}
                                            onChange={() => handleFiltroChange('tamano', t)}
                                        />
                                        {t}
                                    </label>
                                ))}
                            </div>

                            <button
                                className="btn-clear-filters"
                                onClick={() => setFiltros({ zona: [], tamano: [], precio: [] })}
                            >
                                Limpiar Filtros
                            </button>
                        </aside>

                        {/* Grid de espacios */}
                        <div className="espacios-content">
                            <div className="espacios-info-banner">
                                <p>📍 {espaciosFiltrados.length} parcelas disponibles para tu negocio</p>
                            </div>

                            <div className="espacios-grid">
                                {espaciosFiltrados.map(espacio => (
                                    <div
                                        key={espacio.id}
                                        className="espacio-card-proveedor"
                                        onClick={() => setSelectedEspacio(espacio)}
                                    >
                                        <span className="zona-badge">{espacio.zonaGeneral || 'Recinto'}</span>
                                        <h3>{espacio.nombre || espacio.name}</h3>
                                        <p className="espacio-tipo">{espacio.caracteristica || espacio.type}</p>
                                        <p className="espacio-detalle">💰 {espacio.precio || (espacio.price + '€')}</p>
                                        <p className="espacio-detalle">📏 {espacio.tamano || (espacio.sizeSquareMeters + ' m²')}</p>
                                        <div className="espacio-footer">
                                            <span className="espacio-ver-mas">Ver detalles y contratar →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de detalle del espacio */}
                {selectedEspacio && (
                    <div className="modal-overlay" onClick={() => setSelectedEspacio(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setSelectedEspacio(null)}>✕</button>

                            <h2>{selectedEspacio.nombre || selectedEspacio.name}</h2>
                            <p className="modal-subtitle">{selectedEspacio.caracteristica || selectedEspacio.type}</p>

                            <div className="modal-grid">
                                <div className="modal-section">
                                    <h4>📏 Dimensiones</h4>
                                    <p><strong>Superficie:</strong> {selectedEspacio.tamano || (selectedEspacio.sizeSquareMeters + ' m²')}</p>
                                    <p><strong>Ubicación:</strong> {selectedEspacio.lugar || selectedEspacio.zonaGeneral}</p>
                                </div>

                                <div className="modal-section">
                                    <h4>💰 Precio Alquiler</h4>
                                    <p className="precio-destacado">{selectedEspacio.precio || (selectedEspacio.price + '€')}</p>
                                    <p style={{ fontSize: '0.9em', color: '#aaa' }}>Canon por los 3 días del festival</p>
                                </div>

                                <div className="modal-section modal-section-full hire-section">
                                    <h4>💼 Contratar este espacio</h4>
                                    {serviciosProveedor.length === 0 ? (
                                        <div className="warning-box">
                                            <p>Debes crear un servicio en "MIS SERVICIOS" antes de poder contratar un espacio.</p>
                                            <button className="btn-go-create" onClick={() => {setActiveSection('MIS_SERVICIOS'); setSelectedEspacio(null);}}>Ir a crear servicio</button>
                                        </div>
                                    ) : (
                                        <div className="hire-form">
                                            <label>Selecciona el servicio que ubicarás aquí:</label>
                                            <select 
                                                value={idServicioSeleccionado} 
                                                onChange={(e) => setIdServicioSeleccionado(e.target.value)}
                                                className="service-select"
                                            >
                                                <option value="">-- Elige un servicio --</option>
                                                {serviciosProveedor.map(s => (
                                                    <option key={s.id} value={s.id}>{s.nombre} ({s.tipo})</option>
                                                ))}
                                            </select>
                                            
                                            <div className="modal-actions-proveedor">
                                                <button
                                                    className="btn-solicitar-alquiler"
                                                    disabled={!idServicioSeleccionado}
                                                    onClick={() => handleContratarEspacio(selectedEspacio)}
                                                >
                                                    🚀 Contratar Espacio Ahora
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default Perfil_Proveedor;
