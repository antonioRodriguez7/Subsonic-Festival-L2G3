package com.susbsonic.usuarios.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que el servidor devuelve al frontend cuando un usuario hace Login o se Registra con éxito.
 * Contiene el token y un mensaje descriptivo de la operación.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {

    private Long id;
    private String token;
    private String role;
    private String message;

}