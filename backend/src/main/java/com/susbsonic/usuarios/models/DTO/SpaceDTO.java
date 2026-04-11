package com.susbsonic.usuarios.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para enviar y recibir los datos de los Espacios del festival.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpaceDTO {

    private Long id;
    private String name;
    private String type;
    private Double price;
    private Integer sizeSquareMeters;
    private Boolean isRented;

}