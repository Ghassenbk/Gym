package com.ghassen.gymbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amountPaid;
    private String paymentMethod;
    private LocalDate subscriptionDate;
    private LocalDate expirationDate;

    @ManyToOne
    private Client client;

    @ManyToMany
    private List<Program> programs;
}
