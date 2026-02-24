# Exemples d'utilisation des services Prescription et Notification

## 📋 Table des matières
1. [Service Prescription](#service-prescription)
2. [Service Traitement](#service-traitement)
3. [Service Notification](#service-notification)
4. [Intégration dans les composants](#intégration-dans-les-composants)

---

## Service Prescription

### Créer une prescription

```typescript
import { Component } from '@angular/core';
import { PrescriptionService } from './core/services/prescription.service';
import { PrescriptionCreateRequest } from './core/models/prescription.models';

@Component({...})
export class CreatePrescriptionComponent {
  constructor(private prescriptionService: PrescriptionService) {}

  creerPrescription() {
    const request: PrescriptionCreateRequest = {
      patientId: 'patient-123',
      diagnostic: 'Infection respiratoire',
      medicaments: [
        {
          nomCommercial: 'Amoxicilline',
          dci: 'Amoxicilline',
          formePharmaceutique: 'Comprimé',
          dosage: '500mg',
          posologie: {
            quantite: 1,
            unite: 'comprimé',
            frequence: '3 fois par jour',
            momentPrise: 'Après les repas',
            dureeTraitementJours: 7,
            isPediatrique: false
          },
          substitutable: true
        }
      ],
      notes: 'Bien respecter la durée du traitement',
      dureeValiditeJours: 30,
      renouvelable: false
    };

    this.prescriptionService.creerPrescription(request).subscribe({
      next: (response) => {
        console.log('Prescription créée:', response.data);
        alert('Prescription créée avec succès!');
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors de la création');
      }
    });
  }
}
```

### Obtenir les prescriptions d'un patient

```typescript
loadPrescriptions(patientId: string) {
  this.prescriptionService.getPrescriptionsPatient(patientId).subscribe({
    next: (response) => {
      this.prescriptions = response.data;
      console.log(`${this.prescriptions.length} prescriptions trouvées`);
    },
    error: (err) => console.error(err)
  });
}
```

### Renouveler une prescription

```typescript
renouvelerPrescription(prescriptionId: string) {
  this.prescriptionService.renouvelerPrescription(prescriptionId).subscribe({
    next: (response) => {
      console.log('Nouvelle prescription:', response.data);
      alert('Prescription renouvelée!');
    },
    error: (err) => {
      console.error(err);
      alert('Impossible de renouveler cette prescription');
    }
  });
}
```

---

## Service Traitement

### Créer un traitement chronique

```typescript
import { TraitementService } from './core/services/traitement.service';
import { TraitementCreateRequest } from './core/models/traitement.models';

@Component({...})
export class CreateTraitementComponent {
  constructor(private traitementService: TraitementService) {}

  creerTraitement() {
    const request: TraitementCreateRequest = {
      patientId: 'patient-123',
      nomTraitement: 'Traitement Asthme',
      pathologie: 'Asthme persistant modéré',
      dateDebut: '2024-01-15',
      medicaments: [
        {
          nomCommercial: 'Ventoline',
          dci: 'Salbutamol',
          dosage: '100µg',
          posologie: {
            quantite: 2,
            unite: 'bouffées',
            frequence: '4 fois par jour',
            momentPrise: 'Matin, midi, soir, coucher',
            dureeTraitementJours: 365,
            isPediatrique: true,
            poidsPatientKg: 25
          },
          medicamentPrincipal: true
        }
      ],
      dureeEntreRenouvellementsJours: 30,
      bilansProgrammes: [
        {
          typeBilan: 'Spirométrie',
          description: 'Contrôle fonction respiratoire',
          datePrevue: '2024-04-15',
          alerteSiAnomalie: 'Contacter le médecin immédiatement'
        }
      ]
    };

    this.traitementService.creerTraitement(request).subscribe({
      next: (response) => {
        console.log('Traitement créé:', response.data);
      },
      error: (err) => console.error(err)
    });
  }
}
```

### Enregistrer l'observance (prise de médicament)

```typescript
enregistrerPrise(traitementId: string, pris: boolean) {
  const today = new Date().toISOString().split('T')[0];
  const heure = new Date().getHours();

  this.traitementService.enregistrerObservance(
    traitementId,
    today,
    pris,
    heure,
    pris ? 'Pris à l\'heure' : 'Oublié'
  ).subscribe({
    next: () => {
      console.log('Observance enregistrée');
      alert(pris ? '✓ Prise confirmée' : '✗ Oubli enregistré');
    },
    error: (err) => console.error(err)
  });
}
```

### Marquer un bilan comme réalisé

```typescript
marquerBilanRealise(traitementId: string, typeBilan: string) {
  const today = new Date().toISOString().split('T')[0];

  this.traitementService.marquerBilanRealise(
    traitementId,
    typeBilan,
    today,
    'Résultats normaux'
  ).subscribe({
    next: () => {
      console.log('Bilan marqué comme réalisé');
    },
    error: (err) => console.error(err)
  });
}
```

---

## Service Notification

### Créer une notification

```typescript
import { NotificationService } from './core/services/notification.service';
import { 
  NotificationCreateRequest, 
  TypeNotification, 
  Priorite, 
  CanalNotification 
} from './core/models/notification.models';

@Component({...})
export class NotificationComponent {
  constructor(private notificationService: NotificationService) {}

  creerNotification() {
    const request: NotificationCreateRequest = {
      destinataireId: 'patient-123',
      destinataireType: 'PATIENT',
      type: TypeNotification.RAPPEL_PRISE_MEDICAMENT,
      priorite: Priorite.HAUTE,
      titre: 'Rappel de prise de médicament',
      message: 'N\'oubliez pas de prendre votre Ventoline',
      canal: CanalNotification.IN_APP,
      actionRequise: true,
      referenceId: 'traitement-456',
      referenceType: 'TRAITEMENT'
    };

    this.notificationService.creerNotification(request).subscribe({
      next: (response) => {
        console.log('Notification créée:', response.data);
      },
      error: (err) => console.error(err)
    });
  }
}
```

### Obtenir les notifications non lues

```typescript
loadNotifications() {
  this.notificationService.getNotificationsNonLues().subscribe({
    next: (response) => {
      this.notifications = response.data;
      console.log(`${this.notifications.length} notifications non lues`);
    },
    error: (err) => console.error(err)
  });
}
```

### Marquer une notification comme lue

```typescript
marquerLue(notificationId: string) {
  this.notificationService.marquerCommeLue(notificationId).subscribe({
    next: () => {
      console.log('Notification marquée comme lue');
      // Le compteur se met à jour automatiquement via le BehaviorSubject
    },
    error: (err) => console.error(err)
  });
}
```

### Écouter le compteur de notifications

```typescript
ngOnInit() {
  // S'abonner au compteur de notifications
  this.notificationService.notificationCount$.subscribe(count => {
    this.notificationCount = count;
    console.log(`${count} notifications non lues`);
  });

  // Rafraîchir le compteur
  this.notificationService.refreshNotificationCount();
}
```

---

## Intégration dans les composants

### Exemple de dashboard patient complet

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../core/services/prescription.service';
import { TraitementService } from '../../core/services/traitement.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Badge de notification -->
      <div class="notification-badge" (click)="openNotifications()">
        🔔 <span *ngIf="notificationCount > 0">{{ notificationCount }}</span>
      </div>

      <!-- Prescriptions actives -->
      <section>
        <h2>Prescriptions Actives ({{ prescriptions.length }})</h2>
        <div *ngFor="let p of prescriptions">
          {{ p.diagnostic }} - Expire le {{ p.dateExpiration | date }}
        </div>
      </section>

      <!-- Traitements chroniques -->
      <section>
        <h2>Traitements Chroniques ({{ traitements.length }})</h2>
        <div *ngFor="let t of traitements">
          {{ t.nomTraitement }} - {{ t.pathologie }}
          <button (click)="enregistrerPrise(t.id, true)">✓ Pris</button>
        </div>
      </section>
    </div>
  `
})
export class PatientDashboardComponent implements OnInit {
  prescriptions: any[] = [];
  traitements: any[] = [];
  notificationCount = 0;

  constructor(
    private prescriptionService: PrescriptionService,
    private traitementService: TraitementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Charger les données
    this.loadPrescriptions();
    this.loadTraitements();
    this.setupNotifications();
  }

  loadPrescriptions() {
    this.prescriptionService.getMesPrescriptions().subscribe({
      next: (res) => this.prescriptions = res.data.filter(p => p.statut === 'ACTIVE')
    });
  }

  loadTraitements() {
    this.traitementService.getMesTraitementsActifs().subscribe({
      next: (res) => this.traitements = res.data
    });
  }

  setupNotifications() {
    this.notificationService.notificationCount$.subscribe(
      count => this.notificationCount = count
    );
    this.notificationService.refreshNotificationCount();
  }

  enregistrerPrise(traitementId: string, pris: boolean) {
    const today = new Date().toISOString().split('T')[0];
    this.traitementService.enregistrerObservance(traitementId, today, pris)
      .subscribe(() => alert('Prise enregistrée!'));
  }

  openNotifications() {
    // Navigation vers /notifications
  }
}
```

### Exemple de composant médecin pour créer une prescription

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PrescriptionService } from '../../core/services/prescription.service';

@Component({
  selector: 'app-create-prescription',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="patientId" placeholder="ID Patient">
      <input formControlName="diagnostic" placeholder="Diagnostic">
      <textarea formControlName="notes" placeholder="Notes"></textarea>
      
      <!-- Formulaire pour les médicaments -->
      <div formArrayName="medicaments">
        <!-- ... -->
      </div>
      
      <button type="submit">Créer la prescription</button>
    </form>
  `
})
export class CreatePrescriptionComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService
  ) {
    this.form = this.fb.group({
      patientId: [''],
      diagnostic: [''],
      notes: [''],
      medicaments: this.fb.array([])
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.prescriptionService.creerPrescription(this.form.value).subscribe({
        next: () => alert('Prescription créée!'),
        error: (err) => console.error(err)
      });
    }
  }
}
```

---

## 🔄 Rafraîchissement automatique

Pour rafraîchir automatiquement les données :

```typescript
ngOnInit() {
  // Charger initialement
  this.loadData();

  // Rafraîchir toutes les 60 secondes
  setInterval(() => {
    this.loadData();
  }, 60000);
}

loadData() {
  this.prescriptionService.getMesPrescriptions().subscribe(...);
  this.traitementService.getMesTraitementsActifs().subscribe(...);
  this.notificationService.refreshNotificationCount();
}
```

---

## 🎯 Bonnes pratiques

1. **Gestion des erreurs** : Toujours gérer les erreurs dans les subscriptions
2. **Unsubscribe** : Utiliser `takeUntil` ou `async pipe` pour éviter les fuites mémoire
3. **Loading states** : Afficher un indicateur de chargement
4. **Cache** : Considérer le cache pour les données fréquemment accédées
5. **Optimistic UI** : Mettre à jour l'UI avant la réponse du serveur pour une meilleure UX
