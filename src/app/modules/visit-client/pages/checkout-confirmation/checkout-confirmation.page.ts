import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ProductModel } from '@core/models/product_model';
import { VisitClientModule } from '@modules/visit-client/visit-client.module';


@Component({
  selector: 'app-checkout-confirmation',
  templateUrl: './checkout-confirmation.page.html',
  styleUrls: ['./checkout-confirmation.page.scss'],
  standalone: true,
  imports: [VisitClientModule]
})
export class CheckoutConfirmationPage implements OnInit {
  orderId: string = ''
  orderDetail: string = ''
  orderProducts: any[] = []
  storeId = localStorage.getItem("CartStoreID")
  public order = {
    orderId: "",
    totalValue: 0,
    totalProducts: 0,
    customerName: "",
    address: "",
    phone: "",
    status: "",
    date: "",
    image: ""
  };
  totalValue: any = 0
  productsCount = 0
  productsTotalValue = 0

  constructor(private router: Router) {

  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.getOrderData()
  }

  getOrderData() {
    this.orderId = localStorage.getItem("currentOrderId")!
    this.getProductsOrder()
  }

  getProductsOrder() {
    const tempListProducts = JSON.parse(localStorage.getItem(`currentOrderProducts-${this.storeId}`)!)

    tempListProducts.forEach((p: ProductModel) => {
      const product = {
        img_prod: '',
        nameProduct: '',
        porcDescuento: '',
        precioSinDcto: '',
        totalValue: 0,
        calculateValue: 0,
        cantidadCart: 0
      }

      product.nameProduct = p.nameProduct ? p.nameProduct : p.nompro_b!;
      product.img_prod = p.img_prod
      product.cantidadCart = p.cantidadCart ? Number(p.cantidadCart) : p.cantidad!

      if (typeof (p.precioSinDcto) !== 'undefined') {
        product.precioSinDcto = p.precioSinDcto!
        product.porcDescuento = p.porcDescuento!
        product.totalValue = Number(p.totalValue)
        product.calculateValue = Number(product.totalValue.toString().replace('.', '')) * product.cantidadCart
      } else {
        product.precioSinDcto = '0'
        product.porcDescuento = '0'
        product.totalValue = 0
        product.calculateValue = 0
      }
      this.orderProducts.push(product)
    });

    this.productsCount = tempListProducts.length;
    const quantityAmount = tempListProducts.map((p: ProductModel) => {
      let totalValueTemp = 0
      if (typeof (p.totalValue) !== 'undefined') {
        const numFormated = p.totalValue.toString().replace('.', '')
        totalValueTemp = Number(numFormated) * p.cantidadCart!
      }
      return totalValueTemp
    })
    this.productsTotalValue = Number(
      quantityAmount.reduce(
        (
          accumulator: any,
          currentValue: any
        ) => accumulator + currentValue, 0)
    )
  }

  obtenerFechaFormateada() {
    const fecha = new Date();
    const diasSemana = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
    const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    const diaSemanaAbreviado = diasSemana[fecha.getDay()];
    const diaMes = fecha.getDate();
    const mesAbreviado = meses[fecha.getMonth()];

    return `${diaSemanaAbreviado} ${diaMes} ${mesAbreviado}`;
  }

  resetCart() {
    localStorage.removeItem(`ProductsCart-${this.storeId}`)
    localStorage.removeItem(`cartProgress-${this.storeId}`)
    localStorage.removeItem(`currentOrderProducts-${this.storeId}`)
    localStorage.removeItem('currentOrderDetail')
    localStorage.removeItem('CartStoreID')
    localStorage.removeItem('currentOrderId')
    localStorage.removeItem('TempBarProgresIcon')
    localStorage.removeItem('TempBarProgresIcon')
    localStorage.removeItem('TempCartProductsQuantity')
    localStorage.removeItem('TempBarProgresNumber')
    localStorage.removeItem('TempCartAmount')
    localStorage.removeItem('TempBarProgresIcon')
    localStorage.removeItem('nameStoreId')
    localStorage.removeItem('historyCountCart')
    localStorage.removeItem(`orderPending-${this.storeId}`)
    localStorage.removeItem('idPedidoCurrentOrderPend')
    localStorage.removeItem('metaCurrentPedido')

    localStorage.setItem('goToCheckoutConfirmation', 'true')
    setTimeout(() => {
      console.log(localStorage.getItem('goToCheckoutConfirmation'))
      this.router.navigate(['/', 'client-visit', 'list-stores'])
    }, 500)

  }

  toggleDropdown(e: any) {
    e.target.closest(
      '.o-checkout__dropdown'
    ).classList.toggle('is-dropdown-show');
  }

  toggleDropdownProduct(e: any) {
    e.target.closest(
      '.c-status'
    ).classList.toggle('is-dropdown-show');
  }

}
