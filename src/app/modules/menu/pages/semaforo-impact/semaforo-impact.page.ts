import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { MenuModule } from '@modules/menu/menu.module';
import { OportunityService } from '@modules/menu/services/oportunity.service';

@Component({
  selector: 'app-semaforo-impact',
  templateUrl: './semaforo-impact.page.html',
  styleUrls: ['./semaforo-impact.page.scss'],
  standalone: true,
  imports: [MenuModule]
})
export class SemaforoImpactPage implements OnInit {

  fechaInicial: any
  fechaFinal: any
  htmlTable: any
  dataList: any = []
  isErrorDate: boolean = false
  private loaderElement: any = ""

  constructor(private _semaforoImpactService: OportunityService, private loadingCtrl: LoadingController) { }

  ngOnInit() { }

  getSemaforoImpactsList() {
    const CLIENT_ID: string = localStorage.getItem('codemp_b')!;
    const GROUP_ID: string = localStorage.getItem('group')!;
    this.dataList = []
    this.showLoader().then(() => {
      this._semaforoImpactService.getSemaforoImpacts(CLIENT_ID, GROUP_ID, this.fechaInicial, this.fechaFinal).subscribe({
        next: (res) => {
          const { data, datos } = JSON.parse(res.data)
          this.htmlTable = data[0]
          this.dataList.push(...datos)
        },
        complete: () => {
          this.loaderElement.dismiss();
        },
        error: (e) => {
          this.loaderElement.dismiss();
          console.log("error getSemaforoImpactsList ", e)
        }
      })
    })
  }

  resetList() {
    this.dataList = []
    this.htmlTable = null
  }

  isFinishIsMoreThanStart() {
    return this.isErrorDate = true ? this.fechaFinal < this.fechaInicial : this.isErrorDate = false
  }

  toggleDropdown(e: any) {
    e.target.closest(
      '.o-checkout__dropdown'
    ).classList.toggle('is-dropdown-show');
  }

  async showLoader() {
    this.loaderElement = await this.loadingCtrl.create({
      spinner: 'lines',
      showBackdrop: false,
      cssClass: 'o-loader'
    });
    this.loaderElement.present();
  }

}
