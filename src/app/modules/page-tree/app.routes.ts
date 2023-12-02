import { Routes } from '@angular/router';

import { HideBothMenusGuard } from '@core/guards/hide-both-menus.guard';
import { DashboardPagePage } from '@modules/dashboard/pages/dashboard-page/dashboard-page.page';


export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPagePage,
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'client-visit',
    loadChildren: () => import('../visit-client/visit-client.module').then(m => m.VisitClientModule)
  },
  {
    path: 'rut',
    loadChildren: () => import('../rut/rut.module').then(m => m.RutModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('../menu/menu.module').then(m => m.MenuModule)
  },
  {
    path: 'history',
    loadChildren: () => import('../history/history.module').then(m => m.HistoryModule)
  },
  {
    path: 'catalog',
    loadChildren: () => import('../catalog/catalog.module').then(m => m.CatalogModule)
  },
  {
    path: 'incentivo',
    loadChildren: () => import('../incentivo/incentivo.module').then( m => m.IncentivoModule)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  },
];
