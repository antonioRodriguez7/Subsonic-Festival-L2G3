package com.susbsonic.usuarios.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) para la entidad Ticket (Entrada).
 * * Este objeto se utiliza para transferir los datos de las entradas entre el
 * frontend (React) y el backend de forma segura, evitando exponer directamente
 * la entidad de la base de datos.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketDTO {

    private Long id;
    private String category;
    private String description;
    private Double price;
    private String feature;
    private String imageUrl;
    private Integer stock;

}
