package com.susbsonic.usuarios.Controller;

import com.susbsonic.usuarios.Services.TicketCompradoService;
import com.susbsonic.usuarios.models.DTO.TicketCompradoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class TicketCompradoController {

    private final TicketCompradoService purchaseService;

    public TicketCompradoController(TicketCompradoService purchaseService) {
        this.purchaseService = purchaseService;
    }

    /**
     * Endpoint para que un cliente compre una entrada.
     * En React, el cliente manda el ID de la entrada y cuántas quiere.
     */
    @PostMapping("/buy")
    public ResponseEntity<TicketCompradoDTO> buyTicket(
            @RequestBody TicketCompradoDTO dto,
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
            purchaseService.buyTicket(dto, username)
        );
    }

    /**
     * Endpoint para ver "Mis Entradas" (Historial de un usuario).
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketCompradoDTO>> getUserPurchases(@PathVariable Long userId) {
        return ResponseEntity.ok(purchaseService.getPurchasesByUser(userId));
    }

    /**
     * Endpoint para que el Admin vea absolutamente todas las ventas.
     */
    @GetMapping("/all")
    public ResponseEntity<List<TicketCompradoDTO>> getAllPurchases() {
        return ResponseEntity.ok(purchaseService.getAllPurchases());
    }
}