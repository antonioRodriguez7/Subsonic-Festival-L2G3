import React, { useState, useEffect } from 'react';
import './Servicios.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getAllServices } from '../../services/api';

const TIPO_ICON = {
    'Restauración': '🍔',
    'Bebidas': '🍹',
    'Merchandising': '🛍️',
    'Entretenimiento': '🎭',
    'Transporte': '🚌',
    'Otro': '✨',
};

function Servicios() {

    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const data = await getAllServices();
                setServicios(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error cargando servicios:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchServicios();
    }, []);

    return (
        <div className="servicios-container">
            <Header />

            <main className="servicios-main">
                <section className="servicios-hero">
                    <h1>Servicios del Festival</h1>
                    <p>Todo lo que necesitas para disfrutar al máximo de Subsonic 2026</p>
                </section>

                {/* SERVICIOS DINÁMICOS DESDE EL BACKEND */}
                <section className="servicios-grid">
                    {loading ? (
                        <div className="servicios-loading">
                            <div className="servicios-spinner"></div>
                            <p>Cargando servicios...</p>
                        </div>
                    ) : servicios.length === 0 ? (
                        <div className="servicios-empty">
                            <span>🎪</span>
                            <p>Los servicios del festival se anunciarán próximamente.</p>
                        </div>
                    ) : (
                        servicios.map(servicio => (
                            <div key={servicio.id} className="servicio-card servicio-card--dynamic">
                                {servicio.imagenUrl ? (
                                    <div className="servicio-card-img">
                                        <img src={servicio.imagenUrl} alt={servicio.nombre} />
                                    </div>
                                ) : (
                                    <div className="servicio-icon">
                                        {TIPO_ICON[servicio.tipo] || '✨'}
                                    </div>
                                )}
                                <div className="servicio-card-body">
                                    <span className="servicio-tipo-badge">{servicio.tipo}</span>
                                    <h3>{servicio.nombre}</h3>
                                    {servicio.descripcion && <p>{servicio.descripcion}</p>}
                                    {servicio.fechas && (
                                        <p className="servicio-fechas">📅 {servicio.fechas}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </section>

                <section className="servicios-info">
                    <h2>Información Adicional</h2>
                    <div className="info-boxes">
                        <div className="info-box">
                            <h4>Horarios</h4>
                            <p>Puertas abren: 18:00h</p>
                            <p>Primer artista: 19:00h</p>
                            <p>Cierre: 06:00h</p>
                        </div>
                        <div className="info-box">
                            <h4>Edad Mínima</h4>
                            <p>+18 años</p>
                            <p>ID obligatorio</p>
                        </div>
                        <div className="info-box">
                            <h4>Contacto</h4>
                            <p>info@subsonicfestival.com</p>
                            <p>Tel: +34 900 123 456</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Servicios;
