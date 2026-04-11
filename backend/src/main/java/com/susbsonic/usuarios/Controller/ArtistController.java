package com.susbsonic.usuarios.Controller;

import com.susbsonic.usuarios.Services.ArtistService;
import com.susbsonic.usuarios.models.DTO.ArtistDTO; // Asumo que crearéis este DTO
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de artistas del cartel de Subsonic Festival.
 * Los endpoints de modificación deben estar protegidos para uso exclusivo del Administrador.
 */
@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    // ----------------- CREATE -----------------

    /**
     * Añade un nuevo artista al cartel.
     * Idealmente, esto debe tener @PreAuthorize("hasRole('ROLE_ADMIN')")
     */
    @PostMapping
    public ResponseEntity<ArtistDTO> createArtist(@RequestBody ArtistDTO dto) {
        try {
            ArtistDTO createdArtist = artistService.createArtist(dto);
            return ResponseEntity.status(201).body(createdArtist);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ----------------- READ (Públicos) -----------------

    /**
     * Obtiene un artista por su ID. Útil para ver el detalle de un artista.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArtistDTO> getArtistById(@PathVariable Long id) {
        try {
            ArtistDTO artist = artistService.getArtistById(id);
            return ResponseEntity.ok(artist);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtiene todos los artistas. Útil para pintar la vista del Cartel (Lineup).
     */
    @GetMapping("/all")
    public ResponseEntity<List<ArtistDTO>> getAllArtists() {
        return ResponseEntity.ok(artistService.getAllArtists());
    }

    /**
     * Busca artistas por nombre.
     */
    @GetMapping("/search")
    public ResponseEntity<List<ArtistDTO>> getArtistsByName(@RequestParam String name) {
        return ResponseEntity.ok(artistService.getArtistsByName(name));
    }

    // ----------------- UPDATE -----------------

    /**
     * Actualiza los datos de un artista existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ArtistDTO> updateArtist(@PathVariable Long id, @RequestBody ArtistDTO dto) {
        try {
            return ResponseEntity.ok(artistService.updateArtist(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ----------------- DELETE -----------------

    /**
     * Elimina un artista del cartel por su ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable Long id) {
        try {
            artistService.deleteArtist(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}