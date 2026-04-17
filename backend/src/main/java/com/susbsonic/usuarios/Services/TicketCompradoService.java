package com.susbsonic.usuarios.Services;

import com.susbsonic.usuarios.models.DAO.Ticket;
import com.susbsonic.usuarios.models.DAO.TicketComprados;
import com.susbsonic.usuarios.models.DAO.User;
import com.susbsonic.usuarios.models.DTO.TicketCompradoDTO;
import com.susbsonic.usuarios.Repositories.TicketCompradoRepository;
import com.susbsonic.usuarios.Repositories.TicketRepository;
import com.susbsonic.usuarios.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketCompradoService {

    private final TicketCompradoRepository purchaseRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final EmailService emailService;

    public TicketCompradoService(TicketCompradoRepository purchaseRepository,
                                 UserRepository userRepository,
                                 TicketRepository ticketRepository,
                                 EmailService emailService) {
        this.purchaseRepository = purchaseRepository;
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.emailService = emailService;
    }

    private TicketCompradoDTO mapToDTO(TicketComprados purchase) {
    return TicketCompradoDTO.builder()
            .id(purchase.getId())
            .userId(purchase.getUser().getId())
            .ticketId(purchase.getTicket().getId())
            .cantidad(purchase.getQuantity())
            .precioTotal(purchase.getTotalPrice())
            .comprasDate(purchase.getPurchaseDate())
            .category(purchase.getTicket().getCategory())
            .imageUrl(purchase.getTicket().getImageUrl())

            .build();
}

    /**
     * Lógica principal para comprar una entrada.
     * Usamos @Transactional para que si algo falla (ej. nos quedamos sin stock),
     * se deshaga toda la operación y no se cobre nada.
     */
    public TicketCompradoDTO buyTicket(TicketCompradoDTO dto, String username) {

    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    Ticket ticket = ticketRepository.findById(dto.getTicketId())
            .orElseThrow(() -> new RuntimeException("Entrada no encontrada"));

    if (ticket.getStock() < dto.getCantidad()) {
        throw new RuntimeException("No hay stock suficiente");
    }

    Double total = ticket.getPrice() * dto.getCantidad();

    ticket.setStock(ticket.getStock() - dto.getCantidad());
    ticketRepository.save(ticket);

    TicketComprados purchase = TicketComprados.builder()
            .user(user)
            .ticket(ticket)
            .quantity(dto.getCantidad())
            .totalPrice(total)
            .purchaseDate(java.time.LocalDateTime.now())
            .build();

    return mapToDTO(purchaseRepository.save(purchase));
}

    /**
     * Devuelve el historial de compras de un usuario.
     */
    public List<TicketCompradoDTO> getPurchasesByUser(Long userId) {
        return purchaseRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Devuelve TODAS las compras (Solo para el Admin).
     */
    public List<TicketCompradoDTO> getAllPurchases() {
        return purchaseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Envía las entradas en PDF por email al cliente.
     */
    public void sendTicketsPdfByEmail(String username, org.springframework.web.multipart.MultipartFile pdf) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String to = user.getEmail();
        String subject = "Tus entradas para Subsonic Festival";
        String body = "Hola " + user.getName() + ",\n\n"
                + "Aquí tienes las entradas para el Subsonic Festival. ¡Nos vemos en la pista!\n\n"
                + "Atentamente,\nEl equipo de Subsonic Festival.";

        emailService.sendEmailWithPdf(to, subject, body, pdf, "entradas-subsonic.pdf");
    }

    /**
     * Envía la factura en PDF por email al cliente.
     */
    public void sendInvoicePdfByEmail(String username, org.springframework.web.multipart.MultipartFile pdf) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String to = user.getEmail();
        String subject = "Tu factura de compra - Subsonic Festival";
        String body = "Hola " + user.getName() + ",\n\n"
                + "Adjuntamos la factura correspondiente a tu reciente compra de entradas.\n"
                + "En otro correo recibirás las entradas.\n\n"
                + "Atentamente,\nEl equipo de Subsonic Festival.";

        emailService.sendEmailWithPdf(to, subject, body, pdf, "factura-subsonic.pdf");
    }
}