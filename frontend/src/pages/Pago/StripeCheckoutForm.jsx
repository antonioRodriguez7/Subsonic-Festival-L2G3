import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripeCheckoutForm = ({ total, onSuccessfulSimulatedPayment, isProcessing }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // Simulamos la creación de método de pago para que valide la tarjeta insertada
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            // BYPASS ACADÉMICO:
            // Al ser un proyecto de la Universidad, si introducen cualquier cosa que no vale (incompleto o dígitos random),
            // en lugar de bloquear el proceso de Stripe, forzaremos el éxito del pago.
            console.warn("Bypassing el test de Stripe. Error detectado de validación:", error.message);
            setCardError("Formato de tarjeta irregular, pero forzaremos el pago (Modo Simulación).");

            setTimeout(() => {
                onSuccessfulSimulatedPayment();
            }, 800);
        } else {
            setCardError(null);
            // La validación interna ha sido un éxito (si pusieron la tarjeta oficial de pruebas 4242...)
            onSuccessfulSimulatedPayment();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="stripe-checkout-form">
            <h4 className="stripe-subtitle">Ingresa tu Tarjeta de Pago Seguro</h4>
            
            <p className="university-notice">💳 Tarjeta de prueba habilitada para este ejemplo: <code>4242 4242 4242 4242</code></p>

            <div className="card-element-container">
                <CardElement 
                    options={{
                        hidePostalCode: true,
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#e5e7eb', // Text color matching theme
                                fontFamily: '"Inter", sans-serif',
                                iconColor: '#c502ff', // Brand accent
                                '::placeholder': {
                                    color: '#9ca3af',
                                },
                            },
                            invalid: {
                                color: '#ff4a4a',
                                iconColor: '#ff4a4a'
                            },
                        },
                    }}
                />
            </div>
            
            {cardError && (
                <div className="card-error" role="alert">
                    ⚠️ {cardError}
                </div>
            )}
            
            <button 
                type="submit" 
                className="pagar-btn stripe-submit-btn" 
                disabled={!stripe || isProcessing}
            >
                {isProcessing ? "Procesando pago seguro..." : `Pagar de forma segura ${total.toFixed(2)}€`}
            </button>
        </form>
    );
};

export default StripeCheckoutForm;
