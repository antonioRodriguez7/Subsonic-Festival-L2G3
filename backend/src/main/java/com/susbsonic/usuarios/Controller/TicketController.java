package com.susbsonic.usuarios.Controller;

import com.susbsonic.usuarios.Services.TicketService;
import com.susbsonic.usuarios.models.DTO.TicketDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import com.susbsonic.usuarios.Services.ImageService;

/**
 * Controlador REST para la gestión de Entradas (Tickets) del Subsonic Festival.
 * Define los endpoints (rutas) para que el frontend interactúe con los datos.
 * * NOTA DE SEGURIDAD: Los métodos POST, PUT y DELETE deberán ser protegidos
 * posteriormente con Spring Security para que solo el Administrador pueda usarlos.
 */
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final ImageService imageService;

    public TicketController(TicketService ticketService, ImageService imageService) {
        this.ticketService = ticketService;
        this.imageService = imageService;
    }

    // ==========================================
    // ENDPOINTS DE ADMINISTRACIÓN
    // ==========================================

    /**
     * Endpoint para crear una nueva entrada.
     */
    @PostMapping
    public ResponseEntity<TicketDTO> createTicket(
            @RequestParam String category,
            @RequestParam Double price,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer stock,
            @RequestParam(required = false) String feature,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            String imageUrl = "https://via.placeholder.com/300";
            if (image != null && !image.isEmpty()) {
                imageUrl = imageService.save(image);
            }

            TicketDTO dto = new TicketDTO();
            dto.setCategory(category);
            dto.setPrice(price);
            dto.setDescription(description);
            dto.setStock(stock);
            dto.setFeature(feature);
            dto.setImageUrl(imageUrl);

            TicketDTO createdTicket = ticketService.createTicket(dto);

            return ResponseEntity.status(201).body(createdTicket);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Endpoint para actualizar una entrada existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketDTO> updateTicket(@PathVariable Long id, @RequestBody TicketDTO dto) {
        try {
            return ResponseEntity.ok(ticketService.updateTicket(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para actualizar una entrada enviando un archivo nuevo.
     */
    @PutMapping("/{id}/withImage")
    public ResponseEntity<TicketDTO> updateTicketWithImage(
            @PathVariable Long id,
            @RequestParam String category,
            @RequestParam Double price,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer stock,
            @RequestParam(required = false) String feature,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            TicketDTO existingTicket = ticketService.getTicketById(id);
            
            existingTicket.setCategory(category);
            existingTicket.setPrice(price);
            existingTicket.setDescription(description);
            existingTicket.setStock(stock);
            existingTicket.setFeature(feature);

            if (image != null && !image.isEmpty()) {
                String imageUrl = imageService.save(image);
                existingTicket.setImageUrl(imageUrl);
            }

            return ResponseEntity.ok(ticketService.updateTicket(id, existingTicket));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Endpoint para eliminar una entrada.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        try {
            ticketService.deleteTicket(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==========================================
    // ENDPOINTS PÚBLICOS
    // ==========================================

    /**
     * Obtiene el listado completo de todas las entradas (con o sin stock).
     * Útil para que el Admin vea el catálogo completo.
     */
    @GetMapping("/all")
    public ResponseEntity<List<TicketDTO>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    /**
     * Obtiene solo las entradas que tienen stock disponible (> 0).
     * Este es el endpoint que usará la tienda pública para los clientes.
     */
    @GetMapping("/available")
    public ResponseEntity<List<TicketDTO>> getAvailableTickets() {
        return ResponseEntity.ok(ticketService.getAvailableTickets());
    }

    /**
     * Obtiene los detalles de una entrada específica por su ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO> getTicketById(@PathVariable Long id) {
        try {
            TicketDTO ticket = ticketService.getTicketById(id);
            return ResponseEntity.ok(ticket);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}