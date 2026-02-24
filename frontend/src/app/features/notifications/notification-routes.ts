import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const notificationRoutes: Routes = [
  {
    path: 'notifications',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./notification-list.component').then(m => m.NotificationListComponent)
      }
    ]
  }
];
