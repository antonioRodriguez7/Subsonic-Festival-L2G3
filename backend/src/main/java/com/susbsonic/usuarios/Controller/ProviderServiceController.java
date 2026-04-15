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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || email.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(serviceManager.createService(dto, email));
    }

    @GetMapping("/provider")
    public ResponseEntity<List<ProviderServiceDTO>> getProviderServices() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || email.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(serviceManager.getServicesByProvider(email));
    }

    @PutMapping("/{serviceId}/space/{spaceId}")
    public ResponseEntity<ProviderServiceDTO> assignSpaceToService(@PathVariable Long serviceId, @PathVariable Long spaceId) {
        return ResponseEntity.ok(serviceManager.assignSpaceToService(serviceId, spaceId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProviderServiceDTO> updateService(@PathVariable Long id, @RequestBody ProviderServiceDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || email.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
        
        try {
            return ResponseEntity.ok(serviceManager.updateService(id, dto, email));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || email.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        try {
            serviceManager.deleteService(id, email);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }
}
