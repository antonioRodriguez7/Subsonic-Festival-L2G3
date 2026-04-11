import React from 'react';
import './Servicios.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";


function Servicios() {

    return (
        <div className="servicios-container">
           <Header />

            <main className="servicios-main">
                <section className="servicios-hero">
                    <h1>Servicios del Festival</h1>
                    <p>Todo lo que necesitas para disfrutar al máximo de Subsonic 2026</p>
                </section>

                <section className="servicios-grid">
                    <div className="servicio-card">
                        <div className="servicio-icon">🍔</div>
                        <h3>Food & Drinks</h3>
                        <p>Amplia variedad de foodtrucks y barras premium con opciones para todos los gustos.</p>
                        <ul>
                            <li>Cocina internacional</li>
                            <li>Opciones veganas y vegetarianas</li>
                            <li>Cócteles y bebidas premium</li>
                        </ul>
                    </div>

                    <div className="servicio-card">
                        <div className="servicio-icon">🚌</div>
                        <h3>Transporte</h3>
                        <p>Facilita tu llegada al festival con nuestras opciones de transporte.</p>
                        <ul>
                            <li>Lanzaderas desde principales ciudades</li>
                            <li>Parking gratuito disponible</li>
                            <li>Zona de taxis y VTC</li>
                        </ul>
                    </div>

                    <div className="servicio-card">
                        <div className="servicio-icon">🏕️</div>
                        <h3>Camping</h3>
                        <p>Zona de acampada para que vivas la experiencia completa.</p>
                        <ul>
                            <li>Camping general y glamping</li>
                            <li>Duchas y baños 24h</li>
                            <li>Zona de descanso y sombra</li>
                        </ul>
                    </div>

                    <div className="servicio-card">
                        <div className="servicio-icon">🛍️</div>
                        <h3>Merchandising</h3>
                        <p>Llévate un recuerdo único del festival.</p>
                        <ul>
                            <li>Camisetas y sudaderas oficiales</li>
                            <li>Ediciones limitadas</li>
                            <li>Accesorios exclusivos</li>
                        </ul>
                    </div>

                    <div className="servicio-card">
                        <div className="servicio-icon">🏥</div>
                        <h3>Servicios Médicos</h3>
                        <p>Tu seguridad es nuestra prioridad.</p>
                        <ul>
                            <li>Enfermería 24h</li>
                            <li>Personal sanitario cualificado</li>
                            <li>Ambulancia disponible</li>
                        </ul>
                    </div>

                    <div className="servicio-card">
                        <div className="servicio-icon">💳</div>
                        <h3>Cashless</h3>
                        <p>Paga de forma rápida y segura en todo el recinto.</p>
                        <ul>
                            <li>Pulsera NFC incluida</li>
                            <li>Recarga online o en el festival</li>
                            <li>Sin efectivo, sin preocupaciones</li>
                        </ul>
                    </div>

                    <div className="servicio-card">
                        <div className="servicio-icon">📱</div>
                        <h3>App Oficial</h3>
                        <p>Toda la información del festival en tu móvil.</p>
                        <ul>
                            <li>Horarios actualizados</li>
                            <li>Mapa interactivo</li>
                            <li>Notificaciones en directo</li>
                        </ul>
                    </div>

                    <div className="servicio-card">
                        <div className="servicio-icon">♿</div>
                        <h3>Accesibilidad</h3>
                        <p>Festival inclusivo para todas las personas.</p>
                        <ul>
                            <li>Zonas PMR adaptadas</li>
                            <li>Intérpretes de lengua de signos</li>
                            <li>Acceso preferente</li>
                        </ul>
                    </div>

                    <div className="servicio-card">
                        <div className="servicio-icon">🔒</div>
                        <h3>Taquillas</h3>
                        <p>Guarda tus pertenencias de forma segura.</p>
                        <ul>
                            <li>Taquillas individuales y grupales</li>
                            <li>Acceso ilimitado durante el evento</li>
                            <li>Carga de dispositivos móviles</li>
                        </ul>
                    </div>
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
