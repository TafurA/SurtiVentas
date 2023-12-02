import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

import { PageTreeRoutingModule } from './page-tree-routing.module';
import { SharedModule } from '@shared/shared.module';
import { CartService } from '@shared/services/cart.service';
import { StoresService } from '@shared/services/stores.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageTreeRoutingModule,
    RouterLink,
    SharedModule
  ],
  exports: [RouterLink, SharedModule],
  providers: [HTTP, CartService, StoresService]
})
export class PageTreeModule { }
