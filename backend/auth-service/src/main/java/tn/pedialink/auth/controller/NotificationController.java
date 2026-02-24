package tn.pedialink.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import tn.pedialink.auth.dto.ApiMessage;
import tn.pedialink.auth.dto.NotificationCreateRequest;
import tn.pedialink.auth.dto.NotificationResponse;
import tn.pedialink.auth.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponse> creerNotification(
            @Valid @RequestBody NotificationCreateRequest request) {
        NotificationResponse response = notificationService.creerNotification(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/non-lues")
    public ResponseEntity<List<NotificationResponse>> getNotificationsNonLues() {
        String userId = getCurrentUserId();
        List<NotificationResponse> notifications = notificationService.getNotificationsNonLues(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/compteur")
    public ResponseEntity<Long> getNombreNotificationsNonLues() {
        String userId = getCurrentUserId();
        long count = notificationService.getNombreNotificationsNonLues(userId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/lue")
    public ResponseEntity<ApiMessage> marquerCommeLue(@PathVariable String id) {
        notificationService.marquerCommeLue(id);
        return ResponseEntity.ok(new ApiMessage("Notification marquée comme lue"));
    }

    @PutMapping("/tout-lu")
    public ResponseEntity<ApiMessage> marquerToutCommeLu() {
        String userId = getCurrentUserId();
        List<NotificationResponse> nonLues = notificationService.getNotificationsNonLues(userId);
        nonLues.forEach(n -> notificationService.marquerCommeLue(n.getId()));
        return ResponseEntity.ok(new ApiMessage("Toutes les notifications marquées comme lues"));
    }

    private String getCurrentUserId() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
