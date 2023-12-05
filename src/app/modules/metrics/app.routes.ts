import { Routes } from '@angular/router';

import { HideBothMenusGuard } from '@core/guards/hide-both-menus.guard';

export const routes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./pages/metrics/metrics.page').then(p => p.MetricsPage),
    canActivate: [HideBothMenusGuard]
  },
];
