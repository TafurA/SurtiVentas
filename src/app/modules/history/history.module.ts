import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import localeEsCo from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { HistoryRoutingModule } from './history-routing.module';
import { OrdersService } from '@modules/rut/services/orders.service';
import { RouterLink } from '@angular/router';

registerLocaleData(localeEsCo, 'es-CO');

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    HistoryRoutingModule,
    RouterLink,
    HttpClientModule,
    SharedModule,
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule,
    RouterLink
  ],
  providers: [
    HTTP,
    OrdersService,
  ],
})
export class HistoryModule { }
