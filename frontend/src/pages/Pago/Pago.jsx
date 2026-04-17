import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Pago.css";
import { generarEntradaPDF, generarFacturaPDF } from "../../services/pdf";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { buyTicket, sendPdfEmail, sendInvoiceEmail } from "../../services/realBackend";

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';
import PayPalCheckoutForm from './PayPalCheckoutForm';
import BizumCheckoutForm from './BizumCheckoutForm';

// Clave pública oficial de test (sandbox) genérica de la documentación oficial de Stripe. (No requiere cuenta real para funcionar su GUI)
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

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

    // Función que llama el componente hijo de Stripe cuando valida la tarjeta satisfactoriamente
    const processStripeSimulatedPayment = async () => {
        setMetodo("stripe");
        await handlePagar();
    };

    // Función que llama el componente hijo de Paypal
    const processPaypalSimulatedPayment = async () => {
        setMetodo("paypal");
        await handlePagar();
    };

    // Función que llama el componente hijo de Bizum
    const processBizumSimulatedPayment = async () => {
        setMetodo("bizum");
        await handlePagar();
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
                        <div className="metodo-info paypal-info-box">
                             <PayPalCheckoutForm 
                                total={total}
                                onSuccessfulSimulatedPayment={processPaypalSimulatedPayment}
                             />
                        </div>
                    )}

                    {metodo === "stripe" && (
                        <div className="metodo-info stripe-info-box">
                            <p>Pago validado y seguro mediante **Stripe Elements** (Simulado)</p>
                            <Elements stripe={stripePromise}>
                                <StripeCheckoutForm 
                                    total={total} 
                                    onSuccessfulSimulatedPayment={processStripeSimulatedPayment}
                                    isProcessing={loading} 
                                />
                            </Elements>
                        </div>
                    )}

                    {metodo === "bizum" && (
                        <div className="metodo-info bizum-info-box">
                             <BizumCheckoutForm 
                                total={total}
                                onSuccessfulSimulatedPayment={processBizumSimulatedPayment}
                             />
                        </div>
                    )}

                    {/* BOTÓN PAGAR GENERAL (Queda deprecado para estos 3 porque usamos sus propios formularios, pero sirve si metes más métodos en el futuro) */}
                    {(metodo !== "stripe" && metodo !== "paypal" && metodo !== "bizum") && (
                        <button
                            className="pagar-btn"
                            onClick={handlePagar}
                            disabled={loading || !metodo}
                        >
                            {loading ? "Procesando..." : `Pagar ${total.toFixed(2)}€`}
                        </button>
                    )}

                    {/* TEXTO LOADING */}
                    {loading && (
                        <p className="loading-text">
                            Procesando en curso, por favor no cierres la ventana...
                        </p>
                    )}

                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Pago;