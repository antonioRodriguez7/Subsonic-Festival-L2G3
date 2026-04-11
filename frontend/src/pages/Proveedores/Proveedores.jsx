import React, { useState } from 'react';
import './Proveedores.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";


function Proveedores() {
    const [formData, setFormData] = useState({
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        categoria: '',
        mensaje: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);
        alert('Tu solicitud ha sido enviada. Te contactaremos pronto.');
        setFormData({
            nombre: '',
            empresa: '',
            email: '',
            telefono: '',
            categoria: '',
            mensaje: ''
        });
    };

    return (
        <div className="proveedores-container">
         <Header />

            <main className="proveedores-main">
                <section className="proveedores-hero">
                    <h1>Acceso Proveedores</h1>
                    <p>Únete al mayor festival de música urbana y electrónica de Europa</p>
                </section>

                <section className="proveedores-info">
                    <h2>¿Por qué ser proveedor de Subsonic?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">👥</div>
                            <h3>Alcance Masivo</h3>
                            <p>Más de 80,000 asistentes de toda Europa en 3 días</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">📈</div>
                            <h3>Visibilidad Garantizada</h3>
                            <p>Promoción en redes sociales y marketing directo</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">🎯</div>
                            <h3>Público Objetivo</h3>
                            <p>Audiencia joven, conectada y con poder adquisitivo</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">🤝</div>
                            <h3>Networking</h3>
                            <p>Conecta con otros proveedores y marcas líderes</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">💼</div>
                            <h3>Oportunidades de Negocio</h3>
                            <p>Colaboraciones y proyectos a largo plazo</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">🎉</div>
                            <h3>Experiencia Única</h3>
                            <p>Sé parte de un evento de clase mundial</p>
                        </div>
                    </div>
                </section>

                <section className="proveedores-categories">
                    <h2>Categorías de Proveedores Buscados</h2>
                    <div className="categories-grid">
                        <div className="category-item">
                            <span className="category-icon">🍔</span>
                            <h4>Food & Beverage</h4>
                            <p>Foodtrucks, bares, restaurantes y catering</p>
                        </div>

                        <div className="category-item">
                            <span className="category-icon">🛍️</span>
                            <h4>Merchandising</h4>
                            <p>Ropa, accesorios y productos exclusivos del festival</p>
                        </div>

                        <div className="category-item">
                            <span className="category-icon">🚌</span>
                            <h4>Transporte</h4>
                            <p>Empresas de autobús, taxi, aparcamiento</p>
                        </div>

                        <div className="category-item">
                            <span className="category-icon">🏥</span>
                            <h4>Servicios Médicos</h4>
                            <p>Proveedores sanitarios y de seguridad</p>
                        </div>

                        <div className="category-item">
                            <span className="category-icon">🏕️</span>
                            <h4>Alojamiento</h4>
                            <p>Camping, glamping, hoteles y albergues</p>
                        </div>

                        <div className="category-item">
                            <span className="category-icon">🎪</span>
                            <h4>Entretenimiento</h4>
                            <p>Actividades, DJ sets, experiencias interactivas</p>
                        </div>

                        <div className="category-item">
                            <span className="category-icon">📱</span>
                            <h4>Tecnología</h4>
                            <p>Sistemas de pagos, apps, infraestructura digital</p>
                        </div>

                        <div className="category-item">
                            <span className="category-icon">🎨</span>
                            <h4>Diseño & Marketing</h4>
                            <p>Agencias creativas, publicidad y comunicación</p>
                        </div>
                    </div>
                </section>

                <section className="proveedores-form-section">
                    <h2>¿Interesado en Colaborar?</h2>
                    <p className="form-subtitle">Completa este formulario y nos pondremos en contacto contigo</p>

                    <form className="proveedores-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre Completo *</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="empresa">Empresa/Negocio *</label>
                            <input
                                type="text"
                                id="empresa"
                                name="empresa"
                                value={formData.empresa}
                                onChange={handleChange}
                                required
                                placeholder="Nombre de tu empresa"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono *</label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    placeholder="+34 600 000 000"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="categoria">Categoría *</label>
                            <select
                                id="categoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                <option value="food">Food & Beverage</option>
                                <option value="merchandising">Merchandising</option>
                                <option value="transporte">Transporte</option>
                                <option value="medico">Servicios Médicos</option>
                                <option value="alojamiento">Alojamiento</option>
                                <option value="entretenimiento">Entretenimiento</option>
                                <option value="tecnologia">Tecnología</option>
                                <option value="marketing">Diseño & Marketing</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="mensaje">Mensaje *</label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleChange}
                                required
                                placeholder="Cuéntanos sobre tu empresa y por qué te gustaría colaborar con Subsonic"
                                rows="5"
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Enviar Solicitud</button>
                    </form>
                </section>

                <section className="proveedores-contact">
                    <h2>Contacto Directo</h2>
                    <div className="contact-info">
                        <div className="contact-box">
                            <h4>Email de Proveedores</h4>
                            <a href="mailto:proveedores@subsonicfestival.com">
                                proveedores@subsonicfestival.com
                            </a>
                        </div>

                        <div className="contact-box">
                            <h4>Teléfono</h4>
                            <a href="tel:+34900123456">
                                +34 900 123 456
                            </a>
                        </div>

                        <div className="contact-box">
                            <h4>Horario de Atención</h4>
                            <p>Lunes a Viernes: 09:00 - 18:00</p>
                            <p>Sábados: 10:00 - 14:00</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="footer-left">
                    <a href="#ig" className="circle-icon">IG</a>
                    <a href="#tw" className="circle-icon">TW</a>
                    <a href="#fb" className="circle-icon">FB</a>
                </div>

                <div className="footer-center">
                    <a href="/proveedores" className="proveedores-link">
                        ¿Quieres ser proveedor?
                    </a>
                </div>

                <div className="footer-right">
                    <div className="spotify-placeholder">
                        Música, API SPOTIFY
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Proveedores;
