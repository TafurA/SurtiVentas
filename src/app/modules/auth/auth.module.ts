import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { AppVersion } from "@awesome-cordova-plugins/app-version/ngx"

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AuthService } from './services/auth.service';
import { AlertService } from '@shared/services/alert.service';
import { CustomValidator } from '@shared/util/custom-validator';
import { SecurityCodeComponent } from './components/security-code/security-code.component';


@NgModule({
  declarations: [SecurityCodeComponent],
  imports: [
    CommonModule,
    IonicModule,
    AuthRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    SharedModule,
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    SharedModule,
    SecurityCodeComponent
  ],
  providers: [
    HTTP,
    AuthService,
    CustomValidator,
    AlertService,
    SecurityCodeComponent,
    AppVersion
  ]
})
export class AuthModule { }
