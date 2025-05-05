package com.ghassen.gymbackend.controllers;

import com.ghassen.gymbackend.dto.CoachRequest;
import com.ghassen.gymbackend.entities.*;
import com.ghassen.gymbackend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/coaches")
@CrossOrigin(origins = "http://localhost:4200")
public class CoachController {

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ProgramRepository programRepository;

    @GetMapping
    public ResponseEntity<List<Coach>> getAllCoaches() {
        try {
            return ResponseEntity.ok(coachRepository.findAll());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coach> getCoachById(@PathVariable Long id) {
        try {
            Optional<Coach> coach = coachRepository.findById(id);
            return coach.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createCoach(@RequestBody CoachRequest coachRequest) {
        try {
            if (coachRepository.findByEmail(coachRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("A coach with this email already exists.");
            }

            Coach coach = new Coach();
            coach.setName(coachRequest.getName());
            coach.setEmail(coachRequest.getEmail());
            coach.setPassword(coachRequest.getPassword());
            coach.setImagePath(coachRequest.getImagePath());
            coach.setRole(Role.COACH);
            coach.setSpecialties(coachRequest.getSpecialties() != null ? coachRequest.getSpecialties() : "General");

            Coach savedCoach = coachRepository.save(coach);
            return ResponseEntity.ok(savedCoach);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating coach: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCoach(@PathVariable Long id, @RequestBody Coach coachDetails) {
        try {
            Optional<Coach> optionalCoach = coachRepository.findById(id);
            if (!optionalCoach.isPresent()) {
                return ResponseEntity.status(404).body("Coach not found with id: " + id);
            }

            Coach coach = optionalCoach.get();
            coach.setName(coachDetails.getName());
            coach.setEmail(coachDetails.getEmail());
            coach.setPassword(coachDetails.getPassword());
            coach.setImagePath(coachDetails.getImagePath());
            coach.setSpecialties(coachDetails.getSpecialties() != null ? coachDetails.getSpecialties() : coach.getSpecialties());

            Coach updatedCoach = coachRepository.save(coach);
            return ResponseEntity.ok(updatedCoach);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating coach: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCoach(@PathVariable Long id) {
        try {
            Optional<Coach> coach = coachRepository.findById(id);
            if (!coach.isPresent()) {
                return ResponseEntity.status(404).body("Coach not found with id: " + id);
            }

            coachRepository.deleteById(id);
            return ResponseEntity.ok("Coach deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting coach: " + e.getMessage());
        }
    }

    @PostMapping("/{coachId}/programs")
    public ResponseEntity<?> createProgramWithPlans(@PathVariable Long coachId, @RequestBody Program program) {
        try {
            Coach coach = coachRepository.findById(coachId)
                    .orElseThrow(() -> new RuntimeException("Coach not found with id: " + coachId));

            if (programRepository.findByTitleAndCoachId(program.getTitle(), coachId).isPresent()) {
                return ResponseEntity.badRequest().body("Program with the same title already exists for this coach.");
            }

            program.setCoach(coach);

            if (program.getPlans() != null) {
                for (Plan plan : program.getPlans()) {
                    plan.setProgram(program);
                }
            }

            return ResponseEntity.ok(programRepository.save(program));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating program: " + e.getMessage());
        }
    }

    @PutMapping("/{coachId}/programs/{programId}")
    public ResponseEntity<?> updateProgram(@PathVariable Long coachId, @PathVariable Long programId, @RequestBody Program programDetails) {
        try {
            Program existingProgram = programRepository.findById(programId)
                    .orElseThrow(() -> new RuntimeException("Program not found with id: " + programId));

            if (!existingProgram.getCoach().getId().equals(coachId)) {
                return ResponseEntity.badRequest().body("Program does not belong to this coach.");
            }

            existingProgram.setTitle(programDetails.getTitle());
            existingProgram.setDescription(programDetails.getDescription());
            existingProgram.setPrice(programDetails.getPrice());
            existingProgram.setImagePath(programDetails.getImagePath());

            if (programDetails.getPlans() != null) {
                for (Plan updatedPlan : programDetails.getPlans()) {
                    if (updatedPlan.getId() != null) {
                        existingProgram.getPlans().stream()
                                .filter(plan -> plan.getId().equals(updatedPlan.getId()))
                                .forEach(plan -> {
                                    plan.setDay(updatedPlan.getDay());
                                    plan.setActivity(updatedPlan.getActivity());
                                    plan.setTime(updatedPlan.getTime());
                                });
                    } else {
                        updatedPlan.setProgram(existingProgram);
                        existingProgram.getPlans().add(updatedPlan);
                    }
                }
            }

            return ResponseEntity.ok(programRepository.save(existingProgram));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating program: " + e.getMessage());
        }
    }

    @GetMapping("/{coachId}/programs")
    public ResponseEntity<List<Program>> getProgramsByCoach(@PathVariable Long coachId) {
        try {
            Coach coach = coachRepository.findById(coachId)
                    .orElseThrow(() -> new RuntimeException("Coach not found with id: " + coachId));
            return ResponseEntity.ok(coach.getPrograms());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }

    @PostMapping("/{senderId}/sendMessage")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long senderId,
            @RequestParam Long receiverId,
            @RequestParam String content
    ) {
        try {
            Optional<Coach> coachOpt = coachRepository.findById(senderId);
            Optional<Client> clientOpt = clientRepository.findById(senderId);

            if (coachOpt.isPresent()) {
                Coach sender = coachOpt.get();
                Optional<Client> receiverOpt = clientRepository.findById(receiverId);
                if (receiverOpt.isEmpty()) return ResponseEntity.status(404).body("Receiver (Client) not found");

                Client receiver = receiverOpt.get();
                Message message = new Message();
                message.setSenderCoach(sender);
                message.setReceiverClient(receiver);
                message.setContent(content);
                message.setTimestamp(LocalDateTime.now());
                messageRepository.save(message);
                return ResponseEntity.ok("Message sent successfully.");
            } else if (clientOpt.isPresent()) {
                Client sender = clientOpt.get();
                Optional<Coach> receiverOpt = coachRepository.findById(receiverId);
                if (receiverOpt.isEmpty()) return ResponseEntity.status(404).body("Receiver (Coach) not found");

                Coach receiver = receiverOpt.get();
                Message message = new Message();
                message.setSenderClient(sender);
                message.setReceiverCoach(receiver);
                message.setContent(content);
                message.setTimestamp(LocalDateTime.now());
                messageRepository.save(message);
                return ResponseEntity.ok("Message sent successfully.");
            }

            return ResponseEntity.status(404).body("Sender not found");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending message: " + e.getMessage());
        }
    }

    @GetMapping("/{coachId}/messages/{clientId}")
    public ResponseEntity<List<Message>> getMessagesBetweenCoachAndClient(
            @PathVariable Long coachId,
            @PathVariable Long clientId
    ) {
        try {
            Optional<Coach> coachOpt = coachRepository.findById(coachId);
            Optional<Client> clientOpt = clientRepository.findById(clientId);

            if (coachOpt.isEmpty() || clientOpt.isEmpty()) {
                return ResponseEntity.status(404).body(new ArrayList<>());
            }

            List<Message> coachToClientMessages = messageRepository.findBySenderIdAndReceiverId(coachId, clientId);
            List<Message> clientToCoachMessages = messageRepository.findBySenderIdAndReceiverId(clientId, coachId);

            List<Message> allMessages = new ArrayList<>();
            allMessages.addAll(coachToClientMessages);
            allMessages.addAll(clientToCoachMessages);

            allMessages.sort(Comparator.comparing(Message::getTimestamp));

            return ResponseEntity.ok(allMessages);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }
}