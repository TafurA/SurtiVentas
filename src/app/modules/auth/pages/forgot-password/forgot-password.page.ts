import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { AuthModule } from '@modules/auth/auth.module';
import { SecurityCodeComponent } from '@modules/auth/components/security-code/security-code.component';
import { AuthService } from '@modules/auth/services/auth.service';
import { AlertService } from '@shared/services/alert.service';
import { CustomValidator } from '@shared/util/custom-validator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [AuthModule]
})
export class ForgotPasswordPage implements OnInit {
  public validateCredentialForm: FormGroup = new FormGroup({});
  public loader: any;
  public stepOne: boolean = false;

  public fullSecurityCode: any = 0;
  public emailString: any = "";

  public isTimerStop = false

  constructor(
    private formBuilder: FormBuilder,
    private customValidator: CustomValidator,
    private _authService: AuthService,
    public loadingController: LoadingController,
    public securityCode: SecurityCodeComponent,
    private router: Router,
    private _alertService: AlertService
  ) { }

  ngOnInit() {
    this.buildValidateCredentialForm();
    this.validateLengthCodeSecurity();
  }

  // form.get('first')?.enable();
  // form.get('last')?.disable();

  private buildValidateCredentialForm() {
    this.validateCredentialForm = this.formBuilder.group({
      credential: ['', [Validators.required,]],
      code: ['', Validators.required],
      email: ['', Validators.required],
    });
  }


  public getError(controlName: any) {
    return this.customValidator.getError(controlName, this.validateCredentialForm);
  }

  public async validateUserCredential() {
    const dataForm = this.validateCredentialForm.value;

    console.log(dataForm)
    console.log(dataForm.credential)

    this.showLoader()

    if (dataForm.credential != null) {
      await this._authService.serviceCredentialValidate$(dataForm.credential).subscribe({
        next: (res) => {
          console.log(res)
          const { response, datos, message } = JSON.parse(res.data)
          if (response) {
            this.stepOne = true
            this.validateCredentialForm.get('email')?.setValue(datos)
            this.emailString = this.validateCredentialForm.get('email')?.value
            this.validateCredentialForm.get('email')?.disable()
            this.securityCode.timer()
            this.securityCode.setCredentialString(dataForm.credential)
          } else {
            this._alertService.showAlert('Recuperar contraseña', message, 'error')
          }
        },
        complete: () => {
          this.removeLoader()
        }
      })
    }

  }

  public async validateSecurityCode() {
    this.fullSecurityCode = document.querySelector(".js-security-code")!.getAttribute("value");

    // 79836040
    this._authService.serviceSecurityCodeValidate(
      this.fullSecurityCode, this.emailString).subscribe({
        next: (res) => {
          const { response, message, sessionOPC2 } = JSON.parse(res.data)
          localStorage.setItem('currentUserToForgotPass', sessionOPC2)
          if (response) {
            this.router.navigate(['/', 'auth', 'update-password'])
          } else {
            this._alertService.showAlert('Recuperar contraseña', message, 'error')
          }
        }
      })
  }

  public validateLengthCodeSecurity() {
    setInterval(() => {

      const secCode = document.querySelector(".js-security-code-text")

      if (secCode) {
        if (secCode.innerHTML.trim().length >= 0 && secCode.innerHTML.trim().length == 4) {
          this.isTimerStop = true
        } else {
          this.isTimerStop = false
        }
      }

    }, 100)
  }

  async showLoader() {
    this.loader = await this.loadingController.create({
      spinner: "bubbles",
      translucent: true,
      cssClass: 'o-loader'
    });
    await this.loader.present();
  }

  async removeLoader() {
    this.loader = await this.loadingController.dismiss();
  }

}
