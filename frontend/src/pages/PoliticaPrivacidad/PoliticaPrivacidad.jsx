import React from 'react';
import Header from '../../components/Header'; // Ajusta la ruta según tu carpeta
import './PoliticaPrivacidad.css';
import Footer from "../../components/Footer";

function PoliticaPrivacidad() {
    return (
        <div className="app-container">
            <Header />
            <main className="policy-main">
                <section className="policy-hero">
                    <h1>POLÍTICA DE PRIVACIDAD</h1>
                    <p>Última actualización: Marzo 2026</p>
                </section>

                <section className="policy-text-container">
                    <div className="policy-block">
                        <h2>1. Responsable del Tratamiento</h2>
                        <p>Subsonic Festival S.L. es el responsable del tratamiento de tus datos personales recogidos a través de esta plataforma.</p>
                    </div>

                    <div className="policy-block">
                        <h2>2. Finalidad de los Datos</h2>
                        <p>Utilizamos tu información para:
                            <ul>
                                <li>Gestionar la venta y envío de entradas (Abonos, VIP, Dream VIP).</li>
                                <li>Enviarte actualizaciones críticas sobre el festival (cambios de horario, seguridad).</li>
                                <li>Mejorar tu experiencia mediante el análisis de navegación.</li>
                            </ul>
                        </p>
                    </div>

                    <div className="policy-block">
                        <h2>3. Conservación de Datos</h2>
                        <p>Tus datos se conservarán mientras exista un interés mutuo para mantener el fin del tratamiento o cuando sea necesario por obligaciones legales.</p>
                    </div>

                    <div className="policy-block">
                        <h2>4. Derechos del Usuario</h2>
                        <p>Tienes derecho a acceder, rectificar y suprimir tus datos, así como otros derechos detallados en la normativa vigente, contactando a <strong>privacy@subsonicfestival.com</strong>.</p>
                    </div>
                </section>
            </main>

              <Footer />
        </div>
    );
}

export default PoliticaPrivacidad;