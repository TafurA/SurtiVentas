import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { IonicSlides, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';

import { OrdersService } from '@modules/rut/services/orders.service';
import { VisitClientModule } from '@modules/visit-client/visit-client.module';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.page.html',
  styleUrls: ['./discounts.page.scss'],
  standalone: true,
  imports: [VisitClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DiscountsPage implements OnInit {

  private idSeller = localStorage.getItem('codemp_b')!
  private idGroup = localStorage.getItem('group')!
  orderDiscountsList: any = []
  discountsList: any = []
  swiperModules = [IonicSlides];
  isOrderDiscountsListLoaded: boolean = false
  isDiscountsListLoaded: boolean = false
  descriptionDiscount: string = ''
  isModalCreated: boolean = false
  isEmpty: boolean = false
  private discont = {
    idpedido: '',
    idVendedor: '',
    idGrupo: '',
    obsdes_b: ''
  }
  allOrdersDiscountsList: any[] = []

  searchTerm$ = new Subject<string>();
  listFiltered: any[] = [];
  isTerm: boolean = false

  constructor(
    private _orderService: OrdersService,
    private _alertService: AlertService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getOrdersDiscounts()
    this.getDiscounts()
  }

  getOrdersDiscounts() {
    this._orderService.getOrdersForDiscounts(this.idSeller, this.idGroup).subscribe({
      next: (res) => {
        const tempData = JSON.parse(res.data)
        this.orderDiscountsList = tempData
      },
      complete: () => {
        this.isOrderDiscountsListLoaded = true
        this.allOrdersDiscountsList = this.orderDiscountsList
        this.filterList()

        if (this.orderDiscountsList.length === 0) {
          this.isEmpty = true
        }

        setTimeout(() => {
          this.isModalCreated = true
        }, 1000)
      }
    })
  }

  filterList(): void {
    this.searchTerm$.subscribe((term: any) => {
      let newListOrders: any[] = []
      this.orderDiscountsList.forEach((element: any) => {
        newListOrders.push(element)
      });

      this.listFiltered = newListOrders
        .filter(item => item.nomcli_b.toLowerCase().indexOf(term.toLowerCase()) >= 0);

      if (term.length >= 3) {
        this.orderDiscountsList = this.listFiltered
        this.isOrderDiscountsListLoaded = true
      } else if (term.length < 2) {
        this.orderDiscountsList = this.allOrdersDiscountsList
        this.isOrderDiscountsListLoaded = false
        setTimeout(() => {
          this.isOrderDiscountsListLoaded = true
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

  getDiscounts() {
    this.isDiscountsListLoaded = false
    this._orderService.getDiscounts(this.idSeller).subscribe({
      next: (res) => {
        const tempData = JSON.parse(res.data)
        this.discountsList = tempData
      },
      complete: () => {
        this.isDiscountsListLoaded = true
      }
    })
  }

  getDiscountState(): string[] {
    const discountStateSet = new Set<string>();
    for (const discountObject of this.discountsList) {
      discountStateSet.add(discountObject.estdes_b!);
    }
    return Array.from(discountStateSet);
  }

  getDiscountGroup(discountState: string): any[] {
    return this.discountsList.filter((discountObject: any) => discountObject.estdes_b === discountState);
  }

  saveDiscountToSend(item: any) {
    this.discont.idpedido = item.numped_b
    this.discont.idGrupo = localStorage.getItem('group')!
    this.discont.idVendedor = item.codemp_b
  }

  saveDiscountFinally() {
    this.discont.obsdes_b = this.encodeDescriptionToSend()
    this._orderService.setDiscounts(this.discont.idpedido, this.discont.idVendedor, this.discont.idGrupo, this.discont.obsdes_b).subscribe({
      next: (res: any) => {
        const { response, message } = JSON.parse(res.data)
        const state = response ? 'success' : 'error'
        this._alertService.showAlert('Enviar descuento', message, state)
        if (response) {
          this.descriptionDiscount = ''
          this.modalCtrl.dismiss()
          this.getDiscounts()
        }
      }
    })
  }

  toggleDropdown(e: any) {
    e.target.closest(
      '.o-checkout__dropdown'
    ).classList.toggle('is-dropdown-show');
  }

  encodeDescriptionToSend() {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(this.descriptionDiscount))))
  }

}
