package com.susbsonic.usuarios.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketCompradoDTO {

    private Long id;
    private Long userId;       // El ID del cliente que compra
    private Long ticketId;     // El ID de la entrada que quiere
    private Integer cantidad;  // Cuántas entradas quiere
    private Double precioTotal; // El backend calculará esto
    private LocalDateTime comprasDate;
    private String category;
    private String imageUrl;

}