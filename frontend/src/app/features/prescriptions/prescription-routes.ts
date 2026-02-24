import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const prescriptionRoutes: Routes = [
  {
    path: 'prescriptions',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./prescription-list.component').then(m => m.PrescriptionListComponent)
      }
    ]
  }
];
