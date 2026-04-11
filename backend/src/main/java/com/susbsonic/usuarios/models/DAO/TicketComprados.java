package com.susbsonic.usuarios.models.DAO;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad que registra la compra de entradas por parte de un usuario.
 * Conecta al Usuario (cliente) con la Entrada (Ticket) que ha comprado.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TicketComprado")
public class TicketComprados {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: Muchos "Tickets" pueden ser comprados por un "Usuario"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Relación: La entrada específica que se está comprando
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    /**
     * Cantidad de entradas compradas en esta transacción.
     */
    @Column(nullable = false)
    private Integer quantity;

    /**
     * Precio total pagado (Se calcula multiplicando quantity * ticket.price).
     */
    @Column(nullable = false)
    private Double totalPrice;

    /**
     * Fecha y hora exacta en la que se realizó la compra.
     */
    @Column(nullable = false)
    private LocalDateTime purchaseDate;
}