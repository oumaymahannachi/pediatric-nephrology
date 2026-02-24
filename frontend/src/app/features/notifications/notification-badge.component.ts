import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notification-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-badge" (click)="onClick()">
      <span class="icon">🔔</span>
      <span *ngIf="count > 0" class="badge">{{ count > 99 ? '99+' : count }}</span>
    </div>
  `,
  styles: [`
    .notification-badge {
      position: relative;
      cursor: pointer;
      padding: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .icon {
      font-size: 24px;
    }
    
    .badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #dc3545;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }
    
    .notification-badge:hover {
      opacity: 0.8;
    }
  `]
})
export class NotificationBadgeComponent implements OnInit {
  count = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notificationCount$.subscribe(count => {
      this.count = count;
    });
    
    this.notificationService.refreshNotificationCount();
    
    // Rafraîchir toutes les 30 secondes
    setInterval(() => {
      this.notificationService.refreshNotificationCount();
    }, 30000);
  }

  onClick(): void {
    // Navigation vers la page des notifications
    // Vous pouvez implémenter la navigation ici
    console.log('Ouvrir les notifications');
  }
}
