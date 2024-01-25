import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import localeEsCo from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { VisitClientRoutingModule } from './visit-client-routing.module';
import { StoresService } from '@shared/services/stores.service';
import { SharedModule } from '@shared/shared.module';
import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';
import { HistoryCartComponent } from './components/history-cart/history-cart.component';
import { OrdersService } from '@modules/rut/services/orders.service';
import { TipographyFormComponent } from './components/tipography-form/tipography-form.component';

registerLocaleData(localeEsCo, 'es-CO');

@NgModule({
  declarations: [HistoryCartComponent, TipographyFormComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    VisitClientRoutingModule,
    HttpClientModule,
    SharedModule,
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule,
    HistoryCartComponent,
    TipographyFormComponent
  ],
  providers: [
    HTTP,
    StoresService,
    ProductService,
    CartService,
    OrdersService,
    Geolocation
  ],
})
export class VisitClientModule { }
