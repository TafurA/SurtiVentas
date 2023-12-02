import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ImgBrokenDirective } from './directives/img-broken.directive';

import { StartVisitComponent } from '@modules/visit-client/components/start-visit/start-visit.component';
import { ListStoreComponent } from './components/list-store/list-store.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { DaysWeekComponent } from './components/days-week/days-week.component';
import { ListProductsComponent } from './components/products/list-products/list-products.component';
import { ProductComponent } from './components/products/product/product.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';


@NgModule({
  declarations: [
    ImgBrokenDirective,
    BackButtonComponent,
    StartVisitComponent,
    ListStoreComponent,
    DaysWeekComponent,
    ListProductsComponent,
    HeaderComponent,
    ProductComponent,
    FooterComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    RouterLink
  ],
  exports: [
    ImgBrokenDirective,
    BackButtonComponent,
    StartVisitComponent,
    ListStoreComponent,
    DaysWeekComponent,
    ListProductsComponent,
    HeaderComponent,
    ProductComponent,
    RouterLink,
    FooterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
