import { Routes } from '@angular/router';

import { HideBothMenusGuard } from '@core/guards/hide-both-menus.guard';

export const routes: Routes = [
  {
    path: 'list-orders',
    loadComponent: () => import('./pages/orders-list/orders-list.page').then(p => p.OrdersListPage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'order-detail/:idPedido',
    loadComponent: () => import('./pages/order-detail/order-detail.page').then( m => m.OrderDetailPage)
  },
];
