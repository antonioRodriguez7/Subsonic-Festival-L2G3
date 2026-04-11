import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const dropdownRef = useRef(null);

    // Recuperamos los datos de sesión del localStorage
    const token = localStorage.getItem('subsonic_token');
    const userRole = localStorage.getItem('user_role');

    const goTo = (path) => {
        setOpenMenu(null);
        navigate(path);
    };

    // --- FUNCIÓN DE PERFIL UNIFICADA ---
    const handleProfileClick = () => {
        if (!token) {
            navigate("/login");
            return;
        }

        // Siempre mandamos a /perfil primero
        navigate('/perfil');
    };

    const toggleMenu = (menuName) => {
        setOpenMenu((prev) => (prev === menuName ? null : menuName));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };

        const handleScroll = () => {
            if (window.scrollY <= 10) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`subsonic-header-wrap ${isVisible ? "is-visible" : "is-hidden"}`}
            ref={dropdownRef}
        >
            <div className="subsonic-header">
                <div className="subsonic-brand" onClick={() => goTo("/")}>
                    SUBSONIC
                </div>

                <nav className="subsonic-nav">
                    <button type="button" className="subsonic-pill-btn" onClick={() => goTo("/entradas")}>
                        Entradas
                    </button>

                    <button type="button" className="subsonic-nav-link" onClick={() => goTo("/cartel")}>
                        CARTEL
                    </button>

                    <button type="button" className="subsonic-nav-link" onClick={() => goTo("/servicios")}>
                        SERVICIOS
                    </button>

                    <div className="subsonic-dropdown">
                        <button type="button" className="subsonic-nav-link" onClick={() => toggleMenu("info")}>
                            INFO <span>▾</span>
                        </button>

                        {openMenu === "info" && (
                            <div className="subsonic-dropdown-menu">
                                <button type="button" onClick={() => goTo("/faq")}>Preguntas frecuentes</button>
                                <button type="button" onClick={() => goTo("/politica")}>Política y privacidad</button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* BOTÓN DINÁMICO: Si hay token, mostramos Perfil; si no, Acceder */}
                {token ? (
                    <button
                        type="button"
                        className="subsonic-login-btn profile-active"
                        onClick={handleProfileClick}
                    >
                        Mi Perfil
                    </button>
                ) : (
                    <button
                        type="button"
                        className="subsonic-login-btn"
                        onClick={() => goTo("/login")}
                    >
                        Acceder / Registro
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;