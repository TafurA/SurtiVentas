import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

import { IonicModule } from '@ionic/angular';

import { AuthService } from '@modules/auth/services/auth.service';
import { SharedModule } from '@shared/shared.module';
import { MenuRoutingModule } from './menu-routing.module';
import { SupportService } from './services/support.service';
import { OportunityService } from './services/oportunity.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  providers: [HTTP, AuthService, SupportService, OportunityService],
  imports: [
    CommonModule,
    IonicModule,
    MenuRoutingModule,
    FormsModule,
    SharedModule,
    RouterLink
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule,
    RouterLink
  ]
})
export class MenuModule { }
