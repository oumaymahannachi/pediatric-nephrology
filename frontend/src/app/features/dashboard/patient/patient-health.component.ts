import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { TraitementService } from '../../../core/services/traitement.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Prescription } from '../../../core/models/prescription.models';
import { TraitementChronique } from '../../../core/models/traitement.models';

@Component({
  selector: 'app-patient-health',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="health-dashboard">
      <h2>Mon Suivi Médical</h2>
      
      <!-- Résumé des notifications -->
      <div class="summary-card notifications-summary">
        <div class="card-icon">🔔</div>
        <div class="card-content">
          <h3>{{ notificationCount }}</h3>
          <p>Notifications non lues</p>
        </div>
        <a routerLink="/notifications" class="card-link">Voir tout</a>
      </div>
      
      <!-- Résumé des prescriptions -->
      <div class="summary-section">
        <div class="section-header">
          <h3>Prescriptions Actives</h3>
          <a routerLink="/prescriptions" class="view-all">Voir tout</a>
        </div>
        
        <div *ngIf="loadingPrescriptions" class="loading">Chargement...</div>
        
        <div *ngIf="!loadingPrescriptions && prescriptions.length === 0" class="empty">
          Aucune prescription active
        </div>
        
        <div class="card-grid">
          <div *ngFor="let prescription of prescriptions.slice(0, 3)" class="mini-card">
            <div class="mini-card-header">
              <strong>{{ prescription.diagnostic }}</strong>
              <span class="status-badge" [class]="'status-' + prescription.statut.toLowerCase()">
                {{ prescription.statut }}
              </span>
            </div>
            <p class="mini-card-info">
              {{ prescription.medicaments.length }} médicament(s)
            </p>
            <p class="mini-card-date">
              Expire le {{ prescription.dateExpiration | date:'dd/MM/yyyy' }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Résumé des traitements -->
      <div class="summary-section">
        <div class="section-header">
          <h3>Traitements Chroniques</h3>
          <a routerLink="/traitements" class="view-all">Voir tout</a>
        </div>
        
        <div *ngIf="loadingTraitements" class="loading">Chargement...</div>
        
        <div *ngIf="!loadingTraitements && traitements.length === 0" class="empty">
          Aucun traitement chronique
        </div>
        
        <div class="card-grid">
          <div *ngFor="let traitement of traitements.slice(0, 3)" class="mini-card">
            <div class="mini-card-header">
              <strong>{{ traitement.nomTraitement }}</strong>
              <span class="active-badge" *ngIf="traitement.actif">Actif</span>
            </div>
            <p class="mini-card-info">
              {{ traitement.pathologie }}
            </p>
            <p class="mini-card-date" *ngIf="traitement.dateProchainRenouvellement">
              Renouvellement: {{ traitement.dateProchainRenouvellement | date:'dd/MM/yyyy' }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Actions rapides -->
      <div class="quick-actions">
        <h3>Actions Rapides</h3>
        <div class="action-buttons">
          <button routerLink="/prescriptions" class="action-btn">
            📋 Mes Prescriptions
          </button>
          <button routerLink="/traitements" class="action-btn">
            💊 Mes Traitements
          </button>
          <button routerLink="/notifications" class="action-btn">
            🔔 Notifications
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .health-dashboard {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .notifications-summary {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    
    .card-icon {
      font-size: 48px;
    }
    
    .card-content h3 {
      font-size: 36px;
      margin: 0;
    }
    
    .card-content p {
      margin: 5px 0 0 0;
      opacity: 0.9;
    }
    
    .card-link {
      margin-left: auto;
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
    }
    
    .card-link:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .summary-section {
      margin-bottom: 30px;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .view-all {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
    }
    
    .view-all:hover {
      text-decoration: underline;
    }
    
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 15px;
    }
    
    .mini-card {
      padding: 15px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: box-shadow 0.2s;
    }
    
    .mini-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .mini-card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }
    
    .status-badge, .active-badge {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    
    .status-active {
      background: #d4edda;
      color: #155724;
    }
    
    .status-expiree {
      background: #f8d7da;
      color: #721c24;
    }
    
    .active-badge {
      background: #28a745;
      color: white;
    }
    
    .mini-card-info {
      color: #666;
      font-size: 14px;
      margin: 5px 0;
    }
    
    .mini-card-date {
      color: #999;
      font-size: 12px;
      margin: 5px 0 0 0;
    }
    
    .quick-actions {
      margin-top: 40px;
    }
    
    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    
    .action-btn {
      padding: 15px;
      background: white;
      border: 2px solid #667eea;
      color: #667eea;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .action-btn:hover {
      background: #667eea;
      color: white;
    }
    
    .loading, .empty {
      text-align: center;
      padding: 20px;
      color: #999;
    }
  `]
})
export class PatientHealthComponent implements OnInit {
  prescriptions: Prescription[] = [];
  traitements: TraitementChronique[] = [];
  notificationCount = 0;
  
  loadingPrescriptions = false;
  loadingTraitements = false;

  constructor(
    private prescriptionService: PrescriptionService,
    private traitementService: TraitementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPrescriptions();
    this.loadTraitements();
    this.loadNotificationCount();
  }

  loadPrescriptions(): void {
    this.loadingPrescriptions = true;
    this.prescriptionService.getMesPrescriptions().subscribe({
      next: (response) => {
        this.prescriptions = response.data.filter(p => p.statut === 'ACTIVE');
        this.loadingPrescriptions = false;
      },
      error: (err) => {
        console.error('Erreur chargement prescriptions:', err);
        this.loadingPrescriptions = false;
      }
    });
  }

  loadTraitements(): void {
    this.loadingTraitements = true;
    this.traitementService.getMesTraitementsActifs().subscribe({
      next: (response) => {
        this.traitements = response.data;
        this.loadingTraitements = false;
      },
      error: (err) => {
        console.error('Erreur chargement traitements:', err);
        this.loadingTraitements = false;
      }
    });
  }

  loadNotificationCount(): void {
    this.notificationService.notificationCount$.subscribe(count => {
      this.notificationCount = count;
    });
    this.notificationService.refreshNotificationCount();
  }
}
