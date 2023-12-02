import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { RutRoutingModule } from './rut-routing.module';
import { SharedModule } from '@shared/shared.module';
import { StoresService } from '@shared/services/stores.service';
import { OrdersService } from './services/orders.service';
import { CustomValidator } from '@shared/util/custom-validator';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RutRoutingModule,
    SharedModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    SharedModule,
  ],
  providers: [
    HTTP,
    StoresService,
    OrdersService,
    CustomValidator,
    Geolocation,
    File,
    Base64
  ]
})
export class RutModule { }
