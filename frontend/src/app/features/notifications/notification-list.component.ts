import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models/notification.models';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div class="notification-header">
        <h2>Notifications</h2>
        <button *ngIf="notifications.length > 0" 
                (click)="marquerToutLu()" 
                class="btn-mark-all">
          Tout marquer comme lu
        </button>
      </div>
      
      <div *ngIf="loading" class="loading">Chargement...</div>
      
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div *ngIf="!loading && notifications.length === 0" class="empty">
        Aucune notification non lue
      </div>
      
      <div class="notification-list">
        <div *ngFor="let notification of notifications" 
             class="notification-card"
             [class.priorite-haute]="notification.priorite === 'HAUTE'"
             [class.priorite-urgente]="notification.priorite === 'URGENTE'">
          
          <div class="notification-icon">
            <span [innerHTML]="getIcon(notification.type)"></span>
          </div>
          
          <div class="notification-content">
            <h4>{{ notification.titre }}</h4>
            <p>{{ notification.message }}</p>
            <small>{{ notification.dateCreation | date:'dd/MM/yyyy HH:mm' }}</small>
          </div>
          
          <div class="notification-actions">
            <button (click)="marquerLu(notification.id)" class="btn-mark-read">
              ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      padding: 20px;
    }
    
    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .btn-mark-all {
      background: #6c757d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-mark-all:hover {
      background: #5a6268;
    }
    
    .notification-list {
      display: grid;
      gap: 15px;
    }
    
    .notification-card {
      display: flex;
      gap: 15px;
      padding: 15px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      border-left: 4px solid #007bff;
    }
    
    .notification-card.priorite-haute {
      border-left-color: #ffc107;
      background: #fff9e6;
    }
    
    .notification-card.priorite-urgente {
      border-left-color: #dc3545;
      background: #ffe6e6;
    }
    
    .notification-icon {
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 50%;
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-content h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
    }
    
    .notification-content p {
      margin: 0 0 8px 0;
      color: #666;
    }
    
    .notification-content small {
      color: #999;
    }
    
    .notification-actions {
      display: flex;
      align-items: center;
    }
    
    .btn-mark-read {
      background: #28a745;
      color: white;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
    }
    
    .btn-mark-read:hover {
      background: #218838;
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
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;
  error: string | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotificationsNonLues().subscribe({
      next: (response) => {
        this.notifications = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des notifications';
        this.loading = false;
        console.error(err);
      }
    });
  }

  marquerLu(id: string): void {
    this.notificationService.marquerCommeLue(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  marquerToutLu(): void {
    this.notificationService.marquerToutCommeLu().subscribe({
      next: () => {
        this.notifications = [];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'RAPPEL_RDV': '📅',
      'ALERTE_RENOUVELLEMENT': '🔄',
      'RAPPEL_PRISE_MEDICAMENT': '💊',
      'ALERTE_INTERACTION': '⚠️',
      'ALERTE_CONTRE_INDICATION': '🚫',
      'RAPPEL_BILAN': '🔬',
      'PRESCRIPTION_EXPIREE': '⏰',
      'TRAITEMENT_TERMINE': '✅',
      'MESSAGE_MEDECIN': '👨‍⚕️',
      'RESULTAT_BILAN_DISPONIBLE': '📋',
      'ALERTE_OBSERVANCE': '📊'
    };
    return icons[type] || '🔔';
  }
}
