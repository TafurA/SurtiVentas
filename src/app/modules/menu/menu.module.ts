import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HTTP } from '@awesome-cordova-plugins/http/ngx';

import { AuthService } from '@modules/auth/services/auth.service';
import { SharedModule } from '@shared/shared.module';
import { MenuRoutingModule } from './menu-routing.module';
import { SupportService } from './services/support.service';


@NgModule({
  providers: [HTTP, AuthService, SupportService],
  imports: [
    CommonModule,
    IonicModule,
    MenuRoutingModule,
    SharedModule,
    RouterLink
  ],
  exports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterLink
  ]
})
export class MenuModule { }
