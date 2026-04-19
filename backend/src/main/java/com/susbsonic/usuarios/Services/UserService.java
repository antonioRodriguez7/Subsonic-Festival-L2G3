package com.susbsonic.usuarios.Services;

import com.susbsonic.usuarios.models.DAO.User;
import com.susbsonic.usuarios.Repositories.UserRepository;
import com.susbsonic.usuarios.models.DTO.UserProfileDTO;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Servicio encargado de gestionar las operaciones relacionadas con el usuario.
 * Proporciona métodos para obtener, actualizar y eliminar usuarios en el
 * sistema.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final com.susbsonic.usuarios.Repositories.TicketCompradoRepository ticketCompradoRepository;
    private final com.susbsonic.usuarios.Repositories.ProviderServiceRepository providerServiceRepository;
    private final com.susbsonic.usuarios.Repositories.RentedSpaceRepository rentedSpaceRepository;
    private final com.susbsonic.usuarios.Repositories.SpaceRepository spaceRepository;

    public UserService(UserRepository userRepository,
                       org.springframework.security.crypto.password.PasswordEncoder passwordEncoder,
                       com.susbsonic.usuarios.Repositories.TicketCompradoRepository ticketCompradoRepository,
                       com.susbsonic.usuarios.Repositories.ProviderServiceRepository providerServiceRepository,
                       com.susbsonic.usuarios.Repositories.RentedSpaceRepository rentedSpaceRepository,
                       com.susbsonic.usuarios.Repositories.SpaceRepository spaceRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.ticketCompradoRepository = ticketCompradoRepository;
        this.providerServiceRepository = providerServiceRepository;
        this.rentedSpaceRepository = rentedSpaceRepository;
        this.spaceRepository = spaceRepository;
    }

    private UserProfileDTO convertToUserProfileDTO(User user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .surname(user.getSurname())
                .email(user.getEmail())
                .personalLink(user.getPersonalLink())
                .birthday(user.getBirthday())
                .bio(user.getBio())
                .build();
    }

    public Optional<UserProfileDTO> getUserById(Long id) {
        return userRepository.findById(id).map(this::convertToUserProfileDTO);
    }

    public Optional<UserProfileDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(this::convertToUserProfileDTO);
    }

    public Optional<UserProfileDTO> getUserByUsername(String username) {
        return userRepository.findByUsername(username).map(this::convertToUserProfileDTO);
    }

    public UserProfileDTO updateUser(Long id, UserProfileDTO updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        user.setName(updatedUser.getName());
        user.setSurname(updatedUser.getSurname());
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setPersonalLink(updatedUser.getPersonalLink());
        user.setBirthday(updatedUser.getBirthday());
        user.setBio(updatedUser.getBio());

        // Si se envía una nueva contraseña, validamos la actual primero
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            if (updatedUser.getCurrentPassword() == null || updatedUser.getCurrentPassword().isEmpty()) {
                throw new RuntimeException("Debes introducir la contraseña actual para poder cambiarla.");
            }
            if (!passwordEncoder.matches(updatedUser.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("La contraseña actual introducida no es correcta.");
            }
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        User updatedUserEntity = userRepository.save(user);
        return convertToUserProfileDTO(updatedUserEntity);
    }

    /**
     * Elimina un usuario por su ID.
     *
     * @param id el ID del usuario que se desea eliminar.
     * @throws RuntimeException si el usuario no se encuentra.
     */
    @jakarta.transaction.Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado.");
        }

        // 1. Eliminar tickets comprados por este usuario
        java.util.List<com.susbsonic.usuarios.models.DAO.TicketComprados> tickets = ticketCompradoRepository.findByUserId(id);
        if (!tickets.isEmpty()) {
            ticketCompradoRepository.deleteAll(tickets);
        }

        // 2. Eliminar servicios de proveedor
        java.util.List<com.susbsonic.usuarios.models.DAO.ProviderService> services = providerServiceRepository.findByProviderId(id);
        if (!services.isEmpty()) {
            providerServiceRepository.deleteAll(services);
        }

        // 3. Eliminar alquileres de espacios y liberar los espacios
        java.util.List<com.susbsonic.usuarios.models.DAO.RentedSpace> rentedSpaces = rentedSpaceRepository.findByProviderId(id);
        for (com.susbsonic.usuarios.models.DAO.RentedSpace rented : rentedSpaces) {
            com.susbsonic.usuarios.models.DAO.Space space = rented.getSpace();
            if (space != null) {
                space.setIsRented(false);
                spaceRepository.save(space);
            }
        }
        if (!rentedSpaces.isEmpty()) {
            rentedSpaceRepository.deleteAll(rentedSpaces);
        }

        // 4. Finalmente eliminar el usuario
        userRepository.deleteById(id);
    }
}
