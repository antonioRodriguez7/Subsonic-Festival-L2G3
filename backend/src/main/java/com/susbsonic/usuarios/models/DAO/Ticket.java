package com.susbsonic.usuarios.models.DAO;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad que representa una Entrada (Ticket) para el Subsonic Festival.
 * * Esta clase mapea la tabla "tickets" en la base de datos. Contiene toda la
 * información necesaria que el Administrador configura desde su panel y que
 * luego los clientes verán a la hora de realizar una compra.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tickets")
public class Ticket {

    /**
     * Identificador único de la entrada en la base de datos.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Categoría o nombre de la entrada (Ej. "Abono General", "Pase VIP 3 Días").
     */
    @Column(nullable = false)
    private String category;

    /**
     * Descripción detallada de lo que incluye la entrada.
     */
    @Column(length = 1000)
    private String description;

    /**
     * Precio de la entrada en euros.
     */
    @Column(nullable = false)
    private Double price;

    /**
     * Característica principal o etiqueta destacada (Ej. "Acceso Prioritario", "Incluye acampada").
     */
    @Column
    private String feature;

    /**
     * URL de la imagen promocional de la entrada para mostrar en la web.
     */
    @Column
    private String imageUrl;

    /**
     * Cantidad de entradas disponibles para la venta (Stock).
     * Aunque no salía explícitamente en el boceto, es vital para evitar sobreventas.
     */
    @Column(nullable = false)
    private Integer stock;
}