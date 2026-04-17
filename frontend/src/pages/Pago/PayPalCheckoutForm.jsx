import React, { useState } from 'react';

const PayPalCheckoutForm = ({ total, onSuccessfulSimulatedPayment }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayPalSimulatedClick = () => {
        setIsProcessing(true);

        // Simulamos la apertura y carga del entorno web de Paypal (que en realidad no es necesario para los profes)
        setTimeout(() => {
            onSuccessfulSimulatedPayment();
        }, 2200);
    };

    return (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <p className="university-notice" style={{ marginBottom: '20px', borderColor: '#003087' }}>
                 Modo Simulación Activo: Conectando de forma segura (sin necesidad de loguearse).
            </p>

            {!isProcessing ? (
                <button 
                    onClick={handlePayPalSimulatedClick} 
                    style={{
                        backgroundColor: '#ffc439',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '12px 24px',
                        width: '100%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'background-color 0.2s ease',
                        color: '#003087',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        fontStyle: 'italic',
                        fontFamily: 'sans-serif'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f4bb33'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffc439'}
                >
                    {/* Logotipo de Paypal simplificado o simulado textualmente */}
                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#003087' }}>Pay</span><span style={{ fontSize: '20px', fontWeight: '900', color: '#0079C1' }}>Pal</span> 
                </button>
            ) : (
                 <div className="paypal-waiting-container" style={{ padding: '20px', animation: 'fadeIn 0.3s ease-in' }}>
                    <div style={{ 
                        width: '40px', height: '40px', 
                        border: '4px solid rgba(0,48,135,0.2)', 
                        borderTop: '4px solid #003087', 
                        borderRadius: '50%', 
                        margin: '0 auto 15px auto', 
                        animation: 'bizumRotar 1s linear infinite' 
                    }}></div>
                    <span style={{ color: '#e5e7eb', fontSize: '15px' }}>Conectando con un servidor seguro de PayPal...</span>
                 </div>
            )}
        </div>
    );
};

export default PayPalCheckoutForm;
