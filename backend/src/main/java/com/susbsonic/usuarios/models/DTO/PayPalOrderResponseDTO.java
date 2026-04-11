package com.susbsonic.usuarios.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PayPalOrderResponseDTO {
    private String approvalUrl;
}