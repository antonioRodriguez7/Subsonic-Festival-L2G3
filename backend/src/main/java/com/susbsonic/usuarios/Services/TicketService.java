package com.susbsonic.usuarios.Services;

import com.susbsonic.usuarios.models.DAO.Ticket;
import com.susbsonic.usuarios.models.DTO.TicketDTO;
import com.susbsonic.usuarios.Repositories.TicketRepository;
import com.susbsonic.usuarios.Repositories.TicketCompradoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio encargado de gestionar la lógica de negocio de las Entradas.
 * Proporciona métodos para crear, leer, actualizar y borrar entradas,
 * transformando los datos entre Entidades (base de datos) y DTOs (respuestas).
 */
@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCompradoRepository ticketCompradoRepository;

    /**
     * Constructor para inyectar la dependencia del repositorio.
     */
    public TicketService(TicketRepository ticketRepository, TicketCompradoRepository ticketCompradoRepository) {
        this.ticketRepository = ticketRepository;
        this.ticketCompradoRepository = ticketCompradoRepository;
    }

    // ==========================================
    // MÉTODOS DE MAPEO (Entity <-> DTO)
    // ==========================================

    /**
     * Convierte una entidad Ticket en un TicketDTO.
     */
    private TicketDTO mapToDTO(Ticket ticket) {
        return TicketDTO.builder()
                .id(ticket.getId())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .price(ticket.getPrice())
                .feature(ticket.getFeature())
                .imageUrl(ticket.getImageUrl())
                .stock(ticket.getStock())
                .build();
    }

    /**
     * Convierte un TicketDTO en una entidad Ticket.
     */
    private Ticket mapToEntity(TicketDTO dto) {
        return Ticket.builder()
                .category(dto.getCategory())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .feature(dto.getFeature())
                .imageUrl(dto.getImageUrl())
                .stock(dto.getStock() != null ? dto.getStock() : 0) // Previene valores nulos
                .build();
    }

    // ==========================================
    // OPERACIONES CRUD
    // ==========================================

    /**
     * Crea una nueva entrada en la base de datos.
     *
     * @param dto Los datos de la nueva entrada.
     * @return El DTO de la entrada recién creada.
     */
    public TicketDTO createTicket(TicketDTO dto) {
        Ticket ticket = mapToEntity(dto);
        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToDTO(savedTicket);
    }

    /**
     * Obtiene una entrada específica por su ID.
     */
    public TicketDTO getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrada no encontrada con ID: " + id));
        return mapToDTO(ticket);
    }

    /**
     * Obtiene todas las entradas registradas en el sistema.
     * Útil para el panel de Administración.
     */
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene solo las entradas que tienen stock disponible.
     * Útil para la vista pública de compras de los clientes.
     */
    public List<TicketDTO> getAvailableTickets() {
        return ticketRepository.findByStockGreaterThan(0).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Actualiza los datos de una entrada existente.
     *
     * @param id El ID de la entrada a modificar.
     * @param updatedDto Los nuevos datos de la entrada.
     * @return El DTO de la entrada actualizada.
     */
    public TicketDTO updateTicket(Long id, TicketDTO updatedDto) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrada no encontrada con ID: " + id));

        ticket.setCategory(updatedDto.getCategory());
        ticket.setDescription(updatedDto.getDescription());
        ticket.setPrice(updatedDto.getPrice());
        ticket.setFeature(updatedDto.getFeature());
        ticket.setImageUrl(updatedDto.getImageUrl());
        ticket.setStock(updatedDto.getStock());

        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToDTO(savedTicket);
    }

    /**
     * Elimina una entrada del sistema.
     */
    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Entrada no encontrada con ID: " + id);
        }

        // Verificar si hay compras asociadas a este ticket
        boolean hasPurchases = ticketCompradoRepository.existsByTicketId(id);
        if (hasPurchases) {
            throw new RuntimeException("No se puede eliminar la entrada porque ya ha sido comprada por usuarios. Considere marcarla como no disponible en lugar de eliminarla.");
        }

        ticketRepository.deleteById(id);
    }
}