import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alert: any = ''

  constructor(private alertCtrl: AlertController) { }

  public async showAlert(
    header: string,
    message: string,
    typeAlert: 'success' | 'warning' | 'error',
  ) {
    this.alert = await this.alertCtrl.create({
      header: header,
      message: message,
      cssClass: `c-alert is-${typeAlert}`
    });

    await this.alert.present();
  }

  async alertUnUpdatedVersion(title: string, description: string, alertType: string) {
    this.alert = await this.alertCtrl.create({
      header: title,
      subHeader: description,
      cssClass: `c-alert is-${alertType}`,
      buttons: [
        {
          text: 'Actualizar',
          cssClass: 'o-button o-button_small',
          handler: () => {
            setTimeout(() => {
              window.location.href = "https://play.google.com/store/apps/details?id=com.surtilider.SurtiVentas"
            }, 200);
          },
        },
      ],
    });
  
    await this.alert.present();
  }
  
}

