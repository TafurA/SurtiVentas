import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductModel } from '@core/models/product_model';

import { RutModule } from '@modules/rut/rut.module';
import { OrdersService } from '@modules/rut/services/orders.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  standalone: true,
  imports: [RutModule]
})
export class OrderDetailPage implements OnInit {
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
    image: "",
  };
  totalValue: any = 0
  productsCount = 0
  productsTotalValue = 0
  dataOrder: any = ''
  isAnotherFPage: boolean = false

  constructor(private _orderService: OrdersService, public rutaActiva: ActivatedRoute) { }

  ngOnInit() {
    this.getData()
  }

  getData() {
    this.getCurrentOrder().then(() => {
      this._orderService.getOrderDetail(this.order.orderId).subscribe({
        next: (res) => {
          const dataObject = JSON.parse(res.data)
          const { ordersDetail } = dataObject
          const tempOrderProducts = ordersDetail[`${this.order.orderId}`]
          let totalProducts = 0
          tempOrderProducts.forEach((p: any) => {
            const product = {
              img_prod: '',
              nameProduct: '',
              porcDescuento: '',
              precioSinDcto: '',
              totalValue: 0,
              calculateValue: 0,
              cantidadCart: 0
            }
            product.img_prod = p.img_prod
            product.nameProduct = p.nameProduct
            product.precioSinDcto = p.precioSinDcto!
            product.porcDescuento = p.porcDescuento!
            product.cantidadCart = Number(p.cantidadCart)
            product.totalValue = Number(p.totalValue)
            product.calculateValue = Number(product.totalValue.toString().replace('.', '')) * product.cantidadCart
            if (!p.cantidadCart) {
              this.isAnotherFPage = true
              product.cantidadCart = Number(p.cantidad)
              product.totalValue = p.valorUnitario
              product.calculateValue = Number(product.totalValue.toString().replace('.', '')) * product.cantidadCart
              this.orderProducts.push(product)
              this.dataOrder.productos = this.orderProducts.length
              this.dataOrder.fecha = this.obtenerFechaFormateada()
              totalProducts = totalProducts + Number(product.calculateValue.toString().replace('.', ''))
              this.dataOrder.valped_b = totalProducts
            } else {
              this.orderProducts.push(product)
            }
          });
        }
      })
    })
  }


  public async getCurrentOrder() {
    await this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.order.orderId = params['idPedido'];
      })

    this.dataOrder = JSON.parse(localStorage.getItem('oderDetail')!)
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
