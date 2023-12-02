import { Routes } from '@angular/router';

import { LayoutPagesPage } from '@modules/page-tree/pages/layout-pages/layout-pages.page';
import { SessionGuard } from '@core/guards/session.guard';
import { HideMenusGuard } from '@core/guards/hide-menus.guard';


export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: LayoutPagesPage,
    loadChildren: () => import('@modules/page-tree/page-tree.module').then((m) => m.PageTreeModule), // Base or Layout for all pages
    canActivate: [SessionGuard]
  }
];
