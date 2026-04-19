package com.susbsonic.usuarios.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Data Transfer Object (DTO) para la entidad Artista.
 * Se utiliza para enviar y recibir la información del cartel (Lineup)
 * entre el frontend y el backend de Subsonic Festival de forma limpia.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistDTO {

    private Long id;
    private String name;              // Nombre del artista o grupo
    private String genre;             // Género musical (ej. Rock, Electrónica)
    private LocalDate performanceDate;// Día de la actuación
    private Double cache;             // Caché o precio de contratación (gestión interna)
    private String spotifyUrl;        // Link de Spotify
    private String imageUrl;          // URL de la imagen del artista
    private String description;       // Biografía o descripción

}