package com.ghassen.gymbackend.repositories;


import com.ghassen.gymbackend.entities.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    Optional<Program> findByTitleAndCoachId(String title, Long coachId);
}

