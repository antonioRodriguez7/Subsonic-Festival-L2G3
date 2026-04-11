package com.susbsonic.usuarios.Repositories;

import com.susbsonic.usuarios.models.DAO.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para gestionar los artistas del cartel de Subsonic Festival.
 */
@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {

    // Método para la barra de búsqueda del frontend
    List<Artist> findByNameContainingIgnoreCase(String name);

}