import { Routes } from '@angular/router';
import { HideBothMenusGuard } from '@core/guards/hide-both-menus.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/menu/menu.page').then(p => p.MenuPage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'billing-time',
    loadComponent: () => import('./pages/billing-time/billing-time.page').then(m => m.BillingTimePage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'frequent-question',
    loadComponent: () => import('./pages/frequent-question/frequent-question.page').then(m => m.FrequentQuestionPage),
    canActivate: [HideBothMenusGuard]
  }
];
