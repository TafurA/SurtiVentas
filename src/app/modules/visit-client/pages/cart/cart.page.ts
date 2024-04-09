import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';

import { VisitClientModule } from '@modules/visit-client/visit-client.module';
import { ProductModel } from '@core/models/product_model';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';
import { StoresService } from '@shared/services/stores.service';
import { AlertService } from '@shared/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [VisitClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CartPage implements OnInit {
  headerAction = document.querySelector("#headerActions")
  public iconCart = document.querySelector("#icon-cart")
  resetRecomended = false
  public isProductsGoldListLoaded: boolean = false;
  public isProductsRecomendedListLoaded: boolean = false;
  public isProductsSinVenderLoaded: boolean = false;
  @Input() productsListRecommended: ProductModel[] = []
  @Input() productsListProductosSinVender: any[] = []
  @Input() productsLisGold: ProductModel[] = []
  private bodega: any = localStorage.getItem('bodega')
  private cartId: any = localStorage.getItem('CartStoreID')
  private sellerId: any = localStorage.getItem('codemp_b')
  private groupId: any = localStorage.getItem('group')
  public nameStoreId: any = ''
  public minimoCompra: any = localStorage.getItem('minimoCompra')
  public currentOrderState: any = ''
  swiperModules = [IonicSlides];
  storeId: any
  listCausalNotOrder: any[] = []
  public idCausal: any
  public isPending: boolean = false
  public isDataOK: boolean = false
  public isModalChangeStateOpen: boolean = false
  public isModalChangeStateOpenProductsNoSeller: boolean = false
  public isStateFull: boolean = false
  private latNoCausal: any = ''
  private lonNoCausal: any = ''
  private loaderElement: any = ""
  public currentText: string = ""
  public lastText: string = ""
  public ultimacompra: any = ""
  public hasEncuesta: number = 1
  public localStorageLista: string = ''

  constructor(
    public _cartService: CartService,
    private navCtrl: NavController,
    private _productService: ProductService,
    private _storeService: StoresService,
    private _alertService: AlertService,
    private geolocation: Geolocation,
    public modalController: ModalController,
    private router: Router,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.resetRecomended = true
  }

  ionViewDidEnter() {
    this.nameStoreId = localStorage.getItem('nameStoreId')
    this.hasEncuesta = Number(localStorage.getItem('encuesta'))
    this.reInitCart()
    this.getListCausalNotOrder()
    this.getProductsSinVender()
    this.getGoldProductsList()
    this.getRecommendedProductsList()
  }

  reInitCart() {
    this.cartId = localStorage.getItem('CartStoreID')
    this._cartService.validateDateToRemoveCart(this.cartId)
    this.isDataOK = false
    const cartProgress = localStorage.getItem(`cartProgress-${localStorage.getItem('CartStoreID')}`)
    const parentIcon = this.iconCart!.closest(".js-target-iconCart")
    const meta = localStorage.getItem('metaCurrentPedido') ? localStorage.getItem('metaCurrentPedido')!.replace('.', '') : 0
    const metaNumber = localStorage.getItem('sku') ? localStorage.getItem('sku') : 0
    this._cartService.goalAmountCart$.next(Number(meta))
    this._cartService.goalAmountCartNumber$.next(Number(metaNumber))
    // Fix the goal data
    localStorage.setItem("metaTemporal", meta.toString())
    this.currentOrderState = localStorage.getItem('currentOrderState')
    const tempState = localStorage.getItem(`orderPending-${this.cartId}`)

    if (tempState === 'false' || tempState == null) {
      this.isPending = false
      this.currentText = 'pendiente'
      this.lastText = 'facturado'
      localStorage.setItem(`orderPending-${this.cartId}`, 'false')
    } else {
      this.isPending = true
      localStorage.setItem(`orderPending-${this.cartId}`, 'true')
      this.currentText = 'facturado'
      this.lastText = 'pendiente'
    }

    if (cartProgress) {
      let { ProgressAmount, RestantAmount, cartIconCount, goalAmount, BarProgressAmount, goalAmountNumber, ProgressAmountNumber, BarProgressAmountNumber, RestantAmountNumber } = JSON.parse(cartProgress)
      this._cartService.currentAmountCart$.next(ProgressAmount)
      this._cartService.restanteAmountCart$.next(RestantAmount)
      this._cartService.goalAmountCart$.next(goalAmount)
      this._cartService.barGoalsAmount$.next(BarProgressAmount)
      this._cartService.currentAmountCartNumber$.next(ProgressAmountNumber)
      this._cartService.restanteAmountCartNumber$.next(RestantAmountNumber)
      this._cartService.goalAmountCartNumber$.next(goalAmountNumber)
      this._cartService.barGoalsAmountNumber$.next(BarProgressAmountNumber)
      if (cartIconCount == 0) {
        this.storeId = localStorage.getItem("CartStoreID")
        const productList = JSON.parse(localStorage.getItem(`ProductsCart-${this.storeId}`)!)
        if (productList) {
          let count = productList.length > 0 ? productList.length : 0
          this._cartService.numberProductsCart$.next(count)
          cartIconCount = count
          parentIcon!.classList.add("is-hidden")
        }
      } else {
        parentIcon!.classList.remove("is-hidden")
      }

      localStorage.setItem("historyCountCart", cartIconCount)

      this.iconCart!.innerHTML = cartIconCount
    } else {
      this._cartService.currentAmountCart$.next(0)
      this._cartService.currentAmountCartNumber$.next(0)
      this._cartService.restanteAmountCart$.next(this._cartService.goalAmountCart$.getValue())
      this._cartService.restanteAmountCartNumber$.next(this._cartService.goalAmountCartNumber$.getValue())
      this._cartService.barGoalsAmount$.next(0)
      this._cartService.barGoalsAmountNumber$.next(0)
      this._cartService.numberProductsCart$.next(0)
      parentIcon!.classList.add("is-hidden")
      this.iconCart!.innerHTML = '0'
    }

    this.isDataOK = true
    this.showModalForChangeStateOrder(true)
    this.ultimacompra = localStorage.getItem("ultimacompra")
  }

  resetHistoryModel() {
    this._cartService.numberProductsCart$.next(Number(this.iconCart?.innerHTML))
  }

  getListCausalNotOrder() {
    this._storeService.getListCausalNotOrder().subscribe({
      next: (res) => {
        const { data } = res
        this.listCausalNotOrder = JSON.parse(data)
      }
    })
  }

  sendOrderNoCausal() {
    this.showLoader().then(() => {
      this.getGeolocation().then(() => {
        this._storeService.setOrderNoCausal$(this.sellerId, this.cartId, this.idCausal, this.latNoCausal, this.lonNoCausal).subscribe({
          next: (res) => {
            const { response, message } = JSON.parse(res.data)
            this.modalController.dismiss().then(() => {
              if (response) {
                this._alertService.showAlert(
                  'Finalizar pedido',
                  message,
                  'success'
                )
                this.router.navigate(['/', 'client-visit', 'list-stores'])
              } else {
                this._alertService.showAlert(
                  'Finalizar pedido',
                  message,
                  'error'
                )
              }
            })
          },
          complete: () => this.loaderElement.dismiss()
        })
      })
    })
  }

  async showLoader() {
    this.loaderElement = await this.loadingCtrl.create({
      spinner: 'lines',
      showBackdrop: false,
      cssClass: 'o-loader'
    });
    this.loaderElement.present();
  }

  async getGeolocation() {
    await this.geolocation.getCurrentPosition().then((resp) => {
      const latitud = resp.coords.latitude;
      const longitud = resp.coords.longitude;
      this.latNoCausal = latitud
      this.lonNoCausal = longitud
    }).catch((error) => {
      console.log("Error al obtener la ubicación: ", error);
    });
  }

  getRecommendedProductsList() {
    this.isProductsRecomendedListLoaded = false;
    this.productsListRecommended = []
    this._productService.getRecommendedProductsList$(this.cartId, this.bodega).subscribe({
      next: (res) => {
        const { response } = JSON.parse(res.data)
        if (!response) {
          this.isProductsRecomendedListLoaded = false;
        } else {
          const { data } = JSON.parse(res.data)
          this.productsListRecommended.push(...data)
        }
      },
      complete: () => {
        this.isProductsRecomendedListLoaded = true;
      },
      error: (e) => {
        console.log("e ", e)
      }
    })
  }

  getProductsSinVender() {
    this.productsListProductosSinVender = []

    this._productService.getProductsSinVender$(this.cartId).subscribe({
      next: (res) => {
        const { data } = JSON.parse(res.data)
        this.productsListProductosSinVender.push(data)
      },
      complete: () => {
        const lista_productos = localStorage.getItem("lista_productos")!
        this.localStorageLista = lista_productos
        this.isProductsSinVenderLoaded = true;
        if (this.productsListProductosSinVender.length > 0) {
          if (lista_productos == "SI") {
            this.showModalForProductsSinVender(true)
          }
        }
      },
    })
  }

  async getGoldProductsList() {
    this.isProductsGoldListLoaded = false;
    this.productsLisGold = []
    await this._productService.getGoldProductsList$(this.groupId, this.cartId).subscribe({
      next: (res) => {
        const { response } = JSON.parse(res.data)
        if (!response) {
          this.isProductsGoldListLoaded = false
        } else {
          const { data } = JSON.parse(res.data)
          this.productsLisGold.push(...data)
        }
      },
      complete: () => {
        this.isProductsGoldListLoaded = true;
      }
    })
  }

  changeCartState(action: string) {
    let isPending: string = this.isPending ? 'true' : 'false'
    let currentText = ''


    localStorage.setItem(`orderPending-${this.cartId}`, isPending)

    isPending === 'false' ? currentText = 'pendiente' : currentText = 'facturado'

    if (currentText == "facturado") {
      this.lastText = "pendiente"
    } else if (currentText == "pendiente") {
      this.lastText = "facturado"
    }

    this.currentText = currentText
    this._alertService.showAlert(
      'Estado del pedido',
      `Acabas de cambiar el estado de este pedido a ${this.currentText}`,
      'warning'
    )

    this.isStateFull = true

    if (action === "modal") {
      setTimeout(() => {
        this.modalController.dismiss()
      }, 10);
    }
  }

  showModalForChangeStateOrder(state: boolean) {
    this.isModalChangeStateOpen = state
  }

  showModalForProductsSinVender(state: boolean) {
    this.isModalChangeStateOpenProductsNoSeller = state
  }

  goBack() {
    this._cartService.saveCartProgress()
    this.navCtrl.back()
  }

}
