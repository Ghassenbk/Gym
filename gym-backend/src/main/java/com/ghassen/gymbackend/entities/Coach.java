package com.ghassen.gymbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "coaches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(unique = true)
    private String email;

    @Column
    private String password;

    @Column
    private String imagePath;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column
    private String specialties;

    @OneToMany(mappedBy = "senderCoach", cascade = CascadeType.ALL)
    private List<Message> messagesSent;

    @OneToMany(mappedBy = "receiverCoach", cascade = CascadeType.ALL)
    private List<Message> messagesReceived;

    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL)
    private List<Program> programs;

    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL)
    private List<Review> reviews;
}