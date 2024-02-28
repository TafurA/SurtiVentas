import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DashboardModule } from '@modules/dashboard/dashboard.module';
import { AuthService } from '@modules/auth/services/auth.service';
import { UserSellerModel } from '@core/models/user_seller_model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.page.html',
  styleUrls: ['./dashboard-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DashboardModule]
})
export class DashboardPagePage implements OnInit {
  protected userModel: UserSellerModel = {
    userId: '',
    name: '',
    lastName: '',
    foto: '',
    diferenciador: ''
  }

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getSellerData()
  }

  protected getSellerData() {
    const { name, lastName, foto, diferenciador } = this._authService.getDataSessionStorage()
    this.userModel.name = `${name} ${lastName}`
    this.userModel.foto = foto
    this.userModel.diferenciador = diferenciador
  }
}
