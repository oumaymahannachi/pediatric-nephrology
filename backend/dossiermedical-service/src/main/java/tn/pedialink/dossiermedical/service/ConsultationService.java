package tn.pedialink.dossiermedical.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.pedialink.dossiermedical.dto.ConsultationDto;
import tn.pedialink.dossiermedical.model.consultation.Consultation;
import tn.pedialink.dossiermedical.repository.ConsultationRepository;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final ConsultationRepository consultationRepository;

    public Consultation createConsultation(ConsultationDto dto) {
        Consultation consultation = new Consultation();
        consultation.setPatientId(dto.getPatientId());
        consultation.setMedecinId(dto.getMedecinId());
        consultation.setDateRendezVous(dto.getDateRendezVous());
        consultation.setMotifConsultation(dto.getMotifConsultation());
        consultation.setObservationsCliniques(dto.getObservationsCliniques());
        consultation.setDiagnostic(dto.getDiagnostic());
        consultation.setRecommandations(dto.getRecommandations());
        consultation.setCompteRendu(dto.getCompteRendu());
        consultation.setStatut(dto.getStatut());
        consultation.setCreatedAt(LocalDateTime.now());
        consultation.setUpdatedAt(LocalDateTime.now());
        return consultationRepository.save(consultation);
    }

    public Consultation updateConsultation(String id, ConsultationDto dto) {
        Consultation consultation = consultationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));
        consultation.setDateRendezVous(dto.getDateRendezVous());
        consultation.setMotifConsultation(dto.getMotifConsultation());
        consultation.setObservationsCliniques(dto.getObservationsCliniques());
        consultation.setDiagnostic(dto.getDiagnostic());
        consultation.setRecommandations(dto.getRecommandations());
        consultation.setCompteRendu(dto.getCompteRendu());
        consultation.setStatut(dto.getStatut());
        consultation.setUpdatedAt(LocalDateTime.now());
        return consultationRepository.save(consultation);
    }

    public Consultation getConsultationById(String id) {
        return consultationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));
    }

    public List<Consultation> getConsultationsByPatient(String patientId) {
        return consultationRepository.findByPatientId(patientId);
    }

    public List<Consultation> getConsultationsByMedecin(String medecinId) {
        return consultationRepository.findByMedecinId(medecinId);
    }

    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public void deleteConsultation(String id) {
        consultationRepository.deleteById(id);
    }
}
