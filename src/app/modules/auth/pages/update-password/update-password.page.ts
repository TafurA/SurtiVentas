import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthModule } from '@modules/auth/auth.module';
import { AuthService } from '@modules/auth/services/auth.service';
import { AlertService } from '@shared/services/alert.service';
import { CustomValidator } from '@shared/util/custom-validator';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
  standalone: true,
  imports: [AuthModule]
})

export class UpdatePasswordPage implements OnInit {
  protected formUpdatePassword: FormGroup = new FormGroup({});
  private userId: any = localStorage.getItem('codemp_b');

  constructor(
    public _authService: AuthService,
    private customValidator: CustomValidator,
    private _alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.formUpdatePassword = new FormGroup({
      newPassword: new FormControl('',
        [
          Validators.required,
          Validators.minLength(6),
        ]
      )
    });
  }

  sendFormToUpdate() {
    let { newPassword } = this.formUpdatePassword.value

    const tempUser = localStorage.getItem('currentUserToForgotPass') ? this.userId = localStorage.getItem('currentUserToForgotPass') : this.userId = localStorage.getItem('codemp_b')

    this._authService.updatePassword$(this.userId, newPassword).subscribe((res) => {
      const { data } = res
      const { response, message } = JSON.parse(data)

      if (response) {
        this._alertService.showAlert('¡Actualización contraseña!', message, 'success')
        this.router.navigate(['/', 'auth', 'login'])
      } else {
        this._alertService.showAlert('¡Actualización contraseña!', message, 'error')
      }
    })
  }

  protected getErrorField(controlName: any) {
    return this.customValidator.getError(controlName, this.formUpdatePassword);
  }

}
