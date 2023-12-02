import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { HistoryModule } from '@modules/history/history.module';
import { OrdersService } from '@modules/rut/services/orders.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  standalone: true,
  imports: [HistoryModule]
})
export class OrderDetailPage implements OnInit {
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
  orderProducts: any[] = []
  dataOrder: any = ''

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
            product.cantidadCart = Number(p.cantidad.split('.')[0])
            product.totalValue = p.valorUnitario
            product.calculateValue = Number(product.totalValue.toString().replace('.', '')) * product.cantidadCart
            this.orderProducts.push(product)
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
