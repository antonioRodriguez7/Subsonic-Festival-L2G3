import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil_Proveedor.css';
import {
    getEspaciosContratadosProveedor,
    getServiciosProveedor,
    getEspaciosDisponibles,
    createService,
    updateService,
    deleteService,
    rentSpace,
    unrentSpace,
    assignSpaceToService,
    unassignSpaceFromService
} from '../../services/api';

function Perfil_Proveedor() {

    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('MIS_SERVICIOS');
    const [selectedEspacio, setSelectedEspacio] = useState(null);

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

    const [isEditing, setIsEditing] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [expandedServiceId, setExpandedServiceId] = useState(null); // Para ver detalles del espacio asignado
    const [quickAssignSpaceId, setQuickAssignSpaceId] = useState(''); // Para el selector rápido en la lista

    const [formServicio, setFormServicio] = useState({
        nombre: '',
        tipo: 'Restauración',
        descripcion: '',
        fechas: '17-19 Julio 2026',
        imagen: null,
        imagenUrl: '',
        spaceId: '' // Campo para asignar espacio contratado
    });

    const fetchProveedorData = async () => {
        setIsLoading(true);
        try {
            const [alquileres, espaciosLibres, serviciosData] = await Promise.all([
                getEspaciosContratadosProveedor(), // Devuelve EspacioAlquiladoDTO[]
                getEspaciosDisponibles(),
                getServiciosProveedor()
            ]);

            // Normalizamos RentedSpaceDTO al formato {id, name, type, price, sizeSquareMeters}
            // que espera el resto del componente (tarjetas, selects, etc.)
            const contratadosNormalizados = alquileres.map(a => ({
                id: a.spaceId,
                name: a.spaceName,
                type: a.spaceType,
                price: a.spacePrice,
                sizeSquareMeters: a.spaceSizeSquareMeters,
                isRented: true,
                alquilerId: a.id,           // ID de la fila en rented_spaces
                fechaAlquiler: a.rentDate
            }));

            setEspaciosContratados(contratadosNormalizados);
            setEspaciosDisponibles(espaciosLibres);
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

        // 4. Filtro por Precio
        if (filtros.precio.length > 0) {
            let precioObj = 0;
            if (typeof espacio.price === 'number') {
                precioObj = espacio.price;
            } else if (espacio.precio) {
                precioObj = parseFloat(espacio.precio.toString().replace(/[^\d.-]/g, '')) || 0;
            }

            let cumplePrecio = false;
            if (filtros.precio.includes('< 2000€') && precioObj < 2000) cumplePrecio = true;
            if (filtros.precio.includes('2000 - 3000€') && precioObj >= 2000 && precioObj <= 3000) cumplePrecio = true;
            if (filtros.precio.includes('> 3000€') && precioObj > 3000) cumplePrecio = true;

            if (!cumplePrecio) return false;
        }

        return true;
    });

    const handleEditClick = (servicio) => {
        setIsEditing(true);
        setEditingServiceId(servicio.id);
        setFormServicio({
            nombre: servicio.nombre,
            tipo: servicio.tipo,
            descripcion: servicio.descripcion,
            fechas: servicio.fechas,
            imagen: null,
            imagenUrl: servicio.imagenUrl || '',
            spaceId: servicio.spaceId || ''
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingServiceId(null);
        setFormServicio({ nombre: '', tipo: 'Restauración', descripcion: '', fechas: '17-19 Julio 2026', imagen: null, imagenUrl: '', spaceId: '' });
    };

    const handleSaveService = async () => {
        if (!formServicio.nombre) return;
        try {
            let finalImagenUrl = formServicio.imagenUrl;

            if (formServicio.imagen) {
                // En un caso real, aquí se subiría a S3/Cloudinary y se obtendría la URL real.
                // Por ahora simulamos con el blob local para que se vea algo.
                finalImagenUrl = URL.createObjectURL(formServicio.imagen);
            }

            const dataToSend = {
                nombre: formServicio.nombre,
                tipo: formServicio.tipo,
                descripcion: formServicio.descripcion,
                fechas: formServicio.fechas,
                imagenUrl: finalImagenUrl
            };

            let savedService;
            if (isEditing) {
                savedService = await updateService(editingServiceId, dataToSend);

                // Si ha seleccionado un espacio diferente al editar
                if (formServicio.spaceId) {
                    await assignSpaceToService(editingServiceId, formServicio.spaceId);
                }

                alert("Servicio actualizado correctamente.");
            } else {
                savedService = await createService(dataToSend);

                // Si ha seleccionado un espacio al crear
                if (formServicio.spaceId && savedService && savedService.id) {
                    await assignSpaceToService(savedService.id, formServicio.spaceId);
                }

                alert("Servicio creado correctamente.");
            }

            handleCancelEdit();
            fetchProveedorData();
        } catch (err) {
            console.error("Error al guardar servicio:", err);
            alert(`Error al ${isEditing ? 'actualizar' : 'crear'} el servicio`);
        }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este servicio?")) return;
        try {
            await deleteService(id);
            alert("Servicio eliminado correctamente.");
            fetchProveedorData();
        } catch (err) {
            alert("Error al eliminar el servicio");
        }
    };

    const handleUnassignSpace = async (serviceId) => {
        if (!window.confirm("¿Quieres desvincular este servicio de su espacio actual?")) return;
        try {
            await unassignSpaceFromService(serviceId);
            alert("Espacio desvinculado con éxito.");
            fetchProveedorData();
        } catch (err) {
            console.error("Error al desvincular:", err);
            alert("Error al desvincular el espacio.");
        }
    };

    const handleQuickAssign = async (serviceId) => {
        if (!quickAssignSpaceId) {
            alert("Por favor, selecciona un espacio antes de asignar.");
            return;
        }
        try {
            await assignSpaceToService(serviceId, quickAssignSpaceId);
            alert("Espacio asignado con éxito.");
            setQuickAssignSpaceId('');
            fetchProveedorData();
        } catch (err) {
            console.error("Error al asignar espacio:", err);
            alert("Error al asignar el espacio.");
        }
    };

    const handleCancelarAlquiler = async (espacioId) => {
        if (!window.confirm("¿Estás seguro de que quieres cancelar el contrato de este espacio? Se desvinculará de cualquier servicio asociado.")) return;
        try {
            await unrentSpace(espacioId);
            alert("Contrato cancelado con éxito.");
            fetchProveedorData();
        } catch (err) {
            console.error("Error al cancelar alquiler:", err);
            alert("Error al cancelar el contrato.");
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
        try {
            // El backend extrae el proveedor del JWT y lo guarda en la BD
            await rentSpace(espacio.id);
            alert(`¡Espacio "${espacio.nombre || espacio.name}" contratado con éxito!`);
            setSelectedEspacio(null);
            fetchProveedorData();
        } catch (err) {
            console.error("Error al contratar:", err);
            alert("Error al contratar el espacio. ¿Ya está alquilado?");
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
                                        <p style={{ fontSize: '13px', color: '#666' }}>Crea uno a la derecha para poder contratar espacios.</p>
                                    </div>
                                ) : (
                                    <div className="espacios-contratados-list">
                                        {serviciosProveedor.map(servicio => {
                                            // Usamos == para comparar IDs por si vienen como string/number y comprobamos nombre/name
                                            const espacioAsignado = espaciosContratados.find(e => e.id == servicio.spaceId);
                                            const nombreEspacio = espacioAsignado ? (espacioAsignado.nombre || espacioAsignado.name) : '';
                                            const isExpanded = expandedServiceId === servicio.id;

                                            return (
                                                <div key={servicio.id} className="espacio-contratado-item">
                                                    <div className="contratado-header">
                                                        <h4>{servicio.nombre}</h4>
                                                        <div className="servicio-actions-btns">
                                                            <button
                                                                className="btn-edit-inline"
                                                                title="Editar"
                                                                onClick={() => handleEditClick(servicio)}
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                className="btn-delete-inline"
                                                                title="Eliminar"
                                                                onClick={() => handleDeleteService(servicio.id)}
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="contratado-sub">
                                                        <span className="tipo-badge">{servicio.tipo}</span>
                                                        <span className="contratado-detalle">📅 {servicio.fechas}</span>
                                                    </div>
                                                    <p className="servicio-asignado-descripcion">{servicio.descripcion}</p>

                                                    {/* DESPLEGABLE DE ESPACIO ASIGNADO */}
                                                    <div className="servicio-espacio-asignado-box">
                                                        <button
                                                            className={`btn-toggle-espacio ${isExpanded ? 'active' : ''}`}
                                                            onClick={() => setExpandedServiceId(isExpanded ? null : servicio.id)}
                                                        >
                                                            {espacioAsignado ? `📍 Ubicado en: ${nombreEspacio}` : '⚠️ Sin espacio asignado'}
                                                            <span>{isExpanded ? '▲' : '▼'}</span>
                                                        </button>

                                                        {isExpanded && (
                                                            <div className="espacio-asignado-detalle-expand">
                                                                {espacioAsignado ? (
                                                                    <>
                                                                        <p><strong>Tipo:</strong> {espacioAsignado.caracteristica || espacioAsignado.type}</p>
                                                                        <p><strong>Tamaño:</strong> {espacioAsignado.tamano || (espacioAsignado.sizeSquareMeters + ' m²')}</p>
                                                                        <p><strong>Precio:</strong> {espacioAsignado.precio || (espacioAsignado.price + '€')}</p>
                                                                        <div className="espacio-asignado-actions">
                                                                            <button
                                                                                className="btn-ver-en-mapa"
                                                                                onClick={() => setActiveSection('ESPACIOS')}
                                                                            >
                                                                                Ver en Gestión de Espacios
                                                                            </button>
                                                                            <button
                                                                                className="btn-unassign-space"
                                                                                onClick={() => handleUnassignSpace(servicio.id)}
                                                                            >
                                                                                ❌ Desvincular Espacio
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="quick-assign-wrapper">
                                                                        <p className="quick-assign-hint">Asigna este servicio a uno de tus espacios contratados:</p>
                                                                        <div className="quick-assign-controls">
                                                                            <select
                                                                                className="quick-assign-select"
                                                                                value={quickAssignSpaceId}
                                                                                onChange={(e) => setQuickAssignSpaceId(e.target.value)}
                                                                            >
                                                                                <option value="">-- Seleccionar un espacio libre --</option>
                                                                                {espaciosContratados.map(e => {
                                                                                    const isOccupied = serviciosProveedor.some(s => s.spaceId == e.id);
                                                                                    if (isOccupied) return null;
                                                                                    return (
                                                                                        <option key={e.id} value={e.id}>
                                                                                            {e.nombre || e.name} ({e.caracteristica || e.type})
                                                                                        </option>
                                                                                    );
                                                                                })}
                                                                            </select>
                                                                            <button
                                                                                className="btn-quick-assign-confirm"
                                                                                disabled={!quickAssignSpaceId}
                                                                                onClick={() => handleQuickAssign(servicio.id)}
                                                                            >
                                                                                Vincular Parcela
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lado derecho: Formulario para crear/editar servicio */}
                        <div className="mis-espacios-right">
                            <div className="admin-content-box">
                                <h3 className="form-title">
                                    {isEditing ? `EDITANDO: ${formServicio.nombre.toUpperCase()}` : 'REGISTRAR NUEVO NEGOCIO / SERVICIO'}
                                </h3>
                                <form className="admin-form">
                                    <div className="form-grid">
                                        <div className="field-group" style={{ gridColumn: '1 / -1' }}>
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
                                            <label>Asignar a Espacio Contratado</label>
                                            <select
                                                value={formServicio.spaceId}
                                                onChange={(e) => setFormServicio({ ...formServicio, spaceId: e.target.value })}
                                            >
                                                <option value="">-- Seleccionar Espacio --</option>
                                                {espaciosContratados.map(espacio => {
                                                    // Buscamos si ya hay un servicio en este espacio
                                                    const servicioExistente = serviciosProveedor.find(s => s.spaceId === espacio.id);
                                                    const isCurrentSpace = formServicio.spaceId === espacio.id;

                                                    // Si ya tiene un servicio y no es el que estamos editando ahora, lo deshabilitamos
                                                    const isDisabled = servicioExistente && !isCurrentSpace;

                                                    return (
                                                        <option
                                                            key={espacio.id}
                                                            value={espacio.id}
                                                            disabled={isDisabled}
                                                        >
                                                            {espacio.nombre || espacio.name} {isDisabled ? '- YA ASIGNADO' : ''}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                        <div className="field-group">
                                            <label>Imagen del Negocio</label>
                                            <label className="artista-imagen-upload">
                                                {formServicio.imagen || formServicio.imagenUrl ? (
                                                    <div className="artista-imagen-preview-wrapper">
                                                        <img
                                                            src={formServicio.imagen ? URL.createObjectURL(formServicio.imagen) : formServicio.imagenUrl}
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

                                        <div className="field-group" style={{ gridColumn: '1 / -1' }}>
                                            <label>Descripción del Servicio</label>
                                            <textarea
                                                placeholder="Cuéntanos qué ofreces..."
                                                value={formServicio.descripcion}
                                                onChange={(e) => setFormServicio({ ...formServicio, descripcion: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        {isEditing && (
                                            <button
                                                type="button"
                                                className="btn-cancel-edit"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="btn-add-artist"
                                            disabled={!formServicio.nombre}
                                            onClick={handleSaveService}
                                        >
                                            {isEditing ? 'Guardar Cambios' : 'Crear Servicio'}
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
                                <h4>Zona del Recinto</h4>
                                {['Norte', 'Sur', 'Este', 'Oeste', 'Centro'].map(z => (
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
                                <h4>Tamaño</h4>
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

                            <div className="filter-section">
                                <h4>Precio</h4>
                                {['< 2000€', '2000 - 3000€', '> 3000€'].map(p => (
                                    <label key={p}>
                                        <input
                                            type="checkbox"
                                            checked={filtros.precio.includes(p)}
                                            onChange={() => handleFiltroChange('precio', p)}
                                        />
                                        {p}
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

                        {/* Contenido principal de espacios */}
                        <div className="espacios-content">
                            <div className="espacios-section-title">
                                <h3>Parcelas Disponibles</h3>
                                <div className="espacios-info-banner">
                                    <p>📍 {espaciosFiltrados.length} parcelas disponibles para tu negocio</p>
                                </div>
                            </div>

                            <div className="espacios-grid">
                                {espaciosFiltrados.length === 0 ? (
                                    <p className="no-espacios">No hay espacios disponibles con estos filtros.</p>
                                ) : (
                                    espaciosFiltrados.map(espacio => (
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
                                    ))
                                )}
                            </div>

                            {/* SECCIÓN DE ESPACIOS CONTRATADOS */}
                            <div className="espacios-contratados-proveedor-section">
                                <h3 className="section-title">Mis Espacios Contratados</h3>
                                {espaciosContratados.length === 0 ? (
                                    <div className="no-contratados-empty">
                                        <p>No has contratado ningún espacio todavía.</p>
                                    </div>
                                ) : (
                                    <div className="espacios-grid">
                                        {espaciosContratados.map(espacio => {
                                            const tieneServicio = serviciosProveedor.some(s => s.spaceId == espacio.id);

                                            return (
                                                <div
                                                    key={espacio.id}
                                                    className={`espacio-card-proveedor rented ${tieneServicio ? 'occupied' : ''}`}
                                                >
                                                    <span className="zona-badge">{espacio.zonaGeneral || 'Recinto'}</span>
                                                    <h3>{espacio.nombre || espacio.name}</h3>
                                                    <p className="espacio-tipo">{espacio.caracteristica || espacio.type}</p>
                                                    <p className="espacio-detalle">💰 {espacio.precio || (espacio.price + '€')}</p>
                                                    <p className="espacio-detalle">📏 {espacio.tamano || (espacio.sizeSquareMeters + ' m²')}</p>
                                                    <div className="espacio-footer">
                                                        {tieneServicio ? (
                                                            <div className="occupied-info">
                                                                <span className="estado-ocupado">📦 Espacio Ocupado</span>
                                                                <button 
                                                                    className="btn-cancelar-alquiler"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCancelarAlquiler(espacio.id);
                                                                    }}
                                                                >
                                                                    Cancelar Contrato
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="rented-info">
                                                                <span className="estado-alquilado">✅ Ya Contratado</span>
                                                                <button 
                                                                    className="btn-cancelar-alquiler"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCancelarAlquiler(espacio.id);
                                                                    }}
                                                                >
                                                                    Cancelar Contrato
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
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
                                    <div className="hire-form">
                                        <p>Al contratar este espacio, quedará reservado para tu uso exclusivo durante todo el festival.</p>
                                        <div className="modal-actions-proveedor">
                                            <button
                                                className="btn-solicitar-alquiler"
                                                onClick={() => handleContratarEspacio(selectedEspacio)}
                                            >
                                                🚀 Contratar Espacio Ahora
                                            </button>
                                        </div>
                                    </div>
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
