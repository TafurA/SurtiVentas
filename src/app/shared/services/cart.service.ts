import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

import { ProductModel } from '@core/models/product_model';
import { AlertService } from './alert.service';
import { CartStoreModel } from '@core/models/cart_store_model';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public currentProduct: ProductModel = {
    codeProduct: '', nameProduct: '', img_prod: '', totalValue: '', providerProduct: '', cantidadCart: 0, cant_nort: '', cant_sur: ''
  }
  public currentCartStore: CartStoreModel = {
    storeId: "",
    nameStore: "",
    cartIconCount: 0,
    goalAmount: 0,
    ProgressAmount: 0,
    BarProgressAmount: 0,
    RestantAmount: 0,
    goalAmountNumber: 0,
    ProgressAmountNumber: 0,
    BarProgressAmountNumber: 0,
    RestantAmountNumber: 0
  }
  private count = 0
  public countCart$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public numberProductsCart$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private productsList: any = []
  public iconCart = document.querySelector("#icon-cart")
  private classToHiddenIconCart = "is-hidden"
  public maxNumExceded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public currentAmountCart$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public restanteAmountCart$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public goalAmountCart$: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public barGoalsAmount$: BehaviorSubject<any> = new BehaviorSubject<any>("0")

  public currentAmountCartNumber$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public restanteAmountCartNumber$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public goalAmountCartNumber$: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public barGoalsAmountNumber$: BehaviorSubject<any> = new BehaviorSubject<any>("0")

  public storeId: any = ''
  public nameStore$: BehaviorSubject<string> = new BehaviorSubject<string>("")
  public alert: any = ''

  calificationIcon: BehaviorSubject<string> = new BehaviorSubject<string>('');
  calificationNumber: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private storeIdTicket: any = localStorage.getItem("CartStoreID")!
  private groupId: any = localStorage.getItem('group')
  public ticket = [{
    codcli_b: "",
    grupo: "",
    ultimacompra: 0,
    shoppingDetail: []
  }];

  public ultimacompra: any = ''

  cartItemsTicket: BehaviorSubject<any> = new BehaviorSubject<any>('');
  jsonPARSE: any[] = []
  // Clean code
  public groupProductsMix: ProductModel[] = []
  public isProducstMixLoaded = false

  constructor(
    private _alertService: AlertService,
    private router: Router,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private http: HTTP
  ) {
    this.numberProductsCart$.next(0)
    this.ultimacompra = localStorage.getItem("ultimacompra")
  }

  openCartModal(productObject: ProductModel) {
    this.currentProduct = productObject
    this.storeId = localStorage.getItem("CartStoreID")
    this.nameStore$.next(localStorage.getItem("nameStoreId")!)

    if (this.isProductExistIntoCart(this.currentProduct)) {
      this.regenerateProductQunatity() // Actualizar la cantidad del producto
    } else {
      if (this.count > 0) {
        this.count = 0
        this.countCart$.next(0)
      }
      // Agregar por primera vez
      this.changeQuantityCurrentProduct(this.increment())
      this.currentProduct.cantidadCart = this.countCart$.value
    }
  }

  showButtonsToCarProduct(productObject: ProductModel) {
    this.currentProduct = productObject
    this.storeId = localStorage.getItem("CartStoreID")
    this.nameStore$.next(localStorage.getItem("nameStoreId")!)

    if (this.isProductExistIntoCart(this.currentProduct)) {
      this.regenerateProductQunatity() // Actualizar la cantidad del producto
    } else {
      if (this.count > 0) {
        this.count = 0
        this.countCart$.next(0)
      }
      // Agregar por primera vez
      this.changeQuantityCurrentProduct(this.increment())
      this.currentProduct.cantidadCart = this.countCart$.value
    }
  }

  regenerateProductQunatity() {
    let productList = JSON.parse(this.getProductsCartList())
    productList = productList.find((p: ProductModel) => {
      if (p.codeProduct === this.currentProduct.codeProduct) {
        this.currentProduct.cantidadCart = p.cantidadCart;
      }
      this.changeQuantityCurrentProduct(Number(this.currentProduct.cantidadCart))
    });
  }

  isProductExistIntoCart(productObject: ProductModel) {
    const productList = JSON.parse(this.getProductsCartList())
    if (productList) {
      this.productsList = productList
      return productList.find((p: ProductModel) => p.codeProduct === productObject.codeProduct)
    }
  }

  closeCartModal() {
    this.addCartProduct(this.currentProduct) //- Add new product into Cart
    // Reset cart
    this.changeQuantityCurrentProduct(0)
    this.calculateValueAmount(1) //- Calculate current amount cart
    localStorage.removeItem("TempVG")
    this.saveCartProgressInCart()
    const iconCart = document.querySelector('#headerActions')
    if (iconCart?.classList.contains('is-opacity')) {
      iconCart.classList.remove('is-opacity')
    }
  }

  quantityIntoModal(op: number) {
    if (op === 1) {
      this.changeQuantityCurrentProduct(this.increment())
    } else {
      const restNumber = this.decrement()
      this.changeQuantityCurrentProduct(restNumber)
      if (restNumber === 0) {
        this.removeCartProduct()
      }
    }
    this.currentProduct.cantidadCart = this.countCart$.value
    this.saveCartProgressInCart()
  }

  quantityIntoInput(numberToChange: number) {
    this.changeQuantityCurrentProduct(Number(numberToChange))
    this.currentProduct.cantidadCart = this.countCart$.value
    if (Number(numberToChange) === 0) {
      this.removeCartProduct()
    }
    this.saveCartProgressInCart()
  }

  changeQuantityCurrentProduct(num: number) {
    this.countCart$.next(num)
    this.count = num
    if (num > this.validateMaxProductQuantity()) {
      this.maxNumExceded.next(true)
      this._alertService.showAlert("Stock del producto", "La cantidad supera el limite de productos en stock", "error")
    } else {
      this.maxNumExceded.next(false)
    }
  }

  validateMaxProductQuantity() {
    const maxNum = this.currentProduct.cant_sur! > this.currentProduct.cant_nort! ? this.currentProduct.cant_sur : this.currentProduct.cant_nort
    return Number(maxNum)
  }

  addCartProduct(newProduct: ProductModel) {
    this.productsList.push(newProduct)
    this.setProductsCartList(this.productsList)
    this.updateQuantityProductsIntoCart(1)
    this._alertService.showAlert('¡Carrito actualizado!', 'Producto agregado correctamente', 'success')
    this.productsList = []
  }

  removeCartProductButton(currentProduct: ProductModel) {
    this.storeId = localStorage.getItem("CartStoreID")
    const productList = JSON.parse(this.getProductsCartList())
    const newProductsCart = productList.filter((product: ProductModel) => product.codeProduct !== currentProduct.codeProduct);
    this.currentProduct = currentProduct
    this.productsList = newProductsCart
    this.setProductsCartList(newProductsCart)
    this.calculateValueAmount(0) //- Calculate current amount cart
    this.updateQuantityProductsIntoCart(0)

    this._alertService.showAlert('¡Carrito actualizado!', 'Producto eliminado correctamente', 'success')
    const productCurrent = document.querySelector(`#productCheckout-${currentProduct.codeProduct}`)
    const tagExlcusive = document.querySelector(`#exclusive-tag`)
    productCurrent?.classList.add("is-hidden")
    tagExlcusive?.classList.add("is-hidden")

    this.saveCartProgressInCart()
    this.getRunTicket().finally(() => {
      this.getRunTicketAsyncProduct()
    })

    if (this.currentAmountCart$.getValue() === 0) {
      this.router.navigate(['/', 'client-visit', 'cart'])
    }
  }

  getOrderProducts() {
    const tempArray: any = []
    const products = localStorage.getItem(`ProductsCart-${this.storeIdTicket}`)
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
    this.ticket[0].codcli_b = this.storeIdTicket
    this.ticket[0].grupo = this.groupId
    this.ticket[0].ultimacompra = Number(this.ultimacompra)
    this.ticket[0].shoppingDetail = this.getOrderProducts()

    return window.btoa(unescape(encodeURIComponent(JSON.stringify(this.ticket))))
  }

  async getRunTicket() {
    try {
      const res: any = await this.getRunTicket$(this.encodeTicketProductsToSend()).toPromise();
      const { data } = JSON.parse(res.data);
      this.jsonPARSE = data
    } catch (error) {
      // Manejar el error si es necesario
      console.error("Error al obtener el ticket:", error);
    }
  }

  async getRunTicketAsyncProduct() {
    this.cartItemsTicket.next([])
    this.groupProductsMix = []

    this.storeId = localStorage.getItem("CartStoreID")
    this.productsList = JSON.parse(localStorage.getItem(`ProductsCart-${this.storeId}`)!)

    if (typeof this.jsonPARSE !== 'undefined') {
      this.cartItemsTicket.next([...this.jsonPARSE]);
      this.groupProductsMix.push(...this.productsList, ...this.jsonPARSE);
    } else {
      this.groupProductsMix.push(...this.productsList);
      this.isProducstMixLoaded = true;
    }

    this.isProducstMixLoaded = true;

    if (this.cartItemsTicket.getValue().length > 0) {
      this._alertService.showAlert(
        'Productos por bonificación EN EL SERVICIO',
        `Se agregaron ${this.cartItemsTicket.getValue().length} productos como bonificación a tu orden`,
        'success'
      );

    }
  }


  removeCartProduct() {
    const productList = JSON.parse(this.getProductsCartList())
    this.productsList = []
    const newProductsCart = productList.filter((product: ProductModel) => product.codeProduct !== this.currentProduct.codeProduct);
    this.productsList = newProductsCart
    this.setProductsCartList(newProductsCart)
    // Reset cart
    this.countCart$.next(0)
    this.count = 0
    this.calculateValueAmount(0) //- Calculate current amount cart
    this.updateQuantityProductsIntoCart(0)
    this.saveCartProgressInCart()

    this.modalController.getTop().then((modal: any) => {
      modal.dismiss();
    });

    this._alertService.showAlert('¡Carrito actualizado!', 'Producto eliminado correctamente', 'success')

    if (window.location.pathname.includes('checkout')) {
      const productCurrent = document.querySelector(`#productCheckout-${this.currentProduct.codeProduct}`)
      productCurrent?.classList.add("is-hidden")
    }
  }

  updateQuantityProductsIntoCart(option: number) {
    const productList = JSON.parse(this.getProductsCartList())
    let count = productList.length > 0 ? productList.length : 0

    if (option === 1) {
      this.numberProductsCart$.next(count)
    } else {
      this.numberProductsCart$.next(count)
    }

    this.showIconCart(count)
  }

  showIconCart(count: number) {
    if (this.iconCart) {
      const parentIcon = this.iconCart.closest(".js-target-iconCart")
      if (count > 0) {
        parentIcon!.classList.remove(this.classToHiddenIconCart)
      } else if (count <= 0) {
        parentIcon!.classList.add(this.classToHiddenIconCart)
      }
      this.iconCart.innerHTML = this.numberProductsCart$.value.toString()
    }
  }

  setProductsCartList(newProductList: ProductModel[]): void {
    const formattedListProduct = this.removeDuplicatesIntoList(newProductList, "codeProduct")
    localStorage.setItem(`ProductsCart-${this.storeId}`, JSON.stringify(formattedListProduct))
  }

  getProductsCartList(): any {
    return localStorage.getItem(`ProductsCart-${this.storeId}`)
  }

  /**
   *
   *
   * @private
   * @param {*} originalProductList List of products to compare
   * @param {string} codeProduct Property of the object to compare
   * @return {Array} newArray A new array of products without duplicates 
   * @memberof CartService
   */
  private removeDuplicatesIntoList(originalProductList: any, codeProduct: string): Array<any> {
    var newArray = [];
    var lookupObject: any = {};

    for (var i in originalProductList) {
      lookupObject[originalProductList[i][codeProduct]] = originalProductList[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  calculateValueAmount(operacion: number) {
    const productList = JSON.parse(this.getProductsCartList())
    const quantityAmount = productList.map((p: ProductModel) => {
      const numFormated = p.totalValue.toString().replace('.', '')
      return Number(numFormated) * p.cantidadCart!
    })
    this.currentAmountCart$.next(quantityAmount.reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0));
    // const productList2 = JSON.parse(this.getProductsCartlist());
    // const updatedProductList = productList2.map((product: ProductModel) => {
    //   const updatedQuantity = Number(product.totalValue) * product.cantidadCart!;
    //   return {
    //     ...product,
    //     cantidadCart: updatedQuantity
    //   };
    // });
    this.calculateGoalCart(operacion)
  }

  calculateGoalCart(operacion: number) {
    if (operacion !== 2) {

      this.goalAmountCart$.next(Number(localStorage.getItem("metaTemporal")))
      const goalAmount = this.goalAmountCart$.value; // Redondear hacia abajo para obtener un número entero
      const restanteAmount = goalAmount - this.currentAmountCart$.value; // Redondear hacia abajo para obtener un número entero

      if (restanteAmount >= 0) {
        this.restanteAmountCart$.next(restanteAmount);
      } else {
        this.restanteAmountCart$.next(0);
      }

      const progresBar = 1 - (this.currentAmountCart$.value / goalAmount)
      const formatProgresBar = 1 - progresBar
      this.barGoalsAmount$.next(formatProgresBar)
      this.getCalification()

      const cartStoreId = localStorage.getItem('CartStoreID')!
      let response: any = ""
      this.validationForProductSkuGoal$(cartStoreId, this.currentProduct.codeProduct).subscribe({
        next: (res) => {
          response = JSON.parse(res.data)
        },
        complete: () => {
          if (response.response == 1) {
            let resultadoOperacion = 0
            let VARIABLE_GLOBAL_JULI = 0

            if (localStorage.getItem("TempVG") && VARIABLE_GLOBAL_JULI == 0) {
              VARIABLE_GLOBAL_JULI = Number(localStorage.getItem("TempVG"))
            }

            if (operacion == 0) {
              resultadoOperacion = VARIABLE_GLOBAL_JULI -= Number(this.currentProduct.cantidadMeta)
            } else if (operacion == 1) {
              resultadoOperacion = VARIABLE_GLOBAL_JULI += Number(this.currentProduct.cantidadMeta)
            }

            localStorage.setItem('TempVG', resultadoOperacion.toString())
            const totalProducts = resultadoOperacion
            this.goalAmountCartNumber$.next(parseInt(localStorage.getItem("sku")!))
            this.restanteAmountCartNumber$.next(parseInt(localStorage.getItem("sku")!) - totalProducts)
            this.currentAmountCartNumber$.next(totalProducts)
            const progresBarSKU = 1 - (totalProducts / parseInt(localStorage.getItem("sku")!))
            const formatProgresBarSKU = 1 - progresBarSKU
            this.barGoalsAmountNumber$.next(formatProgresBarSKU)
          }
        }
      })
    }
  }

  validationForProductSkuGoal$(idclient: string, producto: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/productoVenta?cliente=${idclient}&producto=${producto}`,
      '',
      environment.headers
    ))
  }

  saveCartProgressInCart() {
    this.storeId = localStorage.getItem("CartStoreID")
    this.currentCartStore.storeId = this.storeId
    this.currentCartStore.cartIconCount = this.numberProductsCart$.value
    this.currentCartStore.goalAmount = this.goalAmountCart$.value
    this.currentCartStore.ProgressAmount = this.currentAmountCart$.value
    this.currentCartStore.RestantAmount = this.restanteAmountCart$.value
    this.currentCartStore.BarProgressAmount = this.barGoalsAmount$.value

    this.currentCartStore.goalAmountNumber = this.goalAmountCartNumber$.value
    this.currentCartStore.ProgressAmountNumber = this.currentAmountCartNumber$.value
    this.currentCartStore.RestantAmountNumber = this.restanteAmountCartNumber$.value
    this.currentCartStore.BarProgressAmountNumber = this.barGoalsAmountNumber$.value

    localStorage.setItem(`cartProgress-${this.storeId}`, JSON.stringify(this.currentCartStore));
  }

  saveCartProgress() {
    this.storeId = localStorage.getItem("CartStoreID")

    this.currentCartStore.storeId = this.storeId
    this.currentCartStore.cartIconCount = this.numberProductsCart$.getValue()
    this.currentCartStore.goalAmount = this.goalAmountCart$.value
    this.currentCartStore.ProgressAmount = this.currentAmountCart$.value
    this.currentCartStore.RestantAmount = this.restanteAmountCart$.value
    this.currentCartStore.BarProgressAmount = this.barGoalsAmount$.value

    this.currentCartStore.goalAmountNumber = this.goalAmountCartNumber$.value
    this.currentCartStore.ProgressAmountNumber = this.currentAmountCartNumber$.value
    this.currentCartStore.RestantAmountNumber = this.restanteAmountCartNumber$.value
    this.currentCartStore.BarProgressAmountNumber = this.barGoalsAmountNumber$.value

    localStorage.setItem(`cartProgress-${this.storeId}`, JSON.stringify(this.currentCartStore));

    setTimeout(() => {
      this.currentAmountCart$.next(0)
      this.restanteAmountCart$.next(this.goalAmountCart$.value)
      this.restanteAmountCartNumber$.next(this.goalAmountCartNumber$.value)
      this.barGoalsAmount$.next(0)
      this.productsList = []
      if (this.iconCart) {
        const parentIcon = this.iconCart.closest(".js-target-iconCart")
        parentIcon!.classList.add(this.classToHiddenIconCart)
        this.iconCart.innerHTML = '0'
      }
    }, 500)

  }

  getCalification() {
    let dosDigitosDespuesDelPunto = Number(this.barGoalsAmount$.getValue().toFixed(2).split('.')[1]);

    if (this.barGoalsAmount$.getValue() <= 0.20) {
      this.calificationIcon.next("triste.png")
    } else if (this.barGoalsAmount$.getValue() <= 0.40) {
      this.calificationIcon.next("medal_three.svg")
    }
    else if (this.barGoalsAmount$.getValue() <= 0.70) {
      this.calificationIcon.next("medal_two.svg")
    } else if (this.barGoalsAmount$.getValue() >= 0.71) {
      this.calificationIcon.next("medal_one.svg")
      dosDigitosDespuesDelPunto = 100
    }

    this.calificationNumber.next(dosDigitosDespuesDelPunto)
    localStorage.setItem("TempBarProgresIcon", this.calificationIcon.getValue().toString())
    localStorage.setItem("TempBarProgresNumber", dosDigitosDespuesDelPunto.toString())
  }

  goToCheckout() {
    this.storeId = localStorage.getItem("CartStoreID")
    this.calculateValueAmount(2)

    const productList = JSON.parse(this.getProductsCartList())
    let count = productList.length > 0 ? productList.length : 0

    localStorage.setItem("TempCartAmount", this.currentAmountCart$.getValue().toString())
    localStorage.setItem("TempCartProductsQuantity", count)
    this.showAlertOrderState()
  }

  public async showAlertOrderState() {
    const stateOrder = localStorage.getItem(`orderPending-${this.storeId}`) !== 'true' ? 'PENDIENTE' : 'FACTURADO'

    this.alert = await this.alertCtrl.create({
      header: 'Confirmar estado del pedido',
      message: `¿Guardar pedido con el estado ${stateOrder}?`,
      cssClass: `c-alert is-warning`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log("no necesita handler")
          },
        },
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => {
            const state = stateOrder === "PENDIENTE" ? 'false' : 'true'
            localStorage.setItem(`orderPending-${this.storeId}`, state)
            this.router.navigate(['/', 'client-visit', 'checkout'])
          },
        },
      ],
    });

    await this.alert.present();
  }

  getRunTicket$(dataTicket: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/runTickets?dataTicket=${dataTicket}`,
      '',
      environment.headers
    ))
  }

  sendOrder(idOrder: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/sendOrderVendedor?idOrder=${idOrder}`,
      '',
      environment.headers
    ))
  }

  private increment(): number {
    return ++this.count;
  }

  private decrement(): number {
    return --this.count;
  }
}
