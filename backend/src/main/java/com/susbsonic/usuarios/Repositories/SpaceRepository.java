package com.susbsonic.usuarios.Repositories;

import com.susbsonic.usuarios.models.DAO.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad Space.
 */
@Repository
public interface SpaceRepository extends JpaRepository<Space, Long> {

    /**
     * Encuentra todos los espacios que NO están alquilados (isRented = false).
     * Útil para mostrar a los proveedores solo las parcelas disponibles.
     */
    List<Space> findByIsRentedFalse();
}