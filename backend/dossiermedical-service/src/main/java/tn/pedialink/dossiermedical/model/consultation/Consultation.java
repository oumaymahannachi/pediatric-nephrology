package tn.pedialink.dossiermedical.model.consultation;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "consultations")
public class Consultation {
    @Id
    private String id;
    private String patientId;
    private String medecinId;
    private LocalDateTime dateRendezVous;
    private String motifConsultation;
    private String observationsCliniques;
    private String diagnostic;
    private String recommandations;
    private String compteRendu;
    private StatutConsultation statut;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
