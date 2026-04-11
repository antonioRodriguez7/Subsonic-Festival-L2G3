package com.susbsonic.usuarios.models.DAO;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Entidad que representa a un Artista en el cartel de Subsonic Festival.
 * * A diferencia de los usuarios, los artistas no inician sesión en la plataforma.
 * Esta entidad sirve puramente como contenido informativo gestionado por los
 * administradores desde su panel de control para confeccionar el Lineup (Cartel).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "artists")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre artístico o nombre del grupo.
     */
    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Género musical o categoría del artista (ej. Techno, Indie, Rock).
     */
    @Column
    private String genre;

    /**
     * Fecha en la que el artista actuará en el festival.
     */
    @Column
    private LocalDate performanceDate;

    /**
     * Escenario asignado para la actuación.
     */
    @Column
    private String stage;

    /**
     * Caché o coste de contratación del artista (dato interno para el Admin).
     */
    @Column
    private Double cache;

    /**
     * Enlace al perfil de Spotify del artista para que los visitantes lo escuchen.
     */
    @Column
    private String spotifyUrl;

    /**
     * URL o ruta de la imagen promocional del artista para mostrar en la web.
     */
    @Column
    private String imageUrl;

    /**
     * Pequeña descripción o biografía del artista.
     */
    @Column(length = 1000)
    private String description;
}