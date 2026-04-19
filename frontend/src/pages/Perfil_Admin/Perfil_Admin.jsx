import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil_Admin.css';
import Footer from "../../components/Footer";
import {
    getEspacios,
    getEntradas,
    getArtistas,
    createArtist,
    deleteArtist,
    updateArtist,
    createTicket,
    deleteTicket,
    updateTicket,
    createSpace,
    deleteSpace,
    updateSpace,
    syncSpotifyPlaylist,
    updateTicketWithImage
} from "../../services/api";

function Perfil_Admin() {
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('ARTISTAS');
    const [espacios, setEspacios] = useState([]);
    const [artistas, setArtistas] = useState([]);
    const [entradas, setEntradas] = useState([]);

    // --- ESTADOS PARA FORMULARIOS ---
    const [nuevoArtista, setNuevoArtista] = useState({
        nombre: '', diaSemana: '', diaMes: '', mes: '', spotifyUrl: '', imagen: null,
        genero: '', escenario: ''
    });

    const [nuevaEntrada, setNuevaEntrada] = useState({
        categoria: '', descripcion: '', precio: '', stock: '', caracteristica: '', imagen: null
    });


    const [editingTicketId, setEditingTicketId] = useState(null);
    const [editingSpaceId, setEditingSpaceId] = useState(null);

    const [selectedEspacio, setSelectedEspacio] = useState(null);
    const [filtros, setFiltros] = useState({
        zona: [],
        tamano: [],
        precio: []
    });
    const [searchQuery, setSearchQuery] = useState('');

    const [loadingAdmin, setLoadingAdmin] = useState(true);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const [sincronizando, setSincronizando] = useState(false);

    // --- CARGA DE DATOS ---
    const loadAllData = async () => {
        setLoadingAdmin(true);
        try {
            const [espaciosData, entradasData, artistasData] = await Promise.all([
                getEspacios(),
                getEntradas(),
                getArtistas()
            ]);

            setEspacios(Array.isArray(espaciosData) ? espaciosData : []);

            setEntradas(Array.isArray(entradasData) ? entradasData.map(e => ({
                id: e.id,
                categoria: e.category || '',
                descripcion: e.description || '',
                precio: e.price || '',
                caracteristica: e.feature || '',
                imagen: e.imageUrl || null,
                stock: e.stock !== undefined ? e.stock : ''
            })) : []);

            setArtistas(Array.isArray(artistasData) ? artistasData.map(a => {
                const isoDate = a.performanceDate || '';
                let diaSemana = '', diaMes = '', mes = '';
                if (isoDate) {
                    // Añadimos T12:00:00 para evitar desfases por zona horaria
                    const d = new Date(isoDate + 'T12:00:00');
                    const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                    const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                    diaSemana = DIAS[d.getDay()];
                    diaMes = d.getDate().toString();
                    mes = MESES[d.getMonth()];
                }
                const urlImagen = a.imageUrl || a.img || null;
                return {
                    id: a.id,
                    nombre: a.name || a.nombre || '',
                    diaSemana,
                    diaMes,
                    mes,
                    spotifyUrl: a.spotifyUrl || a.spoty || '',
                    imagen: urlImagen,
                    imagenUrl: urlImagen,
                    genero: a.genre || '',
                    escenario: a.stage || ''
                };
            }) : []);
        } catch (error) {
            console.error("Error cargando panel:", error);
        } finally {
            setLoadingAdmin(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    const mostrarMensaje = (texto, tipo) => {
        setMensaje({ texto, tipo });
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    };

    // Función auxiliar para autocalcular el día de la semana
    const calcularDiaSemana = (dia, mesTexto) => {
        if (!dia || !mesTexto) return '';
        const MESES_ISO = {
            'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
            'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
            'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
        };
        const mesISO = MESES_ISO[mesTexto.toLowerCase()];
        if (!mesISO) return '';
        const d = new Date(`2026-${mesISO}-${dia.toString().padStart(2, '0')}T12:00:00`);
        const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return DIAS[d.getDay()] || '';
    };

    // --- LÓGICA ARTISTAS ---
    const handleAddArtista = async () => {
        if (!nuevoArtista.nombre) return;
        try {
            // Calculamos el nombre del día para guardarlo (opcional, el backend lo recalcula)
            const diaSemCalculado = calcularDiaSemana(nuevoArtista.diaMes, nuevoArtista.mes);
            const artistDTO = {
                name: nuevoArtista.nombre,
                diaMes: nuevoArtista.diaMes,
                mes: nuevoArtista.mes,
                performanceDate: `${diaSemCalculado} ${nuevoArtista.diaMes} ${nuevoArtista.mes}`,
                spotifyUrl: nuevoArtista.spotifyUrl,
                genre: nuevoArtista.genero,
                stage: nuevoArtista.escenario,
                imageFile: nuevoArtista.imagen
            };

            await createArtist(artistDTO);
            mostrarMensaje("Artista añadido correctamente", "success");
            loadAllData();
            setNuevoArtista({ nombre: '', diaSemana: '', diaMes: '', mes: '', spotifyUrl: '', imagen: null, genero: '', escenario: '' });
        } catch (error) {
            mostrarMensaje("Error al añadir artista", "error");
        }
    };

    const handleSaveAllArtistas = async () => {
        try {
            await Promise.all(
                artistas.map(artista => {
                    // Usar la URL string si imagen sigue siendo string, si no usar la URL original preservada
                    const urlFinal = typeof artista.imagen === 'string'
                        ? artista.imagen
                        : (artista.imagenUrl || undefined);
                    const dataToSend = {
                        ...artista,
                        imageUrl: urlFinal,
                        imagenUrl: urlFinal,
                    };
                    return updateArtist(artista.id, dataToSend);
                })
            );
            mostrarMensaje("Cambios guardados correctamente", "success");
            loadAllData();
        } catch (error) {
            mostrarMensaje("Error al guardar cambios", "error");
        }
    };

    const handleUpdateArtista = (id, field, value) => {
        setArtistas(prev =>
            prev.map(a => a.id === id ? { ...a, [field]: value } : a)
        );
    };

    const handleDeleteArtista = async (id) => {
        if (!window.confirm("¿Eliminar este artista?")) return;
        try {
            await deleteArtist(id);
            loadAllData();
            mostrarMensaje("Artista eliminado", "success");
        } catch (error) {
            mostrarMensaje("Error al eliminar", "error");
        }
    };



    const handleSincronizarSpotify = async () => {
        setSincronizando(true);
        try {
            await syncSpotifyPlaylist();
            alert("✅ ¡Playlist actualizada en Spotify con éxito!");
        } catch (error) {
            console.error("Error al sincronizar:", error);
            alert("❌ Hubo un error al actualizar la playlist.");
        } finally {
            setSincronizando(false); // Volvemos a habilitar el botón
        }
    };

    // --- LÓGICA ENTRADAS ---
    const handleEditTicketClick = (entrada) => {
        setEditingTicketId(entrada.id);
        setNuevaEntrada({
            categoria: entrada.categoria,
            descripcion: entrada.descripcion,
            precio: entrada.precio,
            caracteristica: entrada.caracteristica,
            imagen: null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddEntrada = async () => {
        if (!nuevaEntrada.categoria || !nuevaEntrada.precio) return;
        try {
            const ticketDTO = {
                categoria: nuevaEntrada.categoria,
                category: nuevaEntrada.categoria,
                descripcion: nuevaEntrada.descripcion,
                description: nuevaEntrada.descripcion,
                precio: parseFloat(nuevaEntrada.precio),
                price: parseFloat(nuevaEntrada.precio),
                stock: parseInt(nuevaEntrada.stock) || 0,
                caracteristica: nuevaEntrada.caracteristica || "Novedad",
                feature: nuevaEntrada.caracteristica || "Novedad",
                imageFile: nuevaEntrada.imagen // Pasar el archivo físico
            };

            if (editingTicketId) {
                const formData = new FormData();
                formData.append("category", ticketDTO.categoria);
                formData.append("description", ticketDTO.descripcion);
                formData.append("price", ticketDTO.precio);
                formData.append("feature", ticketDTO.caracteristica || "Acceso estándar");
                if (ticketDTO.imageFile) {
                    formData.append("image", ticketDTO.imageFile);
                }
                // Si no hay imagen, enviamos form sin imagen y el backend lo ignora con updateTicketWithImage
                await updateTicketWithImage(editingTicketId, formData);
                mostrarMensaje("Entrada actualizada correctamente", "success");
                setEditingTicketId(null);
            } else {
                await createTicket(ticketDTO);
                mostrarMensaje("Entrada creada correctamente", "success");
            }

            loadAllData();
            setNuevaEntrada({ categoria: '', descripcion: '', precio: '', caracteristica: '', imagen: null });
        } catch (error) {
            mostrarMensaje("Error al procesar entrada", "error");
        }
    };

    const handleUpdateEntrada = (id, field, value) => {
        setEntradas(prev =>
            prev.map(e => e.id === id ? { ...e, [field]: value } : e)
        );
    };

    const handleSaveAllEntradas = async () => {
        try {
            await Promise.all(
                entradas.map(entrada => {
                    const imagenFinal = typeof entrada.imagen === 'string'
                        ? entrada.imagen
                        : (entrada.imagenUrl || undefined);

                    const ticketDTO = {
                        category: entrada.categoria,
                        description: entrada.descripcion,
                        price: parseFloat(entrada.precio) || 0,
                        feature: entrada.caracteristica || 'Acceso estándar',
                        imageUrl: imagenFinal || 'https://via.placeholder.com/300',
                        stock: entrada.stock !== '' && entrada.stock !== undefined ? parseInt(entrada.stock, 10) : 100
                    };

                    return updateTicket(entrada.id, ticketDTO);
                })
            );
            mostrarMensaje('Cambios guardados correctamente en la base de datos', 'success');
            loadAllData();
        } catch (error) {
            console.error('Error al guardar entradas:', error);
            mostrarMensaje('Error al guardar los cambios. Revisa la consola.', 'error');
        }
    };

    const handleDeleteEntrada = async (id) => {
        if (!window.confirm("¿Eliminar esta entrada?")) return;
        try {
            await deleteTicket(id);
            loadAllData();
            mostrarMensaje("Entrada eliminada", "success");
        } catch (error) {
            mostrarMensaje("Error al eliminar", "error");
        }
    };

    // --- LÓGICA ESPACIOS ---

    const handleUpdateEspacio = (id, field, value) => {
        setEspacios(prev =>
            prev.map(e => e.id === id ? { ...e, [field]: value } : e)
        );
    };

    const handleSaveAllEspacios = async () => {
        try {
            await Promise.all(
                espacios.map(espacio => {
                    const spaceDTO = {
                        name: espacio.name,
                        type: espacio.type,
                        price: parseFloat(espacio.price),
                        sizeSquareMeters: parseInt(espacio.sizeSquareMeters),
                        isRented: espacio.isRented
                    };
                    return updateSpace(espacio.id, spaceDTO);
                })
            );
            mostrarMensaje("Cambios en espacios guardados correctamente", "success");
            loadAllData();
        } catch (error) {
            console.error("Error al guardar espacios:", error);
            mostrarMensaje("Error al guardar los cambios en los espacios", "error");
        }
    };

    // --- FILTROS ESPACIOS ---
    const handleFiltroChange = (categoria, valor) => {
        setFiltros(prev => {
            const nuevosValores = prev[categoria].includes(valor)
                ? prev[categoria].filter(v => v !== valor)
                : [...prev[categoria], valor];
            return { ...prev, [categoria]: nuevosValores };
        });
    };

    const espaciosFiltrados = espacios.filter(espacio => {
        if (filtros.zona.length > 0 && !filtros.zona.includes(espacio.type))
            return false;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const coincide =
                (espacio.name || '').toLowerCase().includes(q) ||
                (espacio.type || '').toLowerCase().includes(q);
            if (!coincide) return false;
        }

        if (filtros.tamano.length > 0) {
            const size = Number(espacio.sizeSquareMeters);
            let cumpleTamano = false;
            if (filtros.tamano.includes('< 200m²') && size < 200) cumpleTamano = true;
            if (filtros.tamano.includes('200 - 500m²') && size >= 200 && size <= 500) cumpleTamano = true;
            if (filtros.tamano.includes('> 500m²') && size > 500) cumpleTamano = true;
            if (!cumpleTamano) return false;
        }

        if (filtros.precio.length > 0) {
            const precioObj = Number(espacio.price);
            let cumplePrecio = false;
            if (filtros.precio.includes('< 2000€') && precioObj < 2000) cumplePrecio = true;
            if (filtros.precio.includes('2000 - 3000€') && precioObj >= 2000 && precioObj <= 3000) cumplePrecio = true;
            if (filtros.precio.includes('> 3000€') && precioObj > 3000) cumplePrecio = true;
            if (!cumplePrecio) return false;
        }
        return true;
    });

    if (loadingAdmin) return <div className="admin-loading">Cargando Panel de Control...</div>;

    return (
        <div className="admin-wrapper">
            {mensaje.texto && <div className={`admin-alert ${mensaje.tipo}`}>{mensaje.texto}</div>}

            <aside className="admin-sidebar">
                <div className="admin-logo-container" onClick={() => navigate('/')}>
                    <img src="/logoPI.png" alt="Logo" className="admin-logo" />
                    <p className="admin-badge">ADMIN</p>
                </div>
                <nav className="admin-nav">
                    <button className={`admin-nav-btn ${activeSection === 'ARTISTAS' ? 'active' : ''}`} onClick={() => setActiveSection('ARTISTAS')}>ARTISTAS</button>
                    <button className={`admin-nav-btn ${activeSection === 'GESTION_ESPACIOS' ? 'active' : ''}`} onClick={() => setActiveSection('GESTION_ESPACIOS')}>GESTIÓN ESPACIOS</button>
                    <button className={`admin-nav-btn ${activeSection === 'ENTRADAS' ? 'active' : ''}`} onClick={() => setActiveSection('ENTRADAS')}>ENTRADAS</button>
                </nav>
                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={() => { localStorage.clear(); navigate('/login'); }}>Cerrar Sesión</button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h2>{activeSection.replace('_', ' ')}</h2>
                    <div className="admin-profile-circle" onClick={() => navigate('/perfil')}>A</div>
                </header>

                {/* SECCIÓN ARTISTAS */}
                {activeSection === 'ARTISTAS' && (
                    <>
                        <div className="admin-content-box">
                            <h3 className="form-title">
                                GESTIÓN DE ARTISTAS - AÑADIR NUEVO
                            </h3>

                            <form className="admin-form" onSubmit={e => e.preventDefault()}>
                                <div className="form-grid artistas-form-grid">

                                    {/* Campo 1: Nombre */}
                                    <div className="artista-field artista-field-full">
                                        <label>Nombre del artista</label>
                                        <input
                                            type="text"
                                            placeholder="Nombre del artista / grupo"
                                            value={nuevoArtista.nombre}
                                            onChange={e => setNuevoArtista(p => ({ ...p, nombre: e.target.value }))}
                                        />
                                    </div>

                                    {/* Campo 2: Fecha */}
                                    <div className="artista-field artista-field-full">
                                        <label>Fecha de actuación</label>
                                        <div className="fecha-selects">
                                            <select
                                                value={`${nuevoArtista.diaMes}-${nuevoArtista.mes}`}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (val === "-") {
                                                        setNuevoArtista(p => ({ ...p, diaMes: "", mes: "" }));
                                                    } else {
                                                        const [d, m] = val.split('-');
                                                        setNuevoArtista(p => ({ ...p, diaMes: d, mes: m }));
                                                    }
                                                }}
                                                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#111', color: 'white' }}
                                            >
                                                <option value="-">Seleccionar día del festival...</option>
                                                <option value="17-Julio">Viernes, 17 de Julio (Día 1)</option>
                                                <option value="18-Julio">Sábado, 18 de Julio (Día 2)</option>
                                                <option value="19-Julio">Domingo, 19 de Julio (Día 3)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Campo 3: URL Spotify */}
                                    <div className="artista-field">
                                        <label>URL de Spotify</label>
                                        <input
                                            type="url"
                                            placeholder="https://open.spotify.com/artist/..."
                                            value={nuevoArtista.spotifyUrl}
                                            onChange={e => setNuevoArtista(p => ({ ...p, spotifyUrl: e.target.value }))}
                                        />
                                    </div>

                                    {/* Campo 4: Género */}
                                    <div className="artista-field">
                                        <label>Género</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Techno, Trap..."
                                            value={nuevoArtista.genero}
                                            onChange={e => setNuevoArtista(p => ({ ...p, genero: e.target.value }))}
                                        />
                                    </div>

                                    {/* Campo 5: Escenario */}
                                    <div className="artista-field artista-field-full">
                                        <label>Escenario</label>
                                        <select
                                            value={nuevoArtista.escenario}
                                            onChange={e => setNuevoArtista(p => ({ ...p, escenario: e.target.value }))}
                                        >
                                            <option value="">Seleccionar escenario</option>
                                            <option value="Main Stage">Main Stage</option>
                                            <option value="Techno Cave">Techno Cave</option>
                                            <option value="Urban Zone">Urban Zone</option>
                                        </select>
                                    </div>

                                    {/* Campo imagen */}
                                    <div className="artista-field artista-field-full">
                                        <label>Imagen del artista</label>
                                        <label className="artista-imagen-upload">
                                            {nuevoArtista.imagen ? (
                                                <div className="artista-imagen-preview-wrapper">
                                                    <img
                                                        src={URL.createObjectURL(nuevoArtista.imagen)}
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
                                                onChange={e => setNuevoArtista(p => ({ ...p, imagen: e.target.files[0] || null }))}
                                            />
                                        </label>
                                    </div>

                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-add-artist"
                                        onClick={handleAddArtista}
                                    >
                                        Añadir artista
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* ARTISTAS AÑADIDOS */}
                        <div className="artistas-existentes">
                            <h3 className="entradas-existentes-title">Artistas añadidos</h3>

                            {artistas.length === 0 ? (
                                <div className="artistas-empty">
                                    <span className="artistas-empty-icon">🎤</span>
                                    <p>No hay artistas añadidos todavía.</p>
                                    <p className="artistas-empty-sub">Usa el formulario de arriba para añadir el primer artista.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="artistas-grid">
                                        {artistas.map(artista => (
                                            <div key={artista.id} className="artista-card">

                                                {/* Preview imagen + botón eliminar */}
                                                <div className="artista-card-img-row">
                                                    <label className="artista-card-img-label">
                                                        {artista.imagen ? (
                                                            <img
                                                                src={
                                                                    typeof artista.imagen === 'string'
                                                                        ? artista.imagen
                                                                        : URL.createObjectURL(artista.imagen)
                                                                }
                                                                alt={artista.nombre}
                                                                className="artista-card-img"
                                                            />
                                                        ) : (
                                                            <div className="artista-card-img-placeholder">🎤</div>
                                                        )}
                                                        <span className="artista-card-img-overlay">🖼️ Cambiar</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            onChange={e => handleUpdateArtista(artista.id, 'imagen', e.target.files[0] || null)}
                                                        />
                                                    </label>
                                                    <button
                                                        className="entrada-delete-btn"
                                                        onClick={() => handleDeleteArtista(artista.id)}
                                                    >✕</button>
                                                </div>

                                                <input
                                                    className="entrada-edit-input"
                                                    value={artista.nombre}
                                                    placeholder="Nombre del artista"
                                                    onChange={e => handleUpdateArtista(artista.id, 'nombre', e.target.value)}
                                                />

                                                <div className="artista-card-fecha">
                                                    <select
                                                        className="artista-edit-select"
                                                        style={{ width: '100%' }}
                                                        value={`${artista.diaMes}-${artista.mes}`}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            if (val !== "-") {
                                                                const [d, m] = val.split('-');
                                                                handleUpdateArtista(artista.id, 'diaMes', d);
                                                                handleUpdateArtista(artista.id, 'mes', m);
                                                            }
                                                        }}
                                                    >
                                                        <option value="-">Asignar día...</option>
                                                        <option value="17-Julio">Viernes, 17 Jul</option>
                                                        <option value="18-Julio">Sábado, 18 Jul</option>
                                                        <option value="19-Julio">Domingo, 19 Jul</option>
                                                    </select>
                                                </div>

                                                <input
                                                    className="entrada-edit-input artista-spotify-input"
                                                    value={artista.spotifyUrl}
                                                    placeholder="URL de Spotify"
                                                    onChange={e => handleUpdateArtista(artista.id, 'spotifyUrl', e.target.value)}
                                                />

                                                {artista.spotifyUrl && (
                                                    <a
                                                        href={artista.spotifyUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="artista-spotify-link"
                                                    >
                                                        Abrir en Spotify
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* // Spotify Sync Button*/}
                                    <button
                                        onClick={handleSincronizarSpotify}
                                        disabled={sincronizando}
                                        className="btn-sync-spotify"
                                    >
                                        {sincronizando ? 'Sincronizando...' : 'Actualizar Playlist de Spotify'}
                                    </button>


                                    <div className="entradas-save">
                                        <button className="btn-guardar" onClick={handleSaveAllArtistas}>
                                            Guardar cambios
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="admin-stats">
                            <div className="stat-card">
                                <h4>Total Entradas Vendidas</h4>
                                <p className="stat-number">45,832</p>
                            </div>

                            <div className="stat-card">
                                <h4>Artistas Confirmados</h4>
                                <p className="stat-number">48</p>
                            </div>

                            <div className="stat-card">
                                <h4>Proveedores Activos</h4>
                                <p className="stat-number">23</p>
                            </div>

                            <div className="stat-card">
                                <h4>Ingresos Totales</h4>
                                <p className="stat-number">3.2M€</p>
                            </div>
                        </div>
                    </>
                )}

                {/* --- SECCIÓN ENTRADAS --- */}
                {activeSection === 'ENTRADAS' && (
                    <div className="entradas-container">

                        {/* FORMULARIO AÑADIR */}
                        <div className="admin-content-box">
                            <h3 className="form-title">Gestión de entradas</h3>
                            <div className="entradas-form-grid">
                                <div className="entradas-form-field">
                                    <label>Categoría</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: General, VIP..."
                                        value={nuevaEntrada.categoria}
                                        onChange={e => setNuevaEntrada(p => ({ ...p, categoria: e.target.value }))}
                                    />
                                </div>
                                <div className="entradas-form-field">
                                    <label>Descripción</label>
                                    <input
                                        type="text"
                                        placeholder="Descripción breve"
                                        value={nuevaEntrada.descripcion}
                                        onChange={e => setNuevaEntrada(p => ({ ...p, descripcion: e.target.value }))}
                                    />
                                </div>
                                <div className="entradas-form-field">
                                    <label>Precio</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="Ej: 49.99"
                                        value={nuevaEntrada.precio}
                                        onChange={e => setNuevaEntrada(p => ({ ...p, precio: e.target.value.replace(/[^0-9.]/g, '') }))}
                                    />
                                </div>
                                <div className="entradas-form-field">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        placeholder="Ej: 100"
                                        value={nuevaEntrada.stock}
                                        onChange={e => setNuevaEntrada(p => ({ ...p, stock: e.target.value }))}
                                    />
                                </div>
                                <div className="entradas-form-field">
                                    <label>Etiqueta</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Acceso estándar"
                                        value={nuevaEntrada.caracteristica}
                                        onChange={e => setNuevaEntrada(p => ({ ...p, caracteristica: e.target.value }))}
                                    />
                                </div>
                                <div className="entradas-form-field entradas-form-imagen">
                                    <label>Imagen entrada</label>
                                    <label className="artista-imagen-upload">
                                        {nuevaEntrada.imagen ? (
                                            <div className="artista-imagen-preview-wrapper">
                                                <img
                                                    src={URL.createObjectURL(nuevaEntrada.imagen)}
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
                                            onChange={e => setNuevaEntrada(p => ({ ...p, imagen: e.target.files[0] || null }))}
                                        />
                                    </label>
                                </div>
                                <div className="entradas-form-field entradas-form-btn">
                                    <button className="btn-add-artist" onClick={handleAddEntrada}>
                                        Añadir entrada
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* GESTIONAR EXISTENTES */}
                        <div className="entradas-existentes">
                            <h3 className="entradas-existentes-title">Gestionar entradas existentes</h3>

                            {entradas.length === 0 ? (
                                <div className="artistas-empty">
                                    <span className="artistas-empty-icon">🎟️</span>
                                    <p>No hay entradas creadas todavía.</p>
                                    <p className="artistas-empty-sub">Usa el formulario de arriba para añadir la primera entrada.</p>
                                </div>
                            ) : (
                                <div className="entradas-grid">
                                    {entradas.map(entrada => (
                                        <div key={entrada.id} className="entrada-card">
                                            <div className="artista-card-img-row">
                                                <label className="artista-card-img-label">
                                                    {entrada.imagen ? (
                                                        <img
                                                            src={
                                                                typeof entrada.imagen === 'string'
                                                                    ? entrada.imagen
                                                                    : URL.createObjectURL(entrada.imagen)
                                                            }
                                                            alt={entrada.categoria}
                                                            className="artista-card-img"
                                                        />
                                                    ) : (
                                                        <div className="artista-card-img-placeholder">🎟️</div>
                                                    )}
                                                    <span className="artista-card-img-overlay">🖼️ Cambiar</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        onChange={e => handleUpdateEntrada(entrada.id, 'imagen', e.target.files[0] || null)}
                                                    />
                                                </label>
                                                <button
                                                    className="entrada-delete-btn"
                                                    onClick={() => handleDeleteEntrada(entrada.id)}
                                                >✕</button>
                                            </div>
                                            <input
                                                className="entrada-edit-input"
                                                value={entrada.categoria}
                                                placeholder="Categoría"
                                                onChange={e => handleUpdateEntrada(entrada.id, 'categoria', e.target.value)}
                                            />
                                            <input
                                                className="entrada-edit-input"
                                                value={entrada.descripcion}
                                                placeholder="Descripción"
                                                onChange={e => handleUpdateEntrada(entrada.id, 'descripcion', e.target.value)}
                                            />
                                            <input
                                                className="entrada-edit-input"
                                                value={entrada.precio}
                                                placeholder="Precio"
                                                onChange={e => handleUpdateEntrada(entrada.id, 'precio', e.target.value)}
                                            />
                                            <input
                                                className="entrada-edit-input"
                                                value={entrada.caracteristica}
                                                placeholder="Etiqueta"
                                                onChange={e => handleUpdateEntrada(entrada.id, 'caracteristica', e.target.value)}
                                            />
                                            <input
                                                className="entrada-edit-input"
                                                type="number"
                                                value={entrada.stock}
                                                placeholder="Stock"
                                                onChange={e => handleUpdateEntrada(entrada.id, 'stock', e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {entradas.length > 0 && (
                                <div className="entradas-save">
                                    <button className="btn-guardar" onClick={handleSaveAllEntradas}>
                                        Guardar cambios
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                )}

                {/* --- SECCIÓN ESPACIOS --- */}
                {activeSection === 'GESTION_ESPACIOS' && (
                    <div className="espacios-container">
                        {/* Filtros laterales */}
                        <aside className="espacios-filters">
                            <div className="filter-section">
                                <h4>Zona del Recinto</h4>
                                {['Norte', 'Sur', 'Este', 'Oeste', 'Centro'].map(zona => (
                                    <label key={zona}>
                                        <input
                                            type="checkbox"
                                            checked={filtros.zona.includes(zona)}
                                            onChange={() => handleFiltroChange('zona', zona)}
                                        />
                                        {zona}
                                    </label>
                                ))}
                            </div>

                            <div className="filter-section">
                                <h4>Tamaño</h4>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filtros.tamano.includes('< 200m²')}
                                        onChange={() => handleFiltroChange('tamano', '< 200m²')}
                                    />
                                    {'< 200m²'}
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filtros.tamano.includes('200 - 500m²')}
                                        onChange={() => handleFiltroChange('tamano', '200 - 500m²')}
                                    />
                                    200 - 500m²
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filtros.tamano.includes('> 500m²')}
                                        onChange={() => handleFiltroChange('tamano', '> 500m²')}
                                    />
                                    {'> 500m²'}
                                </label>
                            </div>

                            <div className="filter-section">
                                <h4>Precio</h4>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filtros.precio.includes('< 2000€')}
                                        onChange={() => handleFiltroChange('precio', '< 2000€')}
                                    />
                                    {'< 2.000€'}
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filtros.precio.includes('2000 - 3000€')}
                                        onChange={() => handleFiltroChange('precio', '2000 - 3000€')}
                                    />
                                    2.000 - 3.000€
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filtros.precio.includes('> 3000€')}
                                        onChange={() => handleFiltroChange('precio', '> 3000€')}
                                    />
                                    {'> 3.000€'}
                                </label>
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
                            <div className="espacios-search">
                                <input
                                    type="text"
                                    placeholder="Buscar espacio..."
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="espacios-grid">
                                {espaciosFiltrados.map(espacio => (
                                    <div
                                        key={espacio.id}
                                        className={`espacio-card ${espacio.isRented ? 'reservado' : ''}`}
                                        onClick={() => setSelectedEspacio(espacio)}
                                    >
                                        <div className={`espacio-status ${espacio.isRented ? 'reservado' : 'libre'}`}>
                                            {espacio.isRented ? "OCUPADO" : "LIBRE"}
                                        </div>
                                        <span className="zona-badge">Zona {espacio.type}</span>
                                        <h3>{espacio.name}</h3>
                                        <p className="espacio-detalle"> {espacio.sizeSquareMeters} m²</p>
                                        <div className="espacio-precio-edit" onClick={e => e.stopPropagation()}>
                                            <label>Precio:</label>
                                            <div className="precio-input-wrapper">
                                                <input
                                                    type="number"
                                                    value={espacio.price}
                                                    onChange={e => handleUpdateEspacio(espacio.id, 'price', e.target.value)}
                                                    className="entrada-edit-input"
                                                />
                                                <span className="precio-simbolo">€</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {espaciosFiltrados.length === 0 && (
                                <div className="no-results">
                                    <p>No se encontraron espacios con los filtros seleccionados</p>
                                </div>
                            )}

                            {espacios.length > 0 && (
                                <div className="entradas-save" style={{ marginTop: '40px' }}>
                                    <button className="btn-guardar" onClick={handleSaveAllEspacios}>
                                        Guardar cambios en espacios
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Modal de detalle del espacio */}
                {selectedEspacio && (
                    <div className="modal-overlay" onClick={() => setSelectedEspacio(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setSelectedEspacio(null)}>✕</button>

                            <h2>{selectedEspacio.name}</h2>

                            <div className="modal-grid">
                                <div className="modal-section">
                                    <h4>Información General</h4>
                                    <p><strong>Zona:</strong> {selectedEspacio.type}</p>
                                    <p><strong>Tamaño:</strong> {selectedEspacio.sizeSquareMeters} m²</p>
                                    <p><strong>Precio base:</strong> {selectedEspacio.price}€</p>
                                    <p><strong>Estado:</strong> <span className={`status-badge ${selectedEspacio.isRented ? 'reservado' : 'libre'}`}>{selectedEspacio.isRented ? 'ALQUILADO' : 'LIBRE DE RESERVA'}</span></p>
                                </div>

                                {selectedEspacio.isRented && (
                                    <div className="modal-section negocio-section">
                                        <h4>🏢 Reservado por Proveedor</h4>
                                        <p>Se ha recibido una petición de alquiler para este espacio. Consulta el correo de la administración.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <Footer />
            </main>
        </div>
    );
}

export default Perfil_Admin;