package com.ghassen.gymbackend.repositories;

import com.ghassen.gymbackend.entities.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    @Query("SELECT s FROM Subscription s JOIN s.programs p WHERE s.client.id = :clientId AND p.id = :programId")
    Optional<Subscription> findByClientIdAndProgramId(@Param("clientId") Long clientId, @Param("programId") Long programId);
}

