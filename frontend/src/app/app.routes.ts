import { Routes } from '@angular/router';
import { Bet } from './feature/bet/bet';
import { NotFoundComponent } from './feature/not-found/not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NotAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: 'login',
    loadComponent: () =>
      import('./feature/login/login.component').then(m => m.LoginComponent),
    canActivate: [NotAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./feature/register/register.component').then(m => m.RegisterComponent),
    canActivate: [NotAuthGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./feature/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [NotAuthGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./feature/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    canActivate: [NotAuthGuard],
  },
  // Private Routes
  {
    path: 'bet',
    loadComponent: () =>
      import('./feature/bet/bet').then(m => m.Bet),
    canActivate: [AuthGuard],
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./feature/bet-results/bet-results').then(m => m.BetResults),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
    canActivate: [AuthGuard],
  }
];
