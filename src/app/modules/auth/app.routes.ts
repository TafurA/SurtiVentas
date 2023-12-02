import { Routes } from '@angular/router';
import { HideBothMenusGuard } from '@core/guards/hide-both-menus.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.page').then(m => m.LoginPagePage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'update-password',
    loadComponent: () => import('./pages/update-password/update-password.page').then(m => m.UpdatePasswordPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage),
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  },
];
