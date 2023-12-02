import { Routes } from '@angular/router';
import { HideBothMenusGuard } from '@core/guards/hide-both-menus.guard';

export const routes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./pages/list/list.page').then(p => p.ListPage),
    canActivate: [HideBothMenusGuard]
  },
];
