package com.ghassen.gymbackend.controllers;

import com.ghassen.gymbackend.entities.*;
import com.ghassen.gymbackend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/clients")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Optional<Client> client = clientRepository.findById(id);
        return client.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createClient(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam(value = "imagePath", required = false) String imagePath) {

        if (clientRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(400).body("A client with this email already exists.");
        }

        Client client = new Client();
        client.setName(name);
        client.setEmail(email);
        client.setPassword(password);
        client.setRole(Role.CLIENT);
        client.setImagePath(imagePath); // Image path from /upload/image endpoint

        clientRepository.save(client);
        return ResponseEntity.ok(client);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClient(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam(value = "imagePath", required = false) String imagePath) {

        Optional<Client> optionalClient = clientRepository.findById(id);
        if (optionalClient.isPresent()) {
            Client client = optionalClient.get();
            client.setName(name);
            client.setEmail(email);
            client.setPassword(password);
            client.setImagePath(imagePath); // Updated image path from /upload/image endpoint

            clientRepository.save(client);
            return ResponseEntity.ok(client);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{clientId}/subscribe")
    public ResponseEntity<?> subscribeToPrograms(
            @PathVariable Long clientId,
            @RequestParam List<Long> programIds,
            @RequestParam String paymentMethod,
            @RequestParam int durationInMonths
    ) {
        Optional<Client> clientOpt = clientRepository.findById(clientId);
        if (clientOpt.isEmpty()) return ResponseEntity.status(404).body("Client not found");

        Client client = clientOpt.get();
        List<Program> selectedPrograms = programRepository.findAllById(programIds);
        List<Program> newPrograms = filterAlreadySubscribedPrograms(client, selectedPrograms);

        if (newPrograms.isEmpty()) {
            return ResponseEntity.status(400).body("Already subscribed to all selected programs");
        }

        Subscription subscription = createSubscription(client, newPrograms, paymentMethod, durationInMonths);
        subscriptionRepository.save(subscription);

        sendConfirmationEmail(client, newPrograms, subscription);
        return ResponseEntity.ok(buildReceipt(client, newPrograms, subscription));
    }

    private List<Program> filterAlreadySubscribedPrograms(Client client, List<Program> selectedPrograms) {
        List<Program> alreadySubscribed = client.getSubscriptions().stream()
                .flatMap(s -> s.getPrograms().stream())
                .toList();

        return selectedPrograms.stream()
                .filter(p -> !alreadySubscribed.contains(p))
                .toList();
    }

    private Subscription createSubscription(Client client, List<Program> programs, String paymentMethod, int durationInMonths) {
        double monthlyAmount = programs.stream().mapToDouble(Program::getPrice).sum();
        double totalAmount = monthlyAmount * durationInMonths;

        Subscription subscription = new Subscription();
        subscription.setClient(client);
        subscription.setPrograms(programs);
        subscription.setAmountPaid(totalAmount);
        subscription.setPaymentMethod(paymentMethod);
        subscription.setSubscriptionDate(LocalDate.now());
        subscription.setExpirationDate(LocalDate.now().plusMonths(durationInMonths));

        return subscription;
    }

    private void sendConfirmationEmail(Client client, List<Program> programs, Subscription subscription) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(client.getEmail());
            message.setSubject("Subscription Confirmation");
            message.setText("Hello " + client.getName() + ",\n\n" +
                    "You've subscribed to: " +
                    programs.stream().map(Program::getTitle).collect(Collectors.joining(", ")) +
                    "\nAmount Paid: " + subscription.getAmountPaid() + " (" + subscription.getPaymentMethod() + ")" +
                    "\nValid Until: " + subscription.getExpirationDate() +
                    "\n\nThank you!");
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Email send failed: " + e.getMessage());
        }
    }

    private Map<String, Object> buildReceipt(Client client, List<Program> programs, Subscription subscription) {
        Map<String, Object> receipt = new HashMap<>();
        receipt.put("client", client.getName());
        receipt.put("email", client.getEmail());
        receipt.put("programs", programs.stream().map(Program::getTitle).toList());
        receipt.put("amountPaid", subscription.getAmountPaid());
        receipt.put("paymentMethod", subscription.getPaymentMethod());
        receipt.put("subscriptionDate", subscription.getSubscriptionDate());
        receipt.put("validUntil", subscription.getExpirationDate());

        return receipt;
    }

    @PostMapping("/{senderId}/sendMessage")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long senderId,
            @RequestParam Long receiverId,
            @RequestParam String content
    ) {
        Optional<Client> clientOpt = clientRepository.findById(senderId);
        Optional<Coach> coachOpt = coachRepository.findById(senderId);

        if (clientOpt.isPresent()) {
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
        } else if (coachOpt.isPresent()) {
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
        }

        return ResponseEntity.status(404).body("Sender not found");
    }

    @GetMapping("/{clientId}/messages/{coachId}")
    public ResponseEntity<List<Message>> getMessagesBetweenClientAndCoach(
            @PathVariable Long clientId,
            @PathVariable Long coachId
    ) {
        Optional<Client> clientOpt = clientRepository.findById(clientId);
        Optional<Coach> coachOpt = coachRepository.findById(coachId);

        if (clientOpt.isEmpty()) return ResponseEntity.status(404).body(List.of());
        if (coachOpt.isEmpty()) return ResponseEntity.status(404).body(List.of());

        List<Message> clientToCoachMessages = messageRepository.findBySenderIdAndReceiverId(clientId, coachId);
        List<Message> coachToClientMessages = messageRepository.findBySenderIdAndReceiverId(coachId, clientId);

        List<Message> allMessages = new ArrayList<>();
        allMessages.addAll(clientToCoachMessages);
        allMessages.addAll(coachToClientMessages);

        allMessages.sort(Comparator.comparing(Message::getTimestamp));

        return ResponseEntity.ok(allMessages);
    }

    @PostMapping("/{clientId}/reviews/{coachId}")
    public ResponseEntity<?> addReview(
            @PathVariable Long clientId,
            @PathVariable Long coachId,
            @RequestParam int rating,
            @RequestParam String comment) {

        Optional<Client> clientOpt = clientRepository.findById(clientId);
        if (clientOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Client not found.");
        }

        Optional<Coach> coachOpt = coachRepository.findById(coachId);
        if (coachOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Coach not found.");
        }

        Client client = clientOpt.get();
        Coach coach = coachOpt.get();

        Review review = new Review();
        review.setRating(rating);
        review.setComment(comment);
        review.setDate(LocalDate.now());
        review.setClient(client);
        review.setCoach(coach);

        reviewRepository.save(review);

        return ResponseEntity.ok("Review submitted successfully.");
    }
}