package com.susbsonic.usuarios.Repositories;

import com.susbsonic.usuarios.models.DAO.RentedSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RentedSpaceRepository extends JpaRepository<RentedSpace, Long> {

    List<RentedSpace> findByProviderId(Long providerId);

    Optional<RentedSpace> findBySpaceId(Long spaceId);

    boolean existsByProviderIdAndSpaceId(Long providerId, Long spaceId);
}
