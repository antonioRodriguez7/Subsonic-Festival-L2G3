import React, { useState, useEffect } from "react";
import { FaSpotify } from "react-icons/fa";
import "./Cartel.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getArtistas } from "../../services/api";

function Cartel() {
    const [search, setSearch] = useState("");
    const [artistas, setArtistas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Carga de datos desde el backend
    useEffect(() => {
        const fetchArtistas = async () => {
            try {
                const data = await getArtistas();
                setArtistas(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error al cargar artistas:", err);
                setError("No se pudo conectar con el servidor de artistas.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchArtistas();
    }, []);

    // 2. Filtrado por búsqueda
    const artistasFiltrados = artistas.filter((artista) => {
        const nombre = artista.name || "";
        return nombre.toLowerCase().includes(search.toLowerCase());
    });

    // 3. Formateador de Fecha Bonita (VIERNES, 17 DE JULIO)
    const formatFecha = (fechaStr) => {
        if (!fechaStr) return "FECHA POR CONFIRMAR";

        // Si ya viene con el nombre del día (ej: "Viernes 17 Julio")
        if (fechaStr.includes("Viernes") || fechaStr.includes("Sábado") || fechaStr.includes("Domingo")) {
            return fechaStr.toUpperCase();
        }

        const date = new Date(fechaStr);
        if (isNaN(date.getTime())) return fechaStr.toUpperCase();
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).toUpperCase();
    };

    return (
        <div className="cartel-page">
            <Header />

            {/* SECCIÓN 1: EL "CARTEL OFICIAL" (Borde Neón Naranja) */}
            <section className="cartel-hero-section">
                <div className="cartel-neon-frame">
                    <h1 className="cartel-main-title">LINEUP 2026</h1>

                    {isLoading ? (
                        <p className="loading-text">SINCRONIZANDO CON EL BACKEND...</p>
                    ) : error ? (
                        <p className="error-text">{error}</p>
                    ) : artistasFiltrados.length > 0 ? (
                        <div className="neon-artists-list">
                            {artistasFiltrados.map((artista) => (
                                <h2 className="neon-artist-name" key={`neon-${artista.id}`}>
                                    {artista.name}
                                    {artista.spotifyUrl && <FaSpotify className="neon-spoty-icon" />}
                                </h2>
                            ))}
                        </div>
                    ) : (
                        <p className="no-results">EL CARTEL ESTÁ PENDIENTE DE CONFIRMACIONES...</p>
                    )}
                </div>
            </section>

            {/* SECCIÓN DE BÚSQUEDA */}
            <section className="artist-search-section">
                <input
                    type="text"
                    placeholder="Buscar artista..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="artist-search"
                />
            </section>

            {/* SECCIÓN 2: LAS TARJETAS DETALLADAS (Grid de Fotos) */}
            <section className="artists-section">
                <div className="artists-grid">
                    {isLoading ? (
                        <p className="loading-text" style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '1.2rem', color: '#ccc' }}>Cargando cartelería...</p>
                    ) : error ? (
                        <p className="error-text" style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '1.2rem', color: '#ff4d4d' }}>{error}</p>
                    ) : artistasFiltrados.length > 0 ? (
                        artistasFiltrados.map((artista) => (
                            <div className="artist-card" key={`card-${artista.id}`}>
                                <div className="artist-img-wrapper">
                                    <img src={artista.imageUrl || "/placeholder-artist.jpg"} alt={artista.name} />
                                </div>

                                <div className="artist-content">
                                    <h3>{artista.name}</h3>

                                    {/* Género (nuevo campo de Carlos) */}
                                    {artista.genre && (
                                        <p className="artist-genre">{artista.genre}</p>
                                    )}

                                    {/* Fecha formateada */}
                                    <p className="artist-date">
                                        {formatFecha(artista.performanceDate)}
                                    </p>

                                    <div className="artist-socials">
                                        {artista.spotifyUrl && (
                                            <a
                                                href={artista.spotifyUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaSpotify className="spotify-icon" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No se encontró ningún artista</p>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Cartel;