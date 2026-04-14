package com.susbsonic.usuarios.Controller;

import com.susbsonic.usuarios.Services.BusinessServiceManager;
import com.susbsonic.usuarios.models.DTO.ProviderServiceDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ProviderServiceController {

    private final BusinessServiceManager serviceManager;

    @GetMapping
    public ResponseEntity<List<ProviderServiceDTO>> getAllServices() {
        return ResponseEntity.ok(serviceManager.getAllServices());
    }

    @PostMapping
    public ResponseEntity<ProviderServiceDTO> createService(@RequestBody ProviderServiceDTO dto) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;
        if (principal instanceof com.susbsonic.usuarios.models.DAO.User) {
            email = ((com.susbsonic.usuarios.models.DAO.User) principal).getEmail();
        } else {
            return ResponseEntity.status(401).build();
        }
        
        return ResponseEntity.ok(serviceManager.createService(dto, email));
    }

    @GetMapping("/provider")
    public ResponseEntity<List<ProviderServiceDTO>> getProviderServices() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;
        if (principal instanceof com.susbsonic.usuarios.models.DAO.User) {
            email = ((com.susbsonic.usuarios.models.DAO.User) principal).getEmail();
        } else {
            return ResponseEntity.status(401).build();
        }
        
        return ResponseEntity.ok(serviceManager.getServicesByProvider(email));
    }

    @PutMapping("/{serviceId}/space/{spaceId}")
    public ResponseEntity<ProviderServiceDTO> assignSpaceToService(@PathVariable Long serviceId, @PathVariable Long spaceId) {
        return ResponseEntity.ok(serviceManager.assignSpaceToService(serviceId, spaceId));
    }
}
