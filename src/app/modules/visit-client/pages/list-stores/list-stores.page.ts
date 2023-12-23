import { Component, OnInit } from '@angular/core';

import { VisitClientModule } from '@modules/visit-client/visit-client.module';
import { StoreModel } from '@core/models/store_model';
import { StoresService } from '@shared/services/stores.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoadingController, ModalController } from '@ionic/angular';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-list-stores',
  templateUrl: './list-stores.page.html',
  styleUrls: ['./list-stores.page.scss'],
  standalone: true,
  imports: [VisitClientModule]
})
export class ListStoresPage implements OnInit {
  protected storesByVisit: Array<StoreModel> = []
  protected storesVisited: Array<StoreModel> = []
  protected storesNoCausal: Array<StoreModel> = []
  private idseller = localStorage.getItem('codemp_b')!
  private idGroup = localStorage.getItem('group')!
  isStoresByVisitLoaded: boolean = false
  isStoresVisitedLoaded: boolean = false
  isStoreNoCausalLoaded: boolean = false
  isOrderConfirmed: any = ''
  currentRout: any = ''
  isRoutLoaded: boolean = false
  isEmptyByVisit: boolean = false
  isEmptyVisited: boolean = false
  isEmptyCausal: boolean = false

  searchTerm$ = new Subject<string>();
  listFiltered: any[] = [];
  isTerm: boolean = false
  isStoresLoades: boolean = false
  allStoresList: any[] = []
  public loader: any

  constructor(
    private _storeService: StoresService,
    private router: Router,
    public loadingController: LoadingController,
    private _alertService: AlertService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.getCurrentRout()
  }

  ionViewDidEnter() {
    this.isOrderConfirmed = localStorage.getItem('goToCheckoutConfirmation')
    if (this.isOrderConfirmed == 'true') {
      this.isOrderConfirmed = true
    }
    this.getListStores('normal')
  }

  getListStores(action: any) {
    this.isStoresByVisitLoaded = false
    this.isStoresVisitedLoaded = false
    this.isStoreNoCausalLoaded = false

    this._storeService.getStoresList$(this.idseller, this.idGroup)
      .subscribe({
        next: (res: any) => {
          const { data } = res
          const dataStores = JSON.parse(data)

          this.storesByVisit = []
          this.storesVisited = []
          this.storesNoCausal = []

          Object.entries(dataStores.data).map((store: any) => {
            if (store[1].pedido === '0') {
              this.storesNoCausal.push(store[1])
            } else if (store[1].pedido === '1' && store[1].estped_b === 'FACT') {
              this.storesVisited.push(store[1])
            } else {
              this.storesByVisit.push(store[1])
            }
          })
        },
        complete: () => {
          this.allStoresList = this.storesByVisit
          this.filterList()
          this.isStoresByVisitLoaded = true
          this.isStoreNoCausalLoaded = true
          this.isStoresVisitedLoaded = true
          if (this.storesVisited.length === 0) {
            this.isEmptyVisited = true
          } else {
            this.isEmptyCausal = false
          }
          if (this.storesNoCausal.length === 0) {
            this.isEmptyCausal = true
          } else {
            this.isEmptyCausal = false
          }

          if (action === "close") {
            const textInput: any = document.querySelector(".js-input-search")!
            textInput.value = ""
          }
        },
        error(err) {
          console.log(err)
        },
      })
  }

  getCurrentRout() {
    const idseller = localStorage.getItem('codemp_b')!
    this._storeService.getCurrentRout$(idseller).subscribe({
      next: (res: any) => {
        const { data } = JSON.parse(res.data)
        this.currentRout = data.zonrut_b
      },
      complete: () => this.isRoutLoaded = true
    })
  }

  startClientVisit(idStore:any, nameStore:any, idPedido:any, metaCurrent:any, estped_b:any, address:any, ultimacompra:any) {
    console.log("AQUIIIm ", idStore, nameStore, idPedido, metaCurrent, estped_b, address, ultimacompra)
    this.router.navigate(['/', 'client-visit', 'cart']).then(() => {
      localStorage.setItem('CartStoreID', idStore)
      localStorage.setItem('nameStoreId', nameStore)
      localStorage.setItem('idPedidoCurrentOrderPend', idPedido)
      localStorage.setItem('metaCurrentPedido', metaCurrent)
      localStorage.setItem('currentOrderState', estped_b)
      localStorage.setItem('currentOrderAddress', address)
      localStorage.setItem('ultimacompra', ultimacompra)
    })
  }

  saveCurrentDetail(idPedido: string) {
    const orderTemp = {
      pedidoId: idPedido,
      productos: '',
      valped_b: '',
      fecha: '',
      estped_b: 'FACTURA'
    }
    localStorage.setItem('oderDetail', JSON.stringify(orderTemp))
    localStorage.setItem('orderDetailIdPedido', idPedido)
    this.router.navigate(['/', 'rut', 'order-detail', idPedido])
  }

  filterList(): void {
    this.searchTerm$.subscribe((term: any) => {
      let newListOrders: any[] = []
      this.storesByVisit.forEach((element: any) => {
        newListOrders.push(element)
      });

      this.listFiltered = newListOrders
        .filter(
          item => item.nomcli_b.toLowerCase().indexOf(term.toLowerCase()) >= 0
            || item.dircli_b.toLowerCase().indexOf(term.toLowerCase()) >= 0);

      if (term.length >= 2) {
        this.storesByVisit = this.listFiltered
        this.isStoresByVisitLoaded = true
      } else if (term.length < 2) {
        this.storesByVisit = this.allStoresList
        this.isStoresByVisitLoaded = false
        setTimeout(() => {
          this.isStoresByVisitLoaded = true
        }, 1000)
      }
    })
  }

  sendWord$(event: any) {
    this.searchTerm$.next(event.target.value)
    if (event.target.value.length >= 3) {
      this.isTerm = true
    } else {
      this.isTerm = false
    }
  }

  removeCausal(store: StoreModel) {
    const idseller = localStorage.getItem('codemp_b')!
    this.showLoader()
    this._storeService.removeCausal$(idseller, store.codcli_b!).subscribe({
      next: (res: any) => {
        const { response, message } = JSON.parse(res.data)
        if (response) {
          this._alertService.showAlert('Eliminar causal', message, 'success').finally(() => {
            this.modalController.getTop().then((modal: any) => {
              modal.dismiss();
              const currentUrl = this.router.url;
              // Navega a la misma URL
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([currentUrl]);
              });
            });
          })
        } else {
          this._alertService.showAlert('Eliminar causal', message, 'error')
        }
      },
      complete: () => this.loader.dismiss()
    })
  }

  async showLoader() {
    this.loader = await this.loadingController.create({
      spinner: "bubbles",
      translucent: true,
      cssClass: 'o-loader'
    });
    await this.loader.present();
  }

  resetGoBackBtn() {
    localStorage.removeItem('goToCheckoutConfirmation')
  }

}
