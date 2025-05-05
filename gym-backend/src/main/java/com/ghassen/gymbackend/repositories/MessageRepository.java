package com.ghassen.gymbackend.repositories;

import com.ghassen.gymbackend.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE " +
            "(m.senderClient.id = :senderId AND m.receiverCoach.id = :receiverId) OR " +
            "(m.senderCoach.id = :senderId AND m.receiverClient.id = :receiverId)")
    List<Message> findBySenderIdAndReceiverId(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
}

