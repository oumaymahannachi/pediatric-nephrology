import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const traitementRoutes: Routes = [
  {
    path: 'traitements',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./traitement-list.component').then(m => m.TraitementListComponent)
      }
    ]
  }
];
