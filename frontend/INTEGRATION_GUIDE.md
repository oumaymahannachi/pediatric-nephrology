# Guide d'intégration des microservices Prescription et Notification

## 📋 Vue d'ensemble

Ce guide explique comment intégrer les microservices **Prescription** et **Notification** dans le frontend Angular.

## 🗂️ Fichiers créés

### Modèles (Models)
- `src/app/core/models/prescription.models.ts` - Types pour les prescriptions
- `src/app/core/models/traitement.models.ts` - Types pour les traitements chroniques
- `src/app/core/models/notification.models.ts` - Types pour les notifications

### Services
- `src/app/core/services/prescription.service.ts` - Service API pour les prescriptions
- `src/app/core/services/traitement.service.ts` - Service API pour les traitements
- `src/app/core/services/notification.service.ts` - Service API pour les notifications

### Composants

#### Prescriptions
- `src/app/features/prescriptions/prescription-list.component.ts` - Liste des prescriptions
- `src/app/features/prescriptions/prescription-routes.ts` - Routes

#### Traitements
- `src/app/features/traitements/traitement-list.component.ts` - Liste des traitements chroniques
- `src/app/features/traitements/traitement-routes.ts` - Routes

#### Notifications
- `src/app/features/notifications/notification-list.component.ts` - Liste des notifications
- `src/app/features/notifications/notification-badge.component.ts` - Badge de notification
- `src/app/features/notifications/notification-routes.ts` - Routes

## 🔧 Étapes d'intégration

### 1. Mettre à jour les routes principales

Ajoutez les nouvelles routes dans `src/app/app.routes.ts` :

```typescript
import { traitementRoutes } from './features/traitements/traitement-routes';
import { prescriptionRoutes } from './features/prescriptions/prescription-routes';
import { notificationRoutes } from './features/notifications/notification-routes';

export const routes: Routes = [
  // ... routes existantes ...
  
  // Nouvelles routes
  ...traitementRoutes,
  ...prescriptionRoutes,
  ...notificationRoutes,
  
  { path: '**', redirectTo: '' }
];
```

### 2. Ajouter le badge de notification dans le header

Dans votre composant de navigation/header, ajoutez :

```typescript
import { NotificationBadgeComponent } from './features/notifications/notification-badge.component';

@Component({
  // ...
  imports: [CommonModule, NotificationBadgeComponent],
  template: `
    <nav>
      <!-- Votre navigation existante -->
      <app-notification-badge></app-notification-badge>
    </nav>
  `
})
```

### 3. Ajouter des liens de navigation

Ajoutez ces liens dans votre menu de navigation :

```html
<a routerLink="/prescriptions">Mes Prescriptions</a>
<a routerLink="/traitements">Mes Traitements</a>
<a routerLink="/notifications">Notifications</a>
```

### 4. Configuration de l'environnement

Vérifiez que `src/environments/environment.ts` contient :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

## 📡 Endpoints API utilisés

### Prescriptions (`/api/v1/prescriptions`)
- `POST /` - Créer une prescription
- `GET /patient/{patientId}` - Obtenir les prescriptions d'un patient
- `GET /{id}` - Obtenir une prescription
- `POST /{id}/renouveler` - Renouveler une prescription
- `GET /moi` - Obtenir mes prescriptions

### Traitements (`/api/v1/traitements`)
- `POST /` - Créer un traitement chronique
- `GET /patient/{patientId}/actifs` - Obtenir les traitements actifs
- `POST /{id}/renouveler` - Enregistrer un renouvellement
- `POST /{id}/observance` - Enregistrer l'observance
- `POST /{id}/bilans/{type}/realise` - Marquer un bilan comme réalisé
- `GET /moi/actifs` - Obtenir mes traitements actifs

### Notifications (`/api/v1/notifications`)
- `POST /` - Créer une notification
- `GET /non-lues` - Obtenir les notifications non lues
- `GET /compteur` - Obtenir le nombre de notifications non lues
- `PUT /{id}/lue` - Marquer comme lue
- `PUT /tout-lu` - Tout marquer comme lu

## 🎨 Personnalisation

### Styles
Tous les composants utilisent des styles inline. Pour personnaliser :

1. Créez des fichiers SCSS séparés
2. Utilisez vos variables de thème existantes
3. Adaptez les couleurs et espacements

### Fonctionnalités supplémentaires

#### Pour les prescriptions :
- Ajouter un formulaire de création de prescription
- Afficher les détails complets d'une prescription
- Filtrer par statut
- Recherche

#### Pour les traitements :
- Calendrier d'observance
- Graphiques de suivi
- Alertes de renouvellement
- Historique détaillé

#### Pour les notifications :
- Notifications en temps réel (WebSocket)
- Sons et vibrations
- Filtres par type
- Archivage

## 🔐 Sécurité

Les services utilisent automatiquement le token JWT via l'intercepteur HTTP existant. Assurez-vous que :

1. L'intercepteur JWT est configuré
2. Le token est stocké dans localStorage
3. Les guards d'authentification sont actifs

## 🧪 Tests

Pour tester les composants :

```bash
# Démarrer le backend
cd backend
docker-compose up

# Démarrer le frontend
cd frontend
npm start
```

Accédez à :
- http://localhost:4200/prescriptions
- http://localhost:4200/traitements
- http://localhost:4200/notifications

## 📝 Exemple d'utilisation dans un dashboard

```typescript
import { Component } from '@angular/core';
import { PrescriptionListComponent } from '../prescriptions/prescription-list.component';
import { TraitementListComponent } from '../traitements/traitement-list.component';
import { NotificationBadgeComponent } from '../notifications/notification-badge.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    PrescriptionListComponent,
    TraitementListComponent,
    NotificationBadgeComponent
  ],
  template: `
    <div class="dashboard">
      <header>
        <h1>Mon Espace Patient</h1>
        <app-notification-badge></app-notification-badge>
      </header>
      
      <div class="dashboard-content">
        <section>
          <app-prescription-list></app-prescription-list>
        </section>
        
        <section>
          <app-traitement-list></app-traitement-list>
        </section>
      </div>
    </div>
  `
})
export class PatientDashboardComponent {}
```

## 🐛 Dépannage

### Erreur CORS
Vérifiez la configuration CORS dans le backend (API Gateway).

### Token non envoyé
Vérifiez l'intercepteur HTTP dans `src/app/core/interceptors/`.

### Routes non trouvées
Assurez-vous que les routes sont bien importées dans `app.routes.ts`.

## 📚 Ressources

- [Documentation Angular](https://angular.io/docs)
- [API Backend Documentation](../backend/README.md)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
