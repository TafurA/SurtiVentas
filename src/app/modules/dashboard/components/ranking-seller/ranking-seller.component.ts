import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { RankingSellerService } from '@modules/dashboard/services/ranking-seller.service';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-ranking-seller',
  templateUrl: './ranking-seller.component.html',
  styleUrls: ['./ranking-seller.component.scss'],
})
export class RankingSellerComponent implements OnInit {

  protected rankingSellerList: [] = []
  protected dataForRankingSellerLoaded = false

  loaderElement: any = ''

  constructor(
    private _rankingSellerService: RankingSellerService,
    private _alertService: AlertService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.getRankingSellerList()
  }

  getRankingSellerList() {
    this._rankingSellerService.getRankingSellerList$().subscribe(
      {
        next: (data) => {
          const DATA_PARSED = JSON.parse(data.data)
          this.rankingSellerList = DATA_PARSED
        },
        error: (err) => {
          this.loaderElement.dismiss();
          this._alertService.showAlert('¡Error inesperado!', 'Se produjo un error con el servidor.', 'error')
        },
        complete: () => this.dataForRankingSellerLoaded = true
      }
    )
  }

  async showLoaderLogin() {
    this.loaderElement = await this.loadingCtrl.create({
      spinner: 'lines',
      showBackdrop: false,
      cssClass: 'o-loader'
    });
    this.loaderElement.present();
  }
}
