package com.susbsonic.usuarios.Services;

import com.susbsonic.usuarios.Repositories.ArtistRepository;
import com.susbsonic.usuarios.models.DAO.Artist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.*;
// Importa tu ArtistRepository y la entidad Artist

@Service
public class SpotifySyncService {

    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;

    @Value("${spotify.refresh.token}")
    private String refreshToken;

    @Value("${spotify.playlist.id}")
    private String playlistId;

    // Inyectar repositorio para hacer el "SELECT name, spotify_url FROM artists"
    @Autowired
    private ArtistRepository artistRepository;

    private final RestTemplate restTemplate = new RestTemplate();

// PASO 4: Método para obtener las Top Tracks de un artista usando su ID de Spotify
// Pide a Spotify las canciones de un ID concreto
    @SuppressWarnings("unchecked")
    private List<String> obtenerTopTracksDeArtista(String artistId, String accessToken) {
        List<String> urisCanciones = new ArrayList<>();

        // El endpoint de Spotify (usamos market=ES para España, cámbialo si tu público es de otro país)
        String url = "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?market=ES";

        // 1. Preparamos las cabeceras con el Token de autorización
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 2. Hacemos la petición GET a Spotify
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            // 3. Extraemos la lista de canciones ("tracks") del JSON de respuesta
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("tracks")) {
                List<Map<String, Object>> tracks = (List<Map<String, Object>>) body.get("tracks");

                // 4. Cogemos solo las 2 canciones más populares de este artista
                int limite = Math.min(2, tracks.size());
                for (int i = 0; i < limite; i++) {
                    String uri = (String) tracks.get(i).get("uri");
                    urisCanciones.add(uri);
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error obteniendo top tracks para el artista " + artistId + ": " + e.getMessage());
        }

        return urisCanciones;
    }

    //PASO 5: Método para sobrescribir la playlist con una lista de URIs de canciones
// Usa playlistId para borrar las canciones viejas y poner las nuevas
    private void sobrescribirPlaylist(List<String> todasLasUris, String accessToken) {
        String url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

        // 1. Cabeceras con el Token y el tipo de contenido JSON
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 2. Preparamos el cuerpo de la petición: {"uris": ["spotify:track:...", ...]}
        Map<String, Object> body = new HashMap<>();
        body.put("uris", todasLasUris);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            // 3. Hacemos la petición PUT a Spotify
            restTemplate.exchange(url, HttpMethod.PUT, entity, Void.class);
            System.out.println("✅ Se han añadido " + todasLasUris.size() + " canciones a la playlist.");
        } catch (Exception e) {
            System.err.println("❌ Error al sobrescribir la playlist: " + e.getMessage());
        }
    }


    /**
     * Este es el método principal que orquesta toda la lógica.
     */
    public void actualizarPlaylistDelFestival() {
        System.out.println("🚀 Iniciando sincronización de la Playlist Maestra...");

        try {



            // PASO 1: Renovar el Access Token usando el Refresh Token (Pendiente)
            String accessToken = obtenerNuevoAccessToken();

            // Si falló la obtención del token, abortamos para no dar errores más adelante
            if (accessToken == null) {
                System.err.println("❌ Proceso abortado: No se pudo obtener el Access Token.");
                return;
            }


            // PASO 2: Obtener todos los artistas de tu base de datos PostgreSQL
            List<Artist> artistas = artistRepository.findAll();

            List<String> listaTotalDeUris = new ArrayList<>();

            // PASO 3: Extraer los IDs de Spotify de sus URLs
            // Ejemplo: De "https://open.spotify.com/artist/12345" sacar "12345"
            System.out.println("📊 Extrayendo IDs de Spotify de " + artistas.size() + " artistas...");
            for (Artist artista : artistas) {
                String urlSpotify = artista.getSpotifyUrl();

                // Validamos que el artista realmente tenga una URL guardada
                if (urlSpotify != null && !urlSpotify.trim().isEmpty() && urlSpotify.contains("/artist/")) {

                    // Extraemos el ID oficial cortando la URL
                    String[] partes = urlSpotify.split("/artist/");
                    if (partes.length > 1) {
                        String artistId = partes[1].split("\\?")[0]; // Quitamos basura al final de la URL si la hay

                        System.out.println("🔍 Buscando top tracks para: " + artista.getName());

                        // PASO 4: Pedimos a Spotify las canciones de este ID
                        List<String> urisDelArtista = obtenerTopTracksDeArtista(artistId, accessToken);
                        listaTotalDeUris.addAll(urisDelArtista);
                    }
                } else {
                    System.out.println("⚠️ Saltando a " + artista.getName() + " (No tiene URL de Spotify válida)");
                }
            }

            // PASO 5: Sobrescribir la playlist con el límite de seguridad de 100
            if (!listaTotalDeUris.isEmpty()) {
                if (listaTotalDeUris.size() > 100) {
                    System.out.println("⚠️ Limitando la subida a 100 canciones (Límite de Spotify)");
                    listaTotalDeUris = listaTotalDeUris.subList(0, 100);
                }
                sobrescribirPlaylist(listaTotalDeUris, accessToken);
            } else {
                System.out.println("⚠️ No se encontraron canciones para añadir.");
            }

        } catch (Exception e) {
            System.err.println("❌ Error actualizando Spotify: " + e.getMessage());
        }

    }

    // Usa clientId, clientSecret y refreshToken para pedir el token temporal
    @SuppressWarnings("unchecked")
    private String obtenerNuevoAccessToken() {
        System.out.println("🔄 Solicitando un nuevo Access Token a Spotify...");

        String url = "https://accounts.spotify.com/api/token";

        // 1. Preparamos las cabeceras
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Spotify exige que el ID y el Secret vayan unidos y codificados en Base64
        String credenciales = clientId + ":" + clientSecret;
        String credencialesCodificadas = Base64.getEncoder().encodeToString(credenciales.getBytes());
        headers.set("Authorization", "Basic " + credencialesCodificadas);

        // 2. Preparamos el cuerpo de la petición (Form URL Encoded)
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("refresh_token", refreshToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            // 3. Hacemos la petición POST
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("access_token")) {
                System.out.println("✅ ¡Token renovado con éxito!");
                return (String) responseBody.get("access_token");
            }
        } catch (Exception e) {
            System.err.println("❌ Error crítico al renovar el token: " + e.getMessage());
        }

        // Si algo falla, devolvemos null
        return null;
    }
}