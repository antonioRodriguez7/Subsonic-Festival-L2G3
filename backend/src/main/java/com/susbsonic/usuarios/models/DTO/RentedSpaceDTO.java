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
public class RentedSpaceDTO {

    private Long id;
    private Long providerId;
    private Long spaceId;

    private String spaceName;
    private String spaceType;
    private Double spacePrice;
    private Integer spaceSizeSquareMeters;

    private LocalDateTime rentDate;
}
