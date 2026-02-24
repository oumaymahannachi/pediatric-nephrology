import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';

// Import des nouvelles routes pour les microservices
import { prescriptionRoutes } from './features/prescriptions/prescription-routes';
import { traitementRoutes } from './features/traitements/traitement-routes';
import { notificationRoutes } from './features/notifications/notification-routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'signup',
        loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'verify-otp',
        loadComponent: () => import('./features/auth/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    loadComponent: () => import('./features/dashboard/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/profile',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    loadComponent: () => import('./features/profile/edit-profile.component').then(m => m.EditProfileComponent)
  },
  {
    path: 'doctor',
    canActivate: [authGuard, roleGuard],
    data: { role: 'DOCTOR' },
    loadComponent: () => import('./features/dashboard/doctor/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
  },
  {
    path: 'doctor/profile',
    canActivate: [authGuard, roleGuard],
    data: { role: 'DOCTOR' },
    loadComponent: () => import('./features/profile/edit-profile.component').then(m => m.EditProfileComponent)
  },
  {
    path: 'parent',
    canActivate: [authGuard, roleGuard],
    data: { role: 'PARENT' },
    loadComponent: () => import('./features/dashboard/parent/parent-dashboard.component').then(m => m.ParentDashboardComponent),
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/edit-profile.component').then(m => m.EditProfileComponent)
      }
    ]
  },
  {
    path: 'infirmier',
    canActivate: [authGuard, roleGuard],
    data: { role: 'INFIRMIER' },
    loadComponent: () => import('./features/dashboard/infirmier/infirmier-dashboard.component').then(m => m.InfirmierDashboardComponent)
  },
  {
    path: 'infirmier/profile',
    canActivate: [authGuard, roleGuard],
    data: { role: 'INFIRMIER' },
    loadComponent: () => import('./features/profile/edit-profile.component').then(m => m.EditProfileComponent)
  },
  
  // Routes des microservices Prescription, Traitement et Notification
  ...prescriptionRoutes,
  ...traitementRoutes,
  ...notificationRoutes,
  
  { path: '**', redirectTo: '' }
];
