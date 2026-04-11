import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Registro from "./pages/Registro/Registro";
import Perfil from "./pages/Perfil/Perfil";
import Perfil_Admin from "./pages/Perfil_Admin/Perfil_Admin";
import Perfil_Proveedor from "./pages/Perfil_Proveedor/Perfil_Proveedor";
import Cartel from "./pages/Cartel/Cartel";
import Entradas from "./pages/Entradas/Entradas";
import Servicios from "./pages/Servicios/Servicios";
import Proveedores from "./pages/Proveedores/Proveedores";
import PreguntasFrecuentes from "./pages/FAQS/PreguntasFrecuentes";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad/PoliticaPrivacidad";
import Pago from "./pages/Pago/Pago";

function App() {
    const [user, setUser] = useState(null);

    // 1. EFECTO DE PERSISTENCIA: Al cargar la App, miramos si hay sesión guardada
    useEffect(() => {
        const token = localStorage.getItem('subsonic_token');
        const role = localStorage.getItem('user_role');
        const email = localStorage.getItem('user_email');

        if (token && role) {
            setUser({ token, role, email });
        }
    }, []);

    // 2. FUNCIÓN PARA CERRAR SESIÓN
    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        window.location.href = "/"; // Reinicia al Home limpio
    };

    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/registro" element={<Registro />} />

                {/* RUTAS DE PERFIL SEGÚN ROL */}
                <Route path="/perfil" element={<Perfil user={user} onLogout={handleLogout} />} />
                <Route path="/perfil-admin" element={<Perfil_Admin user={user} onLogout={handleLogout} />} />
                <Route path="/perfil-proveedor" element={<Perfil_Proveedor user={user} onLogout={handleLogout} />} />

                <Route path="/cartel" element={<Cartel />} />
                <Route path="/entradas" element={<Entradas />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/proveedores" element={<Proveedores />} />
                <Route path="/faq" element={<PreguntasFrecuentes />} />
                <Route path="/politica" element={<PoliticaPrivacidad />} />
                <Route path="/pago" element={<Pago />} />
            </Routes>
        </>
    );
}

export default App;