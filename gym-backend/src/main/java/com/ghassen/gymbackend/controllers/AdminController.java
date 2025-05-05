package com.ghassen.gymbackend.controllers;

import com.ghassen.gymbackend.dto.LoginRequest;
import com.ghassen.gymbackend.entities.*;
import com.ghassen.gymbackend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private ClientRepository clientRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login request received: " + loginRequest.getEmail());

        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null ||
                loginRequest.getEmail().isEmpty() || loginRequest.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
        }

        try {
            // Check admins
            Optional<Admin> adminOptional = adminRepository.findByEmail(loginRequest.getEmail());
            if (adminOptional.isPresent()) {
                Admin admin = adminOptional.get();
                if (admin.getPassword().equals(loginRequest.getPassword())) {
                    System.out.println("Login successful for admin: " + loginRequest.getEmail());
                    return ResponseEntity.ok(admin);
                } else {
                    System.out.println("Invalid password for admin: " + loginRequest.getEmail());
                }
            }

            // Check coaches
            Optional<Coach> coachOptional = coachRepository.findByEmail(loginRequest.getEmail());
            if (coachOptional.isPresent()) {
                Coach coach = coachOptional.get();
                if (coach.getPassword().equals(loginRequest.getPassword())) {
                    System.out.println("Login successful for coach: " + loginRequest.getEmail());
                    return ResponseEntity.ok(coach);
                } else {
                    System.out.println("Invalid password for coach: " + loginRequest.getEmail());
                }
            }

            // Check clients
            Optional<Client> clientOptional = clientRepository.findByEmail(loginRequest.getEmail());
            if (clientOptional.isPresent()) {
                Client client = clientOptional.get();
                if (client.getPassword().equals(loginRequest.getPassword())) {
                    System.out.println("Login successful for client: " + loginRequest.getEmail());
                    return ResponseEntity.ok(client);
                } else {
                    System.out.println("Invalid password for client: " + loginRequest.getEmail());
                }
            }

            System.out.println("User not found with email: " + loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        } catch (Exception e) {
            System.out.println("Exception during login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed due to server error");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> userData) {
        String email = (String) userData.get("email");
        String password = (String) userData.get("password");
        String name = (String) userData.get("name");
        String imagePath = (String) userData.get("imagePath");
        String roleStr = (String) userData.get("role");

        System.out.println("Register request received: " + email);

        try {
            Role role = Role.valueOf(roleStr.toUpperCase());

            // Check for existing email
            if (adminRepository.findByEmail(email).isPresent() ||
                    coachRepository.findByEmail(email).isPresent() ||
                    clientRepository.findByEmail(email).isPresent()) {
                System.out.println("Email already exists: " + email);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
            }

            switch (role) {
                case ADMIN:
                    Admin admin = new Admin();
                    admin.setEmail(email);
                    admin.setPassword(password);
                    admin.setName(name);
                    admin.setImagePath(imagePath);
                    admin.setRole(Role.ADMIN);
                    adminRepository.save(admin);
                    System.out.println("Admin registered successfully: " + email);
                    return ResponseEntity.ok(admin);
                case COACH:
                    Coach coach = new Coach();
                    coach.setEmail(email);
                    coach.setPassword(password);
                    coach.setName(name);
                    coach.setImagePath(imagePath);
                    coach.setRole(Role.COACH);
                    coach.setSpecialties((String) userData.get("specialties"));
                    coachRepository.save(coach);
                    System.out.println("Coach registered successfully: " + email);
                    return ResponseEntity.ok(coach);
                case CLIENT:
                    Client client = new Client();
                    client.setEmail(email);
                    client.setPassword(password);
                    client.setName(name);
                    client.setImagePath(imagePath);
                    client.setRole(Role.CLIENT);
                    clientRepository.save(client);
                    System.out.println("Client registered successfully: " + email);
                    return ResponseEntity.ok(client);
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid role");
            }
        } catch (Exception e) {
            System.out.println("Exception during registration: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed due to server error");
        }
    }

    @GetMapping("/checkEmail/{email}")
    public ResponseEntity<?> checkEmailExists(@PathVariable String email) {
        boolean exists = adminRepository.findByEmail(email).isPresent() ||
                coachRepository.findByEmail(email).isPresent() ||
                clientRepository.findByEmail(email).isPresent();
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}