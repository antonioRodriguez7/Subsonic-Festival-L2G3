package com.susbsonic.usuarios.Services;

import com.susbsonic.usuarios.Repositories.ArtistRepository;
import com.susbsonic.usuarios.models.DAO.Artist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
// Importa tu ArtistRepository y la entidad Artist

@Service
public class SpotifySyncService {

    // TODO: LLENAR VARIABLES application.properties
    @Value("${spotify.client.id:TODO}")
    private String clientId;

    @Value("${spotify.client.secret:TODO}")
    private String clientSecret;

    @Value("${spotify.refresh.token:TODO}")
    private String refreshToken;

    @Value("${spotify.playlist.id:TODO}")
    private String playlistId;

    // Inyectar repositorio para hacer el "SELECT name, spotify_url FROM artists"
    @Autowired
    private ArtistRepository artistRepository;

    /**
     * Este es el método principal que orquesta toda la lógica.
     */
    public void actualizarPlaylistDelFestival() {
        System.out.println("🚀 Iniciando sincronización de la Playlist Maestra...");

        try {
            // PASO 1: Renovar el Access Token usando el Refresh Token (Pendiente)
            String accessToken = obtenerNuevoAccessToken();

            // PASO 2: Obtener todos los artistas de tu base de datos PostgreSQL
            List<Artist> artistas = artistRepository.findAll();

            // PASO 3: Extraer los IDs de Spotify de sus URLs
            // Ejemplo: De "https://open.spotify.com/artist/12345" sacar "12345"
            System.out.println("📊 Extrayendo IDs de Spotify de " + artistas.size() + " artistas...");
            for (Artist artista : artistas) {
                if (artista.getSpotifyUrl() != null && !artista.getSpotifyUrl().isEmpty()) {
                    String spotifyId = artista.getSpotifyUrl().substring(artista.getSpotifyUrl().lastIndexOf("/") + 1);
                    System.out.println("   🎤 " + artista.getName() + " → ID: " + spotifyId);
                } else {
                    System.out.println("   ⚠️ " + artista.getName() + " → Sin URL de Spotify");
                }
            }

            // PASO 4: Pedirle a Spotify las Top Tracks de cada ID

            // PASO 5: Cargar las canciones en la Playlist con una petición PUT

            System.out.println("✅ Playlist actualizada con éxito");

        } catch (Exception e) {
            System.err.println("❌ Error actualizando Spotify: " + e.getMessage());
        }
    }

    private String obtenerNuevoAccessToken() {
        // Aquí programaremos la llamada a la API de Spotify para refrescar el token
        return "token_simulado_por_ahora";
    }
}