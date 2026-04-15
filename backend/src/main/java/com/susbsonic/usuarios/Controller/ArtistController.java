package com.susbsonic.usuarios.Controller;

import com.susbsonic.usuarios.Services.ArtistService;
import com.susbsonic.usuarios.Services.ImageService;
import com.susbsonic.usuarios.models.DTO.ArtistDTO; // Asumo que crearéis este DTO
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;

import java.util.List;

/**
 * Controlador REST para la gestión de artistas del cartel de Subsonic Festival.
 * Los endpoints de modificación deben estar protegidos para uso exclusivo del Administrador.
 */
@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    private final ArtistService artistService;
    private final ImageService imageService;

    public ArtistController(ArtistService artistService, ImageService imageService) {
        this.artistService = artistService;
        this.imageService = imageService;
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

    @PostMapping("/withImage")
    public ResponseEntity<ArtistDTO> createArtistWithImage(
            @RequestParam String name,
            @RequestParam(required = false) String spotifyUrl,
            @RequestParam(required = false) String performanceDate,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            String imageUrl = "https://via.placeholder.com/300";
            if (image != null && !image.isEmpty()) {
                imageUrl = imageService.save(image);
            }

            LocalDate parsedDate = null;
            if (performanceDate != null && !performanceDate.trim().isEmpty()) {
                parsedDate = LocalDate.parse(performanceDate.trim());
            }

            ArtistDTO dto = new ArtistDTO();
            dto.setName(name);
            dto.setSpotifyUrl(spotifyUrl);
            dto.setPerformanceDate(parsedDate);
            dto.setGenre(genre);
            dto.setStage(stage);
            dto.setDescription(description);
            dto.setImageUrl(imageUrl);

            ArtistDTO createdArtist = artistService.createArtist(dto);
            return ResponseEntity.status(201).body(createdArtist);
        } catch (Exception e) {
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

    @PutMapping("/{id}/withImage")
    public ResponseEntity<ArtistDTO> updateArtistWithImage(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String spotifyUrl,
            @RequestParam(required = false) String performanceDate,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            ArtistDTO existing = artistService.getArtistById(id);
            String imageUrl = existing.getImageUrl();
            if (image != null && !image.isEmpty()) {
                imageUrl = imageService.save(image);
            }

            LocalDate parsedDate = null;
            if (performanceDate != null && !performanceDate.trim().isEmpty()) {
                parsedDate = LocalDate.parse(performanceDate.trim());
            }

            ArtistDTO dto = new ArtistDTO();
            dto.setName(name);
            dto.setSpotifyUrl(spotifyUrl);
            dto.setPerformanceDate(parsedDate);
            dto.setGenre(genre);
            dto.setStage(stage);
            dto.setDescription(description);
            dto.setImageUrl(imageUrl);

            return ResponseEntity.ok(artistService.updateArtist(id, dto));
        } catch (Exception e) {
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