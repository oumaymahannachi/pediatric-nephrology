package tn.pedialink.dossiermedical.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.pedialink.dossiermedical.dto.ApiResponse;
import tn.pedialink.dossiermedical.dto.ConsultationDto;
import tn.pedialink.dossiermedical.model.consultation.Consultation;
import tn.pedialink.dossiermedical.service.ConsultationService;
import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {
    private final ConsultationService consultationService;

    @PostMapping
    public ResponseEntity<ApiResponse> createConsultation(@Valid @RequestBody ConsultationDto dto) {
        Consultation consultation = consultationService.createConsultation(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse(true, "Consultation créée avec succès", consultation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateConsultation(@PathVariable String id, @Valid @RequestBody ConsultationDto dto) {
        Consultation consultation = consultationService.updateConsultation(id, dto);
        return ResponseEntity.ok(new ApiResponse(true, "Consultation mise à jour", consultation));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getConsultationById(@PathVariable String id) {
        Consultation consultation = consultationService.getConsultationById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Consultation trouvée", consultation));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse> getConsultationsByPatient(@PathVariable String patientId) {
        List<Consultation> consultations = consultationService.getConsultationsByPatient(patientId);
        return ResponseEntity.ok(new ApiResponse(true, "Consultations du patient", consultations));
    }

    @GetMapping("/medecin/{medecinId}")
    public ResponseEntity<ApiResponse> getConsultationsByMedecin(@PathVariable String medecinId) {
        List<Consultation> consultations = consultationService.getConsultationsByMedecin(medecinId);
        return ResponseEntity.ok(new ApiResponse(true, "Consultations du médecin", consultations));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllConsultations() {
        List<Consultation> consultations = consultationService.getAllConsultations();
        return ResponseEntity.ok(new ApiResponse(true, "Liste des consultations", consultations));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteConsultation(@PathVariable String id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.ok(new ApiResponse(true, "Consultation supprimée", null));
    }
}
