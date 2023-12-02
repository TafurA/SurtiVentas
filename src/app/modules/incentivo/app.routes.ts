import { Routes } from '@angular/router';
import { HideBothMenusGuard } from '@core/guards/hide-both-menus.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/index/index.page').then(p => p.IndexPage),
    canActivate: [HideBothMenusGuard]
  },
];
