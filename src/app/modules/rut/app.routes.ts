import { Routes } from '@angular/router';
import { HideBothMenusGuard } from '@core/guards/hide-both-menus.guard';
import { HideMenusGuard } from '@core/guards/hide-menus.guard';

export const routes: Routes = [
  {
    path: 'list-stores',
    loadComponent: () => import('./pages/list-stores/list-stores.page').then(p => p.ListStoresPage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'store-detail',
    loadComponent: () => import('./pages/store-detail/store-detail.page').then(m => m.StoreDetailPage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'history-orders',
    loadComponent: () => import('./pages/history-orders/history-orders.page').then(m => m.HistoryOrdersPage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'order-detail/:idPedido',
    loadComponent: () => import('./pages/order-detail/order-detail.page').then( m => m.OrderDetailPage),
    canActivate: [HideBothMenusGuard]
  }
];
