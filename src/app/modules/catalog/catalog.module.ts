import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

import { SharedModule } from '@shared/shared.module';
import { ProductService } from '@shared/services/product.service';
import { CatalogRoutingModule } from './visit-client-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    CatalogRoutingModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule,
    CatalogRoutingModule
  ],
  providers: [
    HTTP,
    ProductService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CatalogModule { }
