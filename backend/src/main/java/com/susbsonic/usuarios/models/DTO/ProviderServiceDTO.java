package com.susbsonic.usuarios.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderServiceDTO {
    private Long id;
    private String nombre;
    private String tipo;
    private String descripcion;
    private String fechas;
    private String imagenUrl;
    private Long providerId;
    private Long spaceId;
}
