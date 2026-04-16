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

    public ProviderServiceDTO createService(ProviderServiceDTO dto, String identifier) {
        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByUsername(identifier)
                .orElseThrow(() -> new RuntimeException("User not found with identifier: " + identifier)));
        
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

    public List<ProviderServiceDTO> getServicesByProvider(String identifier) {
        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByUsername(identifier)
                .orElseThrow(() -> new RuntimeException("User not found with identifier: " + identifier)));

        return serviceRepository.findByProviderId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProviderServiceDTO updateService(Long id, ProviderServiceDTO dto, String identifier) {
        ProviderService entity = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + id));

        // Validamos que el usuario logueado es el dueño del servicio (buscando por email o username)
        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByUsername(identifier)
                .orElseThrow(() -> new RuntimeException("User not found: " + identifier)));

        if (!entity.getProvider().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: This is not your service");
        }

        System.out.println("Updating service: " + id + " with name: " + dto.getNombre());

        entity.setNombre(dto.getNombre());
        entity.setTipo(dto.getTipo());
        entity.setDescripcion(dto.getDescripcion());
        entity.setFechas(dto.getFechas());
        
        // Solo actualizamos la imagen si se envía una (para no borrar la anterior accidentalmente)
        if (dto.getImagenUrl() != null && !dto.getImagenUrl().isEmpty()) {
            entity.setImagenUrl(dto.getImagenUrl());
        }

        // Solo cambiamos el espacio si viene en el DTO (si es nulo, mantenemos el que hay)
        if (dto.getSpaceId() != null) {
            Space space = spaceRepository.findById(dto.getSpaceId())
                    .orElseThrow(() -> new RuntimeException("Space not found with ID: " + dto.getSpaceId()));
            entity.setSpace(space);
        }

        ProviderService updated = serviceRepository.save(entity);
        return mapToDTO(updated);
    }

    public void deleteService(Long id, String identifier) {
        ProviderService service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + id));
        
        // Validamos que el usuario logueado es el dueño del servicio
        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByUsername(identifier)
                .orElseThrow(() -> new RuntimeException("User not found: " + identifier)));

        if (!service.getProvider().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: This is not your service");
        }

        // Simplemente borramos el servicio. El espacio seguirá marcado como isRented=true
        // (ya que fue contratado previamente) pero ahora aparecerá como "libre" en el frontend
        // para que este proveedor pueda asignarle otro servicio si quiere.
        
        serviceRepository.delete(service);
    }

    public ProviderServiceDTO assignSpaceToService(Long serviceId, Long spaceId) {
        ProviderService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new RuntimeException("Space not found"));
        
        service.setSpace(space);
        ProviderService updated = serviceRepository.save(service);
        
        return mapToDTO(updated);
    }

    public ProviderServiceDTO unassignSpaceFromService(Long serviceId) {
        ProviderService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        service.setSpace(null);
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
