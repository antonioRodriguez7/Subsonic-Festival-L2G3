package com.susbsonic.usuarios.Controller;

import com.susbsonic.usuarios.Services.SpaceService;
import com.susbsonic.usuarios.models.DTO.RentedSpaceDTO;
import com.susbsonic.usuarios.models.DTO.SpaceDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de los Espacios del recinto.
 */
@RestController
@RequestMapping("/api/spaces")
public class SpaceController {

    private final SpaceService spaceService;

    public SpaceController(SpaceService spaceService) {
        this.spaceService = spaceService;
    }

    // --- Endpoints de Administración ---

    @PostMapping
    public ResponseEntity<SpaceDTO> createSpace(@RequestBody SpaceDTO dto) {
        try {
            return ResponseEntity.status(201).body(spaceService.createSpace(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpaceDTO> updateSpace(@PathVariable Long id, @RequestBody SpaceDTO dto) {
        try {
            return ResponseEntity.ok(spaceService.updateSpace(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpace(@PathVariable Long id) {
        try {
            spaceService.deleteSpace(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Endpoints Públicos ---

    @GetMapping("/all")
    public ResponseEntity<List<SpaceDTO>> getAllSpaces() {
        return ResponseEntity.ok(spaceService.getAllSpaces());
    }

    @GetMapping("/available")
    public ResponseEntity<List<SpaceDTO>> getAvailableSpaces() {
        return ResponseEntity.ok(spaceService.getAvailableSpaces());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpaceDTO> getSpaceById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(spaceService.getSpaceById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Endpoints de Proveedor (requieren JWT) ---

    /**
     * Alquila un espacio. El proveedor se identifica automáticamente desde el JWT.
     * Crea una fila en la tabla auxiliar 'espacios_alquilados' y marca isRented = true.
     * Devuelve el registro de alquiler creado.
     */
    @PutMapping("/{id}/rent")
    public ResponseEntity<RentedSpaceDTO> rentSpace(@PathVariable Long id) {
        String identifier = SecurityContextHolder.getContext().getAuthentication().getName();
        if (identifier == null || identifier.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
        try {
            return ResponseEntity.ok(spaceService.rentSpace(id, identifier));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cancela el alquiler de un espacio.
     */
    @DeleteMapping("/{id}/unrent")
    public ResponseEntity<Void> unrentSpace(@PathVariable Long id) {
        String identifier = SecurityContextHolder.getContext().getAuthentication().getName();
        if (identifier == null || identifier.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
        try {
            spaceService.unrentSpace(id, identifier);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Devuelve los alquileres del proveedor autenticado, con los datos de cada espacio incluidos.
     * El frontend lo usa para mostrar "Mis Espacios Contratados".
     */
    @GetMapping("/my-rented")
    public ResponseEntity<List<RentedSpaceDTO>> getMyRentedSpaces() {
        String identifier = SecurityContextHolder.getContext().getAuthentication().getName();
        if (identifier == null || identifier.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(spaceService.getMyRentedSpaces(identifier));
    }
}