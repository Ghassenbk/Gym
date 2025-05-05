package com.ghassen.gymbackend.dto;


import lombok.Data;

@Data
public class CoachRequest {
    private String name;
    private String email;
    private String password;
    private String imagePath;
    private String specialties;
}
