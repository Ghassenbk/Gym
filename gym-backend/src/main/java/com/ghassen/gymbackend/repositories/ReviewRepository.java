package com.ghassen.gymbackend.repositories;

import com.ghassen.gymbackend.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Custom queries like:
    // List<Review> findByCoachId(Long coachId);
}

