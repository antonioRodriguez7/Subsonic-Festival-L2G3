package com.susbsonic.usuarios.Controller;

import com.susbsonic.usuarios.Services.SpotifySyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/spotify")
public class SpotifyController {

    private final SpotifySyncService spotifySyncService;

    // Inyección de dependencias
    public SpotifyController(SpotifySyncService spotifySyncService) {
        this.spotifySyncService = spotifySyncService;
    }

    // Este es el endpoint que React va a golpear al hacer clic en el botón
    @PostMapping("/sync")
    public ResponseEntity<Map<String, String>> sincronizarPlaylist() {

        // Llamamos al método que creamos en el servicio
        spotifySyncService.actualizarPlaylistDelFestival();

        // Devolvemos un mensaje de éxito al frontend
        return ResponseEntity.ok(Map.of("mensaje", "Sincronización ejecutada correctamente en el servidor"));
    }
}