import { Routes } from '@angular/router';
import { Bet } from './feature/bet/bet';
import { NotFoundComponent } from './feature/not-found/not-found.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: 'login',
    loadComponent: () =>
      import('./feature/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./feature/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./feature/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  // Private Routes
  {
    path: 'bet',
    loadComponent: () =>
      import('./feature/bet/bet').then(m => m.Bet),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
    canActivate: [AuthGuard],
  }
];
