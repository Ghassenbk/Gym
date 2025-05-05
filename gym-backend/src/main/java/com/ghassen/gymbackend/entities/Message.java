package com.ghassen.gymbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private LocalDateTime timestamp;

    @ManyToOne
    private Coach senderCoach;

    @ManyToOne
    private Client senderClient;

    @ManyToOne
    private Coach receiverCoach;

    @ManyToOne
    private Client receiverClient;
}

