package com.susbsonic.usuarios.Services;

import com.susbsonic.usuarios.Repositories.RentedSpaceRepository;
import com.susbsonic.usuarios.Repositories.UserRepository;
import com.susbsonic.usuarios.models.DAO.RentedSpace;
import com.susbsonic.usuarios.models.DAO.Space;
import com.susbsonic.usuarios.models.DAO.User;
import com.susbsonic.usuarios.models.DTO.RentedSpaceDTO;
import com.susbsonic.usuarios.models.DTO.SpaceDTO;
import com.susbsonic.usuarios.Repositories.SpaceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar la lógica de los Espacios (Foodtrucks, Barras, etc.)
 * y sus alquileres por parte de los proveedores.
 */
@Service
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final RentedSpaceRepository rentedSpaceRepository;
    private final UserRepository userRepository;

    public SpaceService(SpaceRepository spaceRepository,
                        RentedSpaceRepository rentedSpaceRepository,
                        UserRepository userRepository) {
        this.spaceRepository = spaceRepository;
        this.rentedSpaceRepository = rentedSpaceRepository;
        this.userRepository = userRepository;
    }

    // --- Mapeos ---

    private SpaceDTO mapToDTO(Space space) {
        return SpaceDTO.builder()
                .id(space.getId())
                .name(space.getName())
                .type(space.getType())
                .price(space.getPrice())
                .sizeSquareMeters(space.getSizeSquareMeters())
                .isRented(space.getIsRented())
                .build();
    }

    private Space mapToEntity(SpaceDTO dto) {
        return Space.builder()
                .name(dto.getName())
                .type(dto.getType())
                .price(dto.getPrice())
                .sizeSquareMeters(dto.getSizeSquareMeters())
                .isRented(dto.getIsRented() != null ? dto.getIsRented() : false)
                .build();
    }

    private RentedSpaceDTO mapAlquiladoToDTO(RentedSpace ea) {
        return RentedSpaceDTO.builder()
                .id(ea.getId())
                .providerId(ea.getProvider().getId())
                .spaceId(ea.getSpace().getId())
                .spaceName(ea.getSpace().getName())
                .spaceType(ea.getSpace().getType())
                .spacePrice(ea.getSpace().getPrice())
                .spaceSizeSquareMeters(ea.getSpace().getSizeSquareMeters())
                .rentDate(ea.getRentDate())
                .build();
    }

    // --- CRUD de Espacios (Admin) ---

    public SpaceDTO createSpace(SpaceDTO dto) {
        return mapToDTO(spaceRepository.save(mapToEntity(dto)));
    }

    public SpaceDTO getSpaceById(Long id) {
        return mapToDTO(spaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + id)));
    }

    public List<SpaceDTO> getAllSpaces() {
        return spaceRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<SpaceDTO> getAvailableSpaces() {
        return spaceRepository.findByIsRentedFalse().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public SpaceDTO updateSpace(Long id, SpaceDTO updatedDto) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + id));
        space.setName(updatedDto.getName());
        space.setType(updatedDto.getType());
        space.setPrice(updatedDto.getPrice());
        space.setSizeSquareMeters(updatedDto.getSizeSquareMeters());
        space.setIsRented(updatedDto.getIsRented());
        return mapToDTO(spaceRepository.save(space));
    }

    public void deleteSpace(Long id) {
        if (!spaceRepository.existsById(id)) {
            throw new RuntimeException("Espacio no encontrado con ID: " + id);
        }
        spaceRepository.deleteById(id);
    }

    // --- Operaciones de Alquiler (Proveedor) ---

    /**
     * Registra el alquiler de un espacio por el proveedor autenticado.
     * Crea una fila en la tabla auxiliar 'rented_spaces' y
     * marca el espacio como isRented = true.
     */
    public RentedSpaceDTO rentSpace(Long spaceId, String identifier) {
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + spaceId));

        if (Boolean.TRUE.equals(space.getIsRented())) {
            throw new RuntimeException("El espacio ya está alquilado por otro proveedor.");
        }

        User provider = resolveUser(identifier);

        if (rentedSpaceRepository.existsByProviderIdAndSpaceId(provider.getId(), spaceId)) {
            throw new RuntimeException("Ya tienes este espacio alquilado.");
        }

        // 1. Marcar el espacio como ocupado
        space.setIsRented(true);
        spaceRepository.save(space);

        // 2. Registrar en la tabla auxiliar
        RentedSpace alquiler = RentedSpace.builder()
                .provider(provider)
                .space(space)
                .rentDate(LocalDateTime.now())
                .build();

        return mapAlquiladoToDTO(rentedSpaceRepository.save(alquiler));
    }

    /**
     * Devuelve todos los espacios alquilados por el proveedor autenticado.
     */
    public List<RentedSpaceDTO> getMyRentedSpaces(String identifier) {
        User provider = resolveUser(identifier);
        return rentedSpaceRepository.findByProviderId(provider.getId())
                .stream()
                .map(this::mapAlquiladoToDTO)
                .collect(Collectors.toList());
    }

    // --- Helper ---

    private User resolveUser(String identifier) {
        return userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByUsername(identifier)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + identifier)));
    }
}