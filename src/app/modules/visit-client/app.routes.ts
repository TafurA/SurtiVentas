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
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.page').then(m => m.CartPage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.page').then(m => m.CheckoutPage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'checkout-confirmation',
    loadComponent: () => import('./pages/checkout-confirmation/checkout-confirmation.page').then(m => m.CheckoutConfirmationPage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'product-detail/:idProduct',
    loadComponent: () => import('./pages/product-detail/product-detail.page').then(m => m.ProductDetailPage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'devolutions',
    loadComponent: () => import('./pages/devolutions/devolutions.page').then(m => m.DevolutionsPage),
    canActivate: [HideBothMenusGuard]
  },
  {
    path: 'discounts',
    loadComponent: () => import('./pages/discounts/discounts.page').then(m => m.DiscountsPage),
    canActivate: [HideBothMenusGuard]
  }
];
