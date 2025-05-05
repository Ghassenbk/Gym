package com.ghassen.gymbackend.repositories;

import com.ghassen.gymbackend.entities.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    // Custom queries like:
    // List<Plan> findByProgramId(Long programId);
}
