package com.susbsonic.usuarios.Services;

import com.susbsonic.usuarios.models.DAO.Space;
import com.susbsonic.usuarios.models.DTO.SpaceDTO;
import com.susbsonic.usuarios.Repositories.SpaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar la lógica de los Espacios (Foodtrucks, Barras, etc.).
 */
@Service
public class SpaceService {

    private final SpaceRepository spaceRepository;

    public SpaceService(SpaceRepository spaceRepository) {
        this.spaceRepository = spaceRepository;
    }

    // --- Mapeo Entity <-> DTO ---

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
                .isRented(dto.getIsRented() != null ? dto.getIsRented() : false) // Por defecto libre
                .build();
    }

    // --- Operaciones CRUD ---

    public SpaceDTO createSpace(SpaceDTO dto) {
        Space space = mapToEntity(dto);
        Space savedSpace = spaceRepository.save(space);
        return mapToDTO(savedSpace);
    }

    public SpaceDTO getSpaceById(Long id) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + id));
        return mapToDTO(space);
    }

    public List<SpaceDTO> getAllSpaces() {
        return spaceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<SpaceDTO> getAvailableSpaces() {
        return spaceRepository.findByIsRentedFalse().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SpaceDTO updateSpace(Long id, SpaceDTO updatedDto) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + id));

        space.setName(updatedDto.getName());
        space.setType(updatedDto.getType());
        space.setPrice(updatedDto.getPrice());
        space.setSizeSquareMeters(updatedDto.getSizeSquareMeters());
        space.setIsRented(updatedDto.getIsRented());

        Space savedSpace = spaceRepository.save(space);
        return mapToDTO(savedSpace);
    }

    public void deleteSpace(Long id) {
        if (!spaceRepository.existsById(id)) {
            throw new RuntimeException("Espacio no encontrado con ID: " + id);
        }
        spaceRepository.deleteById(id);
    }
}