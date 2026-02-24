export interface TraitementChronique {
  id: string;
  patientId: string;
  medecinPrescripteurId: string;
  nomTraitement: string;
  pathologie: string;
  dateDebut: string;
  dateFinPrevue?: string;
  dateFinEffective?: string;
  actif: boolean;
  medicaments: MedicamentChronique[];
  dureeEntreRenouvellementsJours: number;
  dateDernierRenouvellement?: string;
  dateProchainRenouvellement?: string;
  historiqueRenouvellements: Renouvellement[];
  bilansProgrammes: Bilan[];
  historiqueObservance: Observance[];
  notesEvolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicamentChronique {
  nomCommercial: string;
  dci: string;
  dosage: string;
  posologie: any;
  medicamentPrincipal: boolean;
}

export interface Renouvellement {
  dateRenouvellement: string;
  prescriptionId: string;
  medecinId: string;
  nombreUnitesDelivrees: number;
  pharmacienId: string;
  avecConsultation: boolean;
  notes?: string;
}

export interface Bilan {
  typeBilan: string;
  description: string;
  datePrevue: string;
  dateRealisation?: string;
  resultat?: string;
  realise: boolean;
  alerteSiAnomalie?: string;
}

export interface Observance {
  date: string;
  pris: boolean;
  heurePrise?: number;
  commentaire?: string;
  quantitePrise?: number;
  oublie?: boolean;
  prisHorsHoraire?: boolean;
}

export interface TraitementCreateRequest {
  patientId: string;
  nomTraitement: string;
  pathologie: string;
  dateDebut: string;
  dateFinPrevue?: string;
  medicaments: MedicamentChroniqueRequest[];
  dureeEntreRenouvellementsJours: number;
  bilansProgrammes?: BilanRequest[];
}

export interface MedicamentChroniqueRequest {
  nomCommercial: string;
  dci: string;
  dosage: string;
  posologie: any;
  medicamentPrincipal: boolean;
}

export interface BilanRequest {
  typeBilan: string;
  description: string;
  datePrevue: string;
  alerteSiAnomalie?: string;
}
