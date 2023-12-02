import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { NgApexchartsModule } from 'ng-apexcharts';

import { RankingWeeklyComponent } from './components/ranking-weekly/ranking-weekly.component';
import { MenuComponent } from './components/menu/menu.component';
import { MetricsService } from './services/metrics.service';
import { MetricsComponent } from './components/metrics/metrics.component';
import { AuthService } from '@modules/auth/services/auth.service';
import { RankingSellerComponent } from './components/ranking-seller/ranking-seller.component';
import { RankingSellerService } from './services/ranking-seller.service';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [MetricsComponent, RankingWeeklyComponent, MenuComponent, RankingSellerComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    HttpClientModule,
    NgApexchartsModule,
    RouterLink,
    SharedModule
  ],
  providers: [
    HTTP,
    AuthService,
    MetricsService,
    RankingSellerService,
    BackButtonComponent
  ],
  exports: [MetricsComponent, RankingWeeklyComponent, MenuComponent, RankingSellerComponent]
})
export class DashboardModule { }
