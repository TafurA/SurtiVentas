import { NgModule } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { MetricsRoutingModule } from './metrics-routing.module';
import { MetricsService } from '@modules/dashboard/services/metrics.service';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterLink,
    HttpClientModule,
    MetricsRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule
  ],
  providers: [
    HTTP,
    MetricsService,
    CommonModule,
    IonicModule,
    FormsModule,
    RouterLink,
  ]
})
export class MetricsModule { }
