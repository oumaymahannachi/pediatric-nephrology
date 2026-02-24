import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TraitementService } from '../../core/services/traitement.service';
import { TraitementChronique } from '../../core/models/traitement.models';

@Component({
  selector: 'app-traitement-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="traitement-container">
      <h2>Mes Traitements Chroniques</h2>
      
      <div *ngIf="loading" class="loading">Chargement...</div>
      
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div *ngIf="!loading && traitements.length === 0" class="empty">
        Aucun traitement actif
      </div>
      
      <div class="traitement-list">
        <div *ngFor="let traitement of traitements" class="traitement-card">
          <div class="traitement-header">
            <h3>{{ traitement.nomTraitement }}</h3>
            <span class="badge" [class.active]="traitement.actif">
              {{ traitement.actif ? 'Actif' : 'Inactif' }}
            </span>
          </div>
          
          <div class="traitement-info">
            <p><strong>Pathologie:</strong> {{ traitement.pathologie }}</p>
            <p><strong>Début:</strong> {{ traitement.dateDebut | date:'dd/MM/yyyy' }}</p>
            <p *ngIf="traitement.dateProchainRenouvellement">
              <strong>Prochain renouvellement:</strong> 
              {{ traitement.dateProchainRenouvellement | date:'dd/MM/yyyy' }}
            </p>
          </div>
          
          <div class="medicaments">
            <h4>Médicaments</h4>
            <ul>
              <li *ngFor="let med of traitement.medicaments">
                <strong>{{ med.nomCommercial }}</strong> ({{ med.dci }})
                <br>
                <small>{{ med.dosage }}</small>
                <span *ngIf="med.medicamentPrincipal" class="principal">Principal</span>
              </li>
            </ul>
          </div>
          
          <div class="observance-section" *ngIf="traitement.actif">
            <h4>Enregistrer la prise</h4>
            <div class="observance-form">
              <input type="date" [(ngModel)]="observanceDate" class="form-control">
              <button (click)="enregistrerPrise(traitement.id, true)" class="btn-success">
                ✓ Pris
              </button>
              <button (click)="enregistrerPrise(traitement.id, false)" class="btn-danger">
                ✗ Oublié
              </button>
            </div>
          </div>
          
          <div class="bilans" *ngIf="traitement.bilansProgrammes.length > 0">
            <h4>Bilans programmés</h4>
            <ul>
              <li *ngFor="let bilan of traitement.bilansProgrammes">
                {{ bilan.typeBilan }} - 
                {{ bilan.datePrevue | date:'dd/MM/yyyy' }}
                <span *ngIf="bilan.realise" class="realise">✓ Réalisé</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .traitement-container {
      padding: 20px;
    }
    
    .traitement-list {
      display: grid;
      gap: 20px;
      margin-top: 20px;
    }
    
    .traitement-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background: white;
    }
    
    .traitement-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .badge {
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      background: #6c757d;
      color: white;
    }
    
    .badge.active {
      background: #28a745;
    }
    
    .medicaments ul, .bilans ul {
      list-style: none;
      padding: 0;
    }
    
    .medicaments li {
      padding: 10px;
      border-left: 3px solid #28a745;
      margin-bottom: 10px;
      background: #f8f9fa;
      position: relative;
    }
    
    .principal {
      position: absolute;
      right: 10px;
      top: 10px;
      background: #ffc107;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 11px;
    }
    
    .observance-section {
      margin-top: 15px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .observance-form {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    
    .form-control {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .btn-success, .btn-danger {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: white;
    }
    
    .btn-success {
      background: #28a745;
    }
    
    .btn-success:hover {
      background: #218838;
    }
    
    .btn-danger {
      background: #dc3545;
    }
    
    .btn-danger:hover {
      background: #c82333;
    }
    
    .realise {
      color: #28a745;
      font-weight: bold;
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
export class TraitementListComponent implements OnInit {
  traitements: TraitementChronique[] = [];
  loading = false;
  error: string | null = null;
  observanceDate: string = new Date().toISOString().split('T')[0];

  constructor(private traitementService: TraitementService) {}

  ngOnInit(): void {
    this.loadTraitements();
  }

  loadTraitements(): void {
    this.loading = true;
    this.traitementService.getMesTraitementsActifs().subscribe({
      next: (response) => {
        this.traitements = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des traitements';
        this.loading = false;
        console.error(err);
      }
    });
  }

  enregistrerPrise(traitementId: string, pris: boolean): void {
    this.traitementService.enregistrerObservance(
      traitementId,
      this.observanceDate,
      pris
    ).subscribe({
      next: () => {
        alert(`Prise ${pris ? 'confirmée' : 'marquée comme oubliée'}`);
      },
      error: (err) => {
        alert('Erreur lors de l\'enregistrement');
        console.error(err);
      }
    });
  }
}
