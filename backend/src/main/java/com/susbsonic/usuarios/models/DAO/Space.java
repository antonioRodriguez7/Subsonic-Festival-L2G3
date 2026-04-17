package com.susbsonic.usuarios.models.DAO;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad que representa un Espacio físico alquilable dentro del recinto del festival.
 * Puede ser una zona para un Foodtruck, una carpa de merchandising o una barra de bebidas.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "spaces")
public class Space {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre identificativo del espacio (Ej. "Parcela A1 - Zona Norte").
     */
    @Column(nullable = false)
    private String name;

    /**
     * Tipo de negocio permitido en este espacio (Ej. "Foodtruck", "Merchandising", "Bebida").
     */
    @Column(nullable = false)
    private String type;

    /**
     * Precio del alquiler del espacio para todos los días del festival.
     */
    @Column(nullable = false)
    private Double price;

    /**
     * Tamaño del espacio en metros cuadrados.
     */
    @Column(nullable = false)
    private Integer sizeSquareMeters;

    /**
     * Estado del espacio: true si ya ha sido alquilado por un proveedor, false si está libre.
     */
    @Column(nullable = false)
    private Boolean isRented;
}

