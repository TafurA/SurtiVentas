import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncentivoRoutingModule } from './incentivo-routing.module';
import { StoresService } from '@shared/services/stores.service';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IncentivoRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule
  ],
  providers: [
    HTTP,
    StoresService
  ]
})
export class IncentivoModule { }
