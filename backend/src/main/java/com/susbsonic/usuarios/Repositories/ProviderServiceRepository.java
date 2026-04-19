package com.susbsonic.usuarios.Repositories;

import com.susbsonic.usuarios.models.DAO.ProviderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderServiceRepository extends JpaRepository<ProviderService, Long> {
    List<ProviderService> findByProviderId(Long providerId);
    Optional<ProviderService> findBySpaceId(Long spaceId);
}
