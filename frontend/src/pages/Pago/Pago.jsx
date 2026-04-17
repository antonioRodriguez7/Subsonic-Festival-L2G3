import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Pago.css";
import { generarEntradaPDF, generarFacturaPDF } from "../../services/pdf";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { buyTicket, sendPdfEmail, sendInvoiceEmail } from "../../services/realBackend";

function Pago() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [metodo, setMetodo] = useState("");
    const [loading, setLoading] = useState(false);

    const pedido = state?.pedido || [];
    const total = state?.total || 0;

    const simularPago = (metodo) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    status: "success",
                    metodo
                });
            }, 1500);
        });
    };

    const handlePagar = async () => {
        if (!metodo) {
            alert("Selecciona un método de pago");
            return;
        }

        setLoading(true);

        const pago = await simularPago(metodo);

        if (pago.status === "success") {
            try {
                for (const item of pedido) {
                    await buyTicket(item.id, item.cantidad);
                }

                // Generar y Enviar Factura
                const facturaBlob = await generarFacturaPDF(pedido, total);
                try {
                    await sendInvoiceEmail(facturaBlob);
                } catch (e) {
                    console.error("Error enviando factura:", e);
                }

                // Generar y Enviar Entradas
                const ticketsBlob = await generarEntradaPDF(pedido);
                try {
                    await sendPdfEmail(ticketsBlob);
                } catch (e) {
                    console.error("Error enviando entradas:", e);
                }

                alert("Pago realizado correctamente. Recibirás tu factura y tus entradas en tu correo.");
                navigate("/perfil");

            } catch (e) {
                console.error(e);
                alert("Error al procesar la compra");
            }
        }

        setLoading(false);
    };
    return (
        <div className="pago-container">
            <Header />

            {/* CONTENIDO CENTRAL */}
            <div className="pago-content">

                <div className="pago-card">

                    <h2 className="pago-title">Resumen del pedido</h2>

                    {/* LISTA DE ENTRADAS */}
                    <div className="pedido-lista">
                        {pedido.map(item => (
                            <div key={item.id} className="pedido-item">
                                <div className="item-info">
                                    <span className="item-nombre">{item.nombre}</span>
                                    <span className="item-cantidad">
                                        {item.cantidad} x {item.precio}€
                                    </span>
                                </div>

                                <div className="item-subtotal">
                                    {(item.cantidad * item.precio).toFixed(2)}€
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TOTAL */}
                    <div className="total">
                        <span>Total</span>
                        <span>{total.toFixed(2)}€</span>
                    </div>

                    {/* SEPARADOR */}
                    <div className="divider"></div>

                    {/* MÉTODOS DE PAGO */}
                    <div className="metodos">
                        <h3 className="metodos-title">Método de pago</h3>

                        <div className="metodos-buttons">
                            <button
                                className={`metodo-btn stripe ${metodo === "stripe" ? "active" : ""}`}
                                onClick={() => setMetodo("stripe")}
                            >
                                Stripe
                            </button>

                            <button
                                className={`metodo-btn paypal ${metodo === "paypal" ? "active" : ""}`}
                                onClick={() => setMetodo("paypal")}
                            >
                                PayPal
                            </button>

                            <button
                                className={`metodo-btn bizum ${metodo === "bizum" ? "active" : ""}`}
                                onClick={() => setMetodo("bizum")}
                            >
                                Bizum
                            </button>
                        </div>
                    </div>

                    {/* INFO EXTRA SEGÚN MÉTODO */}
                    {metodo === "paypal" && (
                        <p className="metodo-info">
                            Serás redirigido a PayPal para completar el pago.
                        </p>
                    )}

                    {metodo === "stripe" && (
                        <p className="metodo-info">
                            Pago seguro simulado con Stripe.
                        </p>
                    )}

                    {metodo === "bizum" && (
                        <p className="metodo-info">
                            Pago rápido mediante Bizum (simulado).
                        </p>
                    )}

                    {/* BOTÓN PAGAR */}
                    <button
                        className="pagar-btn"
                        onClick={handlePagar}
                        disabled={loading || !metodo}
                    >
                        {loading ? "Procesando..." : `Pagar ${total.toFixed(2)}€`}
                    </button>

                    {/* TEXTO LOADING */}
                    {loading && (
                        <p className="loading-text">
                            Procesando pago...
                        </p>
                    )}

                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Pago;