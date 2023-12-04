import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OrderModel } from '@core/models/order_model';

import { HistoryModule } from '@modules/history/history.module';
import { OrdersService } from '@modules/rut/services/orders.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
  standalone: true,
  imports: [HistoryModule]
})
export class OrdersListPage implements OnInit {
  private sellerId = localStorage.getItem('codemp_b')!
  public orderListAplication: any = []
  public orderListIntranet: any = []
  public loadedIntranet = false
  public loadedAplication = false
  searchTerm$ = new Subject<string>();
  searchTermAplication$ = new Subject<string>();
  listFilteredIntranet: any[] = [];
  listFilteredAplication: any[] = [];
  isTerm: boolean = false
  isOrdersLoaded: boolean = false
  allOrdersList: any[] = []
  allOrdersListAplication: any[] = []
  allOrdersListIntranet: any[] = []

  constructor(private _ordersService: OrdersService, private router: Router) { }

  ngOnInit() {
    this.getOrdersListIntranet('normal')
    this.getOrdersListAplication('normal')
  }

  getOrdersListAplication(action: string) {
    this._ordersService.getOrdersListBySeller$(this.sellerId).subscribe({
      next: (res) => {
        const { data } = res
        const { APLICACIÓN } = JSON.parse(data).data
        this.orderListAplication = APLICACIÓN
        console.log("EN ESTE MOSTRAR CAHSKBAC ", this.orderListAplication)
      },
      complete: () => {
        this.loadedAplication = true
        this.allOrdersListAplication = this.orderListAplication
        this.filterListAplication()

        if (action === "close") {
          const textInput: any = document.querySelector(".js-input-search")!
          textInput.value = ""
        }
      }
    })
  }

  getOrdersListIntranet(action: string) {
    this._ordersService.getOrdersListBySeller$(this.sellerId).subscribe({
      next: (res) => {
        const { data } = res
        const { INTRANET } = JSON.parse(data).data
        this.orderListIntranet = INTRANET
      },
      complete: () => {
        this.loadedIntranet = true
        this.allOrdersListIntranet = this.orderListIntranet
        this.filterListIntranet()

        if (action === "close") {
          const textInput: any = document.querySelector(".js-input-search-intra")!
          textInput.value = ""
        }
      }
    })
  }

  filterListAplication(): void {
    this.searchTermAplication$.subscribe((term: any) => {
      let newListOrders: any[] = []
      this.orderListAplication.forEach((element: any) => {
        newListOrders.push(element)
      });

      console.log(term)
      console.log(this.orderListAplication)

      this.listFilteredAplication = newListOrders
        .filter(item => item.nomcli_b.toLowerCase().indexOf(term.toLowerCase()) >= 0);

      if (term.length >= 3) {
        this.orderListAplication = this.listFilteredAplication
        this.loadedAplication = true
      } else if (term.length < 2) {
        this.orderListAplication = this.allOrdersListAplication
        this.loadedAplication = false
        setTimeout(() => {
          this.loadedAplication = true
        }, 1000)
      }
    })
  }

  filterListIntranet(): void {
    this.searchTerm$.subscribe((term: any) => {
      let newListOrders: any[] = []
      this.orderListIntranet.forEach((element: any) => {
        newListOrders.push(element)
      });

      console.log(term)
      console.log(this.orderListIntranet)

      this.listFilteredIntranet = newListOrders
        .filter(item => item.nomcli_b.toLowerCase().indexOf(term.toLowerCase()) >= 0);

      if (term.length >= 3) {
        this.orderListIntranet = this.listFilteredIntranet
        this.loadedIntranet = true
      } else if (term.length < 2) {
        this.orderListIntranet = this.allOrdersListIntranet
        this.loadedIntranet = false
        setTimeout(() => {
          this.loadedIntranet = true
        }, 1000)
      }
    })
  }

  sendWordAplication$(event: any) {
    this.searchTermAplication$.next(event.target.value)
    if (event.target.value.length >= 3) {
      this.isTerm = true
    } else {
      this.isTerm = false
    }
  }

  sendWord$(event: any) {
    this.searchTerm$.next(event.target.value)
    if (event.target.value.length >= 3) {
      this.isTerm = true
    } else {
      this.isTerm = false
    }
  }

  saveCurrentDetail(order: OrderModel) {
    const orderTemp = {
      pedidoId: order.idpedido,
      productos: order.productos,
      valped_b: order.valped_b,
      fecha: order.fecha,
      estped_b: order.estped_b
    }
    localStorage.setItem('oderDetail', JSON.stringify(orderTemp))
    // localStorage.setItem('orderDetailIdPedido', order.idpedido)
    this.router.navigate(['/', 'history', 'order-detail', order.idpedido])
  }

}
