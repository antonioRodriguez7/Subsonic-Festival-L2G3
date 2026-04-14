package com.susbsonic.usuarios.Services;

import com.susbsonic.usuarios.Repositories.ProviderServiceRepository;
import com.susbsonic.usuarios.Repositories.SpaceRepository;
import com.susbsonic.usuarios.Repositories.UserRepository;
import com.susbsonic.usuarios.models.DAO.ProviderService;
import com.susbsonic.usuarios.models.DAO.Space;
import com.susbsonic.usuarios.models.DAO.User;
import com.susbsonic.usuarios.models.DTO.ProviderServiceDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessServiceManager {

    private final ProviderServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final SpaceRepository spaceRepository;

    public List<ProviderServiceDTO> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProviderServiceDTO createService(ProviderServiceDTO dto, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        ProviderService entity = ProviderService.builder()
                .nombre(dto.getNombre())
                .tipo(dto.getTipo())
                .descripcion(dto.getDescripcion())
                .fechas(dto.getFechas())
                .imagenUrl(dto.getImagenUrl())
                .provider(user)
                .build();
                
        if (dto.getSpaceId() != null) {
            Space space = spaceRepository.findById(dto.getSpaceId()).orElseThrow(() -> new RuntimeException("Space not found"));
            entity.setSpace(space);
        }
        
        ProviderService saved = serviceRepository.save(entity);
        return mapToDTO(saved);
    }

    public List<ProviderServiceDTO> getServicesByProvider(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return serviceRepository.findByProviderId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProviderServiceDTO assignSpaceToService(Long serviceId, Long spaceId) {
        ProviderService service = serviceRepository.findById(serviceId).orElseThrow(() -> new RuntimeException("Service not found"));
        Space space = spaceRepository.findById(spaceId).orElseThrow(() -> new RuntimeException("Space not found"));
        
        service.setSpace(space);
        ProviderService updated = serviceRepository.save(service);
        
        return mapToDTO(updated);
    }

    private ProviderServiceDTO mapToDTO(ProviderService entity) {
        return ProviderServiceDTO.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .tipo(entity.getTipo())
                .descripcion(entity.getDescripcion())
                .fechas(entity.getFechas())
                .imagenUrl(entity.getImagenUrl())
                .providerId(entity.getProvider().getId())
                .spaceId(entity.getSpace() != null ? entity.getSpace().getId() : null)
                .build();
    }
}
