package com.ghassen.gymbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
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

    @OneToMany(mappedBy = "senderClient", cascade = CascadeType.ALL)
    private List<Message> messagesSent;

    @OneToMany(mappedBy = "receiverClient", cascade = CascadeType.ALL)
    private List<Message> messagesReceived;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Subscription> subscriptions;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Review> reviews;
}