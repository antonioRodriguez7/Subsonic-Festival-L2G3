import React, { useState } from 'react';

const BizumCheckoutForm = ({ total, onSuccessfulSimulatedPayment }) => {
    const [phone, setPhone] = useState("");
    const [isWaiting, setIsWaiting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (phone.length < 9) {
            alert("Por favor, introduce un número válido de 9 cifras para la demostración.");
            return;
        }

        setIsWaiting(true);

        // Simulamos el tiempo para "aceptar en la app del banco" de Bizum
        setTimeout(() => {
            onSuccessfulSimulatedPayment();
        }, 3500);
    };

    return (
        <div className="bizum-checkout-form">
            {!isWaiting ? (
                <>
                    <h4 className="stripe-subtitle" style={{ marginBottom: '15px' }}>Pago con Bizum</h4>
                    <p className="university-notice" style={{ marginBottom: '15px', borderColor: '#00a082' }}>
                        📱 Modo Simulación: Introduce cualquier número de 9 cifras para proceder.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="card-element-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '18px' }}>🇪🇸 +34</span>
                            <input 
                                type="tel" 
                                className="bizum-input"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Solo números
                                placeholder="6XX XXX XXX"
                                maxLength={9}
                                required
                            />
                        </div>
                        <button type="submit" className="pagar-btn bizum-submit-btn">
                            Enviar petición Bizum por {total.toFixed(2)}€
                        </button>
                    </form>
                </>
            ) : (
                <div className="bizum-waiting-container">
                    <div className="bizum-spinner"></div>
                    <h4>¡Petición enviada!</h4>
                    <p style={{ marginTop: '10px', fontSize: '14px', color: '#aab2cd' }}>
                        Entra en la app de tu banco y confirma el pago por <strong>{total.toFixed(2)}€</strong>...
                    </p>
                </div>
            )}
        </div>
    );
};

export default BizumCheckoutForm;
