import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../core/services/prescription.service';
import { Prescription } from '../../core/models/prescription.models';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="prescription-container">
      <h2>Mes Prescriptions</h2>
      
      <div *ngIf="loading" class="loading">Chargement...</div>
      
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div *ngIf="!loading && prescriptions.length === 0" class="empty">
        Aucune prescription trouvée
      </div>
      
      <div class="prescription-list">
        <div *ngFor="let prescription of prescriptions" class="prescription-card">
          <div class="prescription-header">
            <h3>{{ prescription.diagnostic }}</h3>
            <span class="status" [class]="'status-' + prescription.statut.toLowerCase()">
              {{ prescription.statut }}
            </span>
          </div>
          
          <div class="prescription-info">
            <p><strong>Date:</strong> {{ prescription.datePrescription | date:'dd/MM/yyyy' }}</p>
            <p><strong>Expiration:</strong> {{ prescription.dateExpiration | date:'dd/MM/yyyy' }}</p>
            <p *ngIf="prescription.notes"><strong>Notes:</strong> {{ prescription.notes }}</p>
          </div>
          
          <div class="medicaments">
            <h4>Médicaments ({{ prescription.medicaments.length }})</h4>
            <ul>
              <li *ngFor="let med of prescription.medicaments">
                <strong>{{ med.nomCommercial }}</strong> - {{ med.dosage }}
                <br>
                <small>{{ med.posologie.quantite }} {{ med.posologie.unite }} - {{ med.posologie.frequence }}</small>
              </li>
            </ul>
          </div>
          
          <div class="actions" *ngIf="prescription.renouvelable && prescription.statut === 'ACTIVE'">
            <button (click)="renouveler(prescription.id)" class="btn-renouveler">
              Renouveler
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .prescription-container {
      padding: 20px;
    }
    
    .prescription-list {
      display: grid;
      gap: 20px;
      margin-top: 20px;
    }
    
    .prescription-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background: white;
    }
    
    .prescription-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .status {
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    
    .status-active { background: #d4edda; color: #155724; }
    .status-expiree { background: #f8d7da; color: #721c24; }
    .status-terminee { background: #d1ecf1; color: #0c5460; }
    
    .medicaments ul {
      list-style: none;
      padding: 0;
    }
    
    .medicaments li {
      padding: 10px;
      border-left: 3px solid #007bff;
      margin-bottom: 10px;
      background: #f8f9fa;
    }
    
    .btn-renouveler {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-renouveler:hover {
      background: #0056b3;
    }
    
    .loading, .error, .empty {
      text-align: center;
      padding: 20px;
    }
    
    .error {
      color: #dc3545;
    }
  `]
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: Prescription[] = [];
  loading = false;
  error: string | null = null;

  constructor(private prescriptionService: PrescriptionService) {}

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    this.loading = true;
    this.prescriptionService.getMesPrescriptions().subscribe({
      next: (response) => {
        this.prescriptions = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des prescriptions';
        this.loading = false;
        console.error(err);
      }
    });
  }

  renouveler(id: string): void {
    this.prescriptionService.renouvelerPrescription(id).subscribe({
      next: () => {
        alert('Prescription renouvelée avec succès');
        this.loadPrescriptions();
      },
      error: (err) => {
        alert('Erreur lors du renouvellement');
        console.error(err);
      }
    });
  }
}
