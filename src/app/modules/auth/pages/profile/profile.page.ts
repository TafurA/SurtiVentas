import { Component, OnInit } from '@angular/core';

import { UserSellerModel } from '@core/models/user_seller_model';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthService } from '@modules/auth/services/auth.service';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [AuthModule]
})
export class ProfilePage implements OnInit {
  protected userModel: UserSellerModel = {
    userId: '',
    name: '',
    foto: '',
    email: '',
    telemp_b: '',
    grupo: '',
    nitEmp: '',
    numBodega: ''
  }
  protected iconAction: 'i-pencil' | 'i-close' | 'i-disk' = 'i-pencil'
  protected isFormActive: boolean = false
  private oldEmail: any = ''

  constructor(private _authService: AuthService, private _alertService: AlertService) { }

  ngOnInit() {
    this.getSellerData()
    this.oldEmail = this.userModel.email
  }

  protected getSellerData() {
    const {
      userId,
      name,
      lastName,
      foto,
      email,
      telemp_b,
      grupo,
      nitEmp,
    } = this._authService.getDataSessionStorage()
    this.userModel.userId = userId
    this.userModel.name = `${name} ${lastName}`
    this.userModel.email = email
    this.userModel.telemp_b = telemp_b
    this.userModel.nitEmp = nitEmp
    this.userModel.grupo = grupo
    this.userModel.foto = foto
  }

  public showEditForm() {
    this.iconAction = 'i-close'
    this.isFormActive = true
  }

  public showActionToEdit() {
    if (this.oldEmail !== this.userModel.email) {
      this.iconAction = 'i-disk'
      this.isFormActive = true
    } else {
      this.iconAction = 'i-pencil'
      this.isFormActive = false
    }
  }

  public saveEditForm() {
    if (this.iconAction === 'i-close') {
      this.iconAction = 'i-pencil'
      this.isFormActive = false
    } else {
      this._authService.editDataUser(
        this.userModel.userId,
        this.userModel.email ? this.userModel.email : ''
      ).subscribe(res => {
        const { data } = res // Services response
        let { response, message } = JSON.parse(data)
        if (response) {
          this._alertService.showAlert('¡Datos editados correctamente!', message, 'success')
          this.iconAction = 'i-pencil'
          this.isFormActive = false
        } else {
          this._alertService.showAlert('Error editando los datos!', message, 'error')
        }
      })
    }
  }

}
