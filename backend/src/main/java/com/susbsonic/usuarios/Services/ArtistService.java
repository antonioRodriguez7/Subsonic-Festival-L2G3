package com.susbsonic.usuarios.Services;

import com.susbsonic.usuarios.models.DAO.Artist;
import com.susbsonic.usuarios.models.DTO.ArtistDTO;
import com.susbsonic.usuarios.Repositories.ArtistRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio encargado de gestionar los artistas del cartel de Subsonic Festival.
 * Proporciona métodos CRUD para ser utilizados desde el panel de Administración
 * y para mostrar el Lineup al público.
 */
@Service
public class ArtistService {

    private final ArtistRepository artistRepository;

    public ArtistService(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    // ==========================================
    // MÉTODOS DE MAPEO (Entity <-> DTO)
    // ==========================================

    private ArtistDTO mapToDTO(Artist artist) {
        return ArtistDTO.builder()
                .id(artist.getId())
                .name(artist.getName())
                .genre(artist.getGenre())
                .performanceDate(artist.getPerformanceDate())
                .stage(artist.getStage())
                .cache(artist.getCache())
                .spotifyUrl(artist.getSpotifyUrl())
                .imageUrl(artist.getImageUrl())
                .description(artist.getDescription())
                .build();
    }

    private Artist mapToEntity(ArtistDTO dto) {
        return Artist.builder()
                .name(dto.getName())
                .genre(dto.getGenre())
                .performanceDate(dto.getPerformanceDate())
                .stage(dto.getStage())
                .cache(dto.getCache())
                .spotifyUrl(dto.getSpotifyUrl())
                .imageUrl(dto.getImageUrl())
                .description(dto.getDescription())
                .build();
    }

    // ==========================================
    // OPERACIONES CRUD
    // ==========================================

    /**
     * Crea un nuevo artista en el cartel.
     */
    public ArtistDTO createArtist(ArtistDTO dto) {
        Artist artist = mapToEntity(dto);
        Artist savedArtist = artistRepository.save(artist);
        return mapToDTO(savedArtist);
    }

    /**
     * Obtiene un artista por su ID.
     */
    public ArtistDTO getArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artista no encontrado con ID: " + id));
        return mapToDTO(artist);
    }

    /**
     * Obtiene la lista completa de artistas para el cartel.
     */
    public List<ArtistDTO> getAllArtists() {
        return artistRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca artistas cuyo nombre contenga la cadena proporcionada.
     */
    public List<ArtistDTO> getArtistsByName(String name) {
        return artistRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Actualiza los datos de un artista existente.
     */
    public ArtistDTO updateArtist(Long id, ArtistDTO updatedDto) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artista no encontrado con ID: " + id));

        // Actualizamos solo los campos permitidos
        artist.setName(updatedDto.getName());
        artist.setGenre(updatedDto.getGenre());
        artist.setPerformanceDate(updatedDto.getPerformanceDate());
        artist.setStage(updatedDto.getStage());
        artist.setCache(updatedDto.getCache());
        artist.setSpotifyUrl(updatedDto.getSpotifyUrl());
        // Solo actualizamos imageUrl si se proporciona un valor (evita sobreescribir con null)
        if (updatedDto.getImageUrl() != null && !updatedDto.getImageUrl().isBlank()) {
            artist.setImageUrl(updatedDto.getImageUrl());
        }
        artist.setDescription(updatedDto.getDescription());

        Artist savedArtist = artistRepository.save(artist);
        return mapToDTO(savedArtist);
    }

    /**
     * Elimina a un artista del cartel.
     */
    public void deleteArtist(Long id) {
        if (!artistRepository.existsById(id)) {
            throw new RuntimeException("Artista no encontrado con ID: " + id);
        }
        artistRepository.deleteById(id);
    }
}