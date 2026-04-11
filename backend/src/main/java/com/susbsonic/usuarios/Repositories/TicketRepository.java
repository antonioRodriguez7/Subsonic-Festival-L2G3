package com.susbsonic.usuarios.Repositories;

import com.susbsonic.usuarios.models.DAO.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para gestionar las operaciones de base de datos de las Entradas (Tickets).
 * Extiende JpaRepository para heredar automáticamente los métodos CRUD básicos
 * (save, findById, delete, findAll).
 */
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    /**
     * Encuentra todas las entradas que tienen stock disponible.
     * Útil para mostrar a los clientes solo las entradas que aún pueden comprar.
     *
     * @return Lista de entradas con stock mayor a 0.
     */
    List<Ticket> findByStockGreaterThan(Integer stock);
}
