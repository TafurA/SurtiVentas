import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { ProductModel } from '@core/models/product_model';
import { VisitClientModule } from '@modules/visit-client/visit-client.module';
import { CartService } from '@shared/services/cart.service';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [VisitClientModule]
})
export class CheckoutPage implements OnInit {

  public numberProducts: number = 0
  public totalAmount: number = 0
  public productsList: any;
  public nameStore: any;
  private storeId: any = localStorage.getItem("CartStoreID")!
  private groupId: any = localStorage.getItem('group')


  cartCount!: number;
  @ViewChild(IonModal) modal!: IonModal;
  name!: string;
  public este: boolean = false
  calificationIcon: any = ''
  calificationNumber: any = ''
  public order = [{
    idOrder: "",
    customerCodeOrder: "",
    vendedor: "",
    lat: 0,
    lon: 0,
    estado: '',
    observacion: '',
    shoppingDetail: [],
    puntos: 0
  }];
  private loaderElement: any = ""
  orderState = ''
  orderAddress = ''
  isPendingOrder: string = 'false'
  public ticket = [{
    codcli_b: "",
    grupo: "",
    ultimacompra: 0,
    shoppingDetail: []
  }];
  cartItemsTicket: any[] = []

  // Clean code
  private groupProductsMix: ProductModel[] = []
  public isProducstMixLoaded: boolean = false
  public orderObservation: string = ''
  public ultimacompra: any = ''
  // End cleand code

  constructor(
    private _alertService: AlertService,
    public _cartService: CartService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private router: Router,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
  ) {
    this._cartService.countCart$.subscribe(count => {
      this.cartCount = count;
    });
    const newAmount = localStorage.getItem("TempCartAmount")
    const tempCartProductsQuantity = localStorage.getItem("TempCartProductsQuantity")
    this._cartService.currentAmountCart$.next(Number(newAmount))
    this._cartService.numberProductsCart$.next(Number(tempCartProductsQuantity))
    this._cartService.calificationIcon.next(localStorage.getItem('TempBarProgresIcon')!)
    this._cartService.calificationNumber.next(Number(localStorage.getItem('TempBarProgresNumber')))
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getDataCurrentCart()
    if (localStorage.getItem(`orderPending-${this.storeId}`) !== 'false') {
      this.orderState = "FACTURADO"
      this.isPendingOrder = "false"
    } else {
      this.orderState = "PENDIENTE"
      this.isPendingOrder = "true"
    }
    this.orderAddress = localStorage.getItem('currentOrderAddress')!

    this.getCalificationPoints()
    this.ultimacompra = localStorage.getItem("ultimacompra")
  }

  public getDataCurrentCart() {
    const currentCart = JSON.parse(localStorage.getItem(`cartProgress-${this.storeId}`)!)
    const currentProducstCar = JSON.parse(localStorage.getItem(`ProductsCart-${this.storeId}`)!)
    const { ProgressAmount, cartIconCount } = currentCart
    const nameStore = localStorage.getItem('nameStoreId')
    this.nameStore = nameStore
    this.numberProducts = cartIconCount
    this.totalAmount = ProgressAmount
    this.productsList = currentProducstCar
    setTimeout(() => {
      this.este = true;
    }, 500)

    this._cartService.getRunTicket().finally(() => {
      this._cartService.getRunTicketAsyncProduct().finally(() => {
        this.emparejarProductos()
      })
    })
  }

  public getCalificationPoints() {
    const progressNumber = Number(localStorage.getItem('TempBarProgresNumber'))
    if (progressNumber >= 90) {
      this.order[0].puntos = 3
    } else if (progressNumber >= 75 && progressNumber < 90) {
      this.order[0].puntos = 1
    } else if (progressNumber < 75) {
      this.order[0].puntos = 0
    }
  }

  emparejarProductos() {
    this.groupProductsMix = this._cartService.groupProductsMix
    this.isProducstMixLoaded = this._cartService.isProducstMixLoaded
  }

  quantityIntoModal(op: number) {
    if (op === 0) {
      this._cartService.quantityIntoModal(0)
    } else {
      this._cartService.quantityIntoModal(1)
    }
    this.cartCount = this._cartService.countCart$.getValue()

    if (this.cartCount == 0) {
      this.modal.dismiss(this.name, 'confirm');
    }
  }

  confirm() {
    this.modalController.getTop().then((modal: any) => {
      modal.dismiss();
    });
    localStorage.setItem(`ProductsCart-${this.storeId}`, JSON.stringify(this.productsList))
    this._cartService.closeCartModal()

    const currentCart = JSON.parse(localStorage.getItem(`cartProgress-${this.storeId}`)!)
    currentCart.ProgressAmount = this._cartService.currentAmountCart$.getValue()
    currentCart.RestantAmount = this._cartService.restanteAmountCart$.getValue()
    currentCart.BarProgressAmount = this._cartService.barGoalsAmount$.getValue()

    this.totalAmount = this._cartService.currentAmountCart$.getValue()
    localStorage.setItem(`cartProgress-${this.storeId}`, JSON.stringify(currentCart))
    this._cartService.getRunTicket().finally(() => {
      this._cartService.getRunTicketAsyncProduct().finally(() => {
        this.emparejarProductos()
      })
    })
  }

  getOrderProducts() {
    const tempArray: any = []
    const products = localStorage.getItem(`ProductsCart-${this.storeId}`)
    const formatedProducts = JSON.parse(products!)

    formatedProducts.forEach((p: ProductModel) => {
      const tempProduct = {
        "productCode": p.codeProduct,
        "quantityProduct": p.cantidadCart
      }
      tempArray.push(tempProduct);
    });

    return tempArray
  }

  encodeTicketProductsToSend() {
    this.ticket[0].codcli_b = this.storeId
    this.ticket[0].grupo = this.groupId
    this.ticket[0].ultimacompra = Number(this.ultimacompra)
    this.ticket[0].shoppingDetail = this.getOrderProducts()

    return window.btoa(unescape(encodeURIComponent(JSON.stringify(this.ticket))))
  }

  goBack() {
    this.navCtrl.back()
  }

  getOrderState() {
    if (localStorage.getItem(`orderPending-${this.storeId}`) !== 'true') {
      this.order[0].estado = "PEND"
    } else {
      this.order[0].estado = "FACT"
    }
  }

  sendOrder() {
    this.showLoaderCheckout()
    this.order[0].customerCodeOrder = this.storeId!
    this.order[0].vendedor = localStorage.getItem("codemp_b")!
    this.order[0].observacion = this.orderObservation
    if (localStorage.getItem('idPedidoCurrentOrderPend') !== '0') {
      this.order[0].idOrder = localStorage.getItem('idPedidoCurrentOrderPend')!
    }

    this.getGeolocation().then(() => {
      this.getOrderState()
      this.formattedProductsToSend();
    }).finally(() => {
      setTimeout(() => {
        this._cartService.sendOrder(this.encodeOrderToSend()).subscribe({
          next: (res: any) => {
            const { response, message, idpedido } = JSON.parse(res.data)
            if (!response) {
              this._alertService.showAlert('Realizar pedido', message, 'error')
            } else {
              this.order[0].idOrder = idpedido
              if (localStorage.getItem(`orderPending-${this.storeId}`) !== 'true') {
                this.router.navigate(['/', 'client-visit', 'list-stores'])
                this._alertService.showAlert('Realizar pedido', 'Pedido marcado como pendiente exitosamente', 'success')
              } else {
                localStorage.setItem("currentOrderId", this.order[0].idOrder)
                localStorage.setItem("currentOrderDetail", JSON.stringify(this.order))
                localStorage.setItem(`currentOrderProducts-${this.storeId}`, JSON.stringify(this.groupProductsMix))
                this.router.navigate(['/', 'client-visit', 'checkout-confirmation'])
              }
            }
          },
          complete: () => {
            this.loaderElement.dismiss()
          },
          error: (err) => {
            console.log("ERROR sendOrder ", err)
            this.loaderElement.dismiss()
          }
        })
      }, 2000)
    })

  }

  private formattedProductsToSend() {
    const tempArray: any = []
    this.groupProductsMix.forEach((p: ProductModel) => {
      const isProductsBonus = p.idticket !== undefined ? true : false
      let tempProduct = {}
      if (isProductsBonus) {
        tempProduct = {
          "productCode": p.codpro_b,
          "quantityProduct": Number(p.cantidad),
          "idticket": p.idticket
        }
      } else {
        tempProduct = {
          "productCode": p.codeProduct,
          "quantityProduct": p.cantidadCart,
          "idticket": '0'
        }
      }
      tempArray.push(tempProduct);
      this.order[0].shoppingDetail = tempArray
    });
  }

  async showLoaderCheckout() {
    this.loaderElement = await this.loadingCtrl.create({
      spinner: 'lines',
      showBackdrop: false,
      cssClass: 'o-loader'
    });
    this.loaderElement.present();
  }

  encodeOrderToSend() {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(this.order))))
  }

  async getGeolocation() {
    await this.geolocation.getCurrentPosition().then((resp) => {
      const latitud = resp.coords.latitude;
      const longitud = resp.coords.longitude;
      this.order[0].lat = latitud
      this.order[0].lon = longitud
    }).catch((error) => {
      console.log("Error al obtener la ubicación: ", error);
    })
  }

}
