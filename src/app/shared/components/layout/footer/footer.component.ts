import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { AlertService } from '@shared/services/alert.service';
import { StoresService } from '@shared/services/stores.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  routList: any[] = []
  currentRout: any = ''
  selectedRout: any = ''
  idSeller: any = localStorage.getItem('codemp_b')

  constructor(
    private _storeService: StoresService,
    private _alertService: AlertService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getCurrentRout()
    this.getRouts()
  }

  getCurrentRout() {
    const codEmp = localStorage.getItem('codemp_b')!
    this._storeService.getCurrentRout$(codEmp).subscribe({
      next: (res: any) => {
        const { response, message } = JSON.parse(res.data)
        if (response) {
          const { data } = JSON.parse(res.data)
          if (typeof (data) != 'undefined') {
            this.currentRout = data.zonrut_b
            localStorage.setItem("currentRout", this.currentRout)
          }
          else {
            localStorage.removeItem("currentRout")
          }
        } else {
          this._alertService.showAlert('Cambio de ruta', message, "error")
        }
      },
      error: (error) => {
        console.log("EL ERROR", error)
      }
    })
  }

  getRouts() {
    this.routList = []
    const codEmp = localStorage.getItem('codemp_b')!
    this._storeService.getRoutList$(codEmp).subscribe({
      next: (res: any) => {
        this.routList = JSON.parse(res.data)
      }
    })
  }

  setCurrentRout() {
    const codEmp = localStorage.getItem('codemp_b')!
    this._storeService.setRoutList$(codEmp, this.selectedRout).subscribe({
      next: (res) => {
        const { message, response } = JSON.parse(res.data)
        const alertType = response ? 'success' : 'error'
        this._alertService.showAlert('Cambio de ruta', message, alertType)
        this.modalController.getTop().then((modal: any) => {
          modal.dismiss();
        });
      },
      complete: () => {
        this.getCurrentRout()
      }
    })
  }

}
