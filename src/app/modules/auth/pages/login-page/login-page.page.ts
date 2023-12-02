import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

import { AuthModule } from '@modules/auth/auth.module';
import { AuthService } from '@modules/auth/services/auth.service';
import { AlertService } from '@shared/services/alert.service';
import { CustomValidator } from '@shared/util/custom-validator';
import { CookieService } from 'ngx-cookie-service';
import { Plugins } from '@capacitor/core';

const { App } = Plugins;
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
  standalone: true,
  imports: [AuthModule]
})
export class LoginPagePage implements OnInit {

  private NUMBER_PUBLIC_VERSION = "5.1";
  currentVersion: boolean = true;
  currentNumberVersion: string = '';

  private NUMBER_INDICATOR = "+57"
  private NUMBER_CONTACT: string = `${this.NUMBER_INDICATOR}3175030951`
  private MESSAGE_TEXT_CONTACT: string = "Buen día compañeros de soporte, necesito asistencia con: "
  protected actionWaysSupportContact: any[] = [
    // {
    //   text: 'Llamar directamente',
    //   data: {
    //     action: 'call'
    //   }
    // },
    {
      text: 'Escribir mensaje por WhatsApp',
      data: {
        action: 'write'
      }
    }
  ]
  protected formLogin: FormGroup = new FormGroup({});
  private loaderElement: any = ""

  constructor(
    public _authService: AuthService,
    private _alertService: AlertService,
    private loadingCtrl: LoadingController,
    private customValidator: CustomValidator,
    private cookie: CookieService,
    private router: Router,
    private appVersion: AppVersion
  ) { }

  ngOnInit() {
    this.formLogin = new FormGroup(
      {
        user: new FormControl('',
          [
            Validators.required,
            Validators.minLength(5),
          ]
        ),
        password: new FormControl('',
          [
            Validators.required,
            Validators.minLength(5),
          ]
        )
      }
    )

    // this.validateVersion()

    App["getInfo"]().then((info: any) => {
      console.log('Nombre de la aplicación:', info.name);
      console.log('ID de la aplicación:', info.id);
      console.log('Versión de la aplicación:', info.version);
      this.currentNumberVersion = info.version
      if (info.version !== this.NUMBER_PUBLIC_VERSION) {
        this._alertService.alertUnUpdatedVersion(
          '¡Actualizar aplicación!',
          'Si ve este mensaje, verifique que tenga la aplicación actualizada, gracias',
          'error'
        )
        this.currentVersion = false
      } else {
        this.validateLogin()
      }
    });
  }

  validateVersion() {
    console.log("EMTRAAAA")
    this.appVersion.getVersionNumber().then((uploadNumberVersion) => {
      this.currentNumberVersion = uploadNumberVersion
      if (uploadNumberVersion != this.NUMBER_PUBLIC_VERSION) {

      } else {
        this.validateLogin()
      }
    }).catch((error) => {
      console.log('Error al obtener la versión:', error);
    })
  }


  /**
   * Valida los datos en el servicio 
   * y si todo va bien guarda el token de la sesión
   *
   * @protected
   * @memberof LoginPagePage
   */
  protected validateLogin() {
    let { user, password } = this.formLogin.value
    this.showLoaderLogin().then(() => {
      this._authService.sendCredentials$(user, password).subscribe({
        next: (res) => {
          const { data } = res // Services response
          let { response, message, dataSession } = JSON.parse(data)
          if (response) {
            // Save login data session and return to home
            this.cookie.set('sessionToken', dataSession, 4, '/')
            this._authService.setDataSessionStorage()
            this.router.navigate(['/', 'dashboard'])
          } else {
            this._alertService.showAlert('¡Inicio de sesión fallido!', message, 'error')
          }
        },
        error: () => {
          this.loaderElement.dismiss();
          this._alertService.showAlert('¡Error inesperado!', 'Se produjo un error con el servidor.', 'error')
        },
        complete: () => {
          this.loaderElement.dismiss();
        }
      });
    })
  }

  // TODO: pasar a clase general
  async showLoaderLogin() {
    this.loaderElement = await this.loadingCtrl.create({
      spinner: 'lines',
      showBackdrop: false,
      cssClass: 'o-loader'
    });
    this.loaderElement.present();
  }

  protected getErrorField(controlName: any) {
    return this.customValidator.getError(controlName, this.formLogin);
  }

  /**
   * Realiza la acción que selecciono el usuario para contacto
   *  1. Llamada a soporte
   *  2. Mensaje al WhatsApp
   *
   * @protected
   * @param {any} event Datos del elemento al que se le hace click
   * @memberof LoginPagePage
   */
  protected getModeOfContact(event: any) {
    const { data } = event.detail
    if (typeof (data) != 'undefined') {
      switch (data.action) {
        case "call":
          window.open(
            `tel:${this.NUMBER_CONTACT}`,
            '_system'
          );
          break;
        case "write":
          window.open(
            `https://wa.me/${encodeURIComponent(this.NUMBER_CONTACT)}?text=${encodeURIComponent(this.MESSAGE_TEXT_CONTACT)}`,
            '_blank'
          );
          break;
        default:
          break;
      }
    }
  }

}
