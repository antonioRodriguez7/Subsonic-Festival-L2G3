package com.susbsonic.usuarios.Repositories;

import com.susbsonic.usuarios.models.DAO.TicketComprados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketCompradoRepository extends JpaRepository<TicketComprados, Long> {

    /**
     * Busca todas las compras que ha hecho un usuario concreto.
     * Útil para la sección "Mis Entradas" del perfil del cliente en React.
     */
    List<TicketComprados> findByUserId(Long userId);

}