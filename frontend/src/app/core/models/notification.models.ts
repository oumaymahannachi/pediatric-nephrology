export interface Notification {
  id: string;
  destinataireId: string;
  destinataireType: string;
  type: TypeNotification;
  priorite: Priorite;
  titre: string;
  message: string;
  actionUrl?: string;
  canal: CanalNotification;
  historiqueEnvois: Envoi[];
  lue: boolean;
  dateLecture?: string;
  actionRequise: boolean;
  actionEffectuee?: string;
  dateAction?: string;
  dateDeclenchement?: string;
  recurrente: boolean;
  patternRecurrence?: string;
  referenceId?: string;
  referenceType?: string;
  dateCreation: string;
  dateModification: string;
}

export enum TypeNotification {
  RAPPEL_RDV = 'RAPPEL_RDV',
  ALERTE_RENOUVELLEMENT = 'ALERTE_RENOUVELLEMENT',
  RAPPEL_PRISE_MEDICAMENT = 'RAPPEL_PRISE_MEDICAMENT',
  ALERTE_INTERACTION = 'ALERTE_INTERACTION',
  ALERTE_CONTRE_INDICATION = 'ALERTE_CONTRE_INDICATION',
  RAPPEL_BILAN = 'RAPPEL_BILAN',
  PRESCRIPTION_EXPIREE = 'PRESCRIPTION_EXPIREE',
  TRAITEMENT_TERMINE = 'TRAITEMENT_TERMINE',
  MESSAGE_MEDECIN = 'MESSAGE_MEDECIN',
  RESULTAT_BILAN_DISPONIBLE = 'RESULTAT_BILAN_DISPONIBLE',
  ALERTE_OBSERVANCE = 'ALERTE_OBSERVANCE'
}

export enum Priorite {
  BASSE = 'BASSE',
  NORMALE = 'NORMALE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}

export enum CanalNotification {
  PUSH = 'PUSH',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP'
}

export enum StatutEnvoi {
  EN_ATTENTE = 'EN_ATTENTE',
  ENVOYEE = 'ENVOYEE',
  LUE = 'LUE',
  ECHOUEE = 'ECHOUEE',
  DESACTIVEE = 'DESACTIVEE'
}

export interface Envoi {
  canal: CanalNotification;
  dateEnvoi: string;
  statut: StatutEnvoi;
  erreur?: string;
  messageId?: string;
}

export interface NotificationCreateRequest {
  destinataireId: string;
  destinataireType: string;
  type: TypeNotification;
  priorite: Priorite;
  titre: string;
  message: string;
  actionUrl?: string;
  canal: CanalNotification;
  actionRequise?: boolean;
  dateDeclenchement?: string;
  recurrente?: boolean;
  patternRecurrence?: string;
  referenceId?: string;
  referenceType?: string;
}
