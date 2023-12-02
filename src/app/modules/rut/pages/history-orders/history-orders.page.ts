import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OrderModel } from '@core/models/order_model';
import { RutModule } from '@modules/rut/rut.module';
import { OrdersService } from '@modules/rut/services/orders.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-history-orders',
  templateUrl: './history-orders.page.html',
  styleUrls: ['./history-orders.page.scss'],
  standalone: true,
  imports: [RutModule]
})
export class HistoryOrdersPage implements OnInit {
  public arrayDataOrders: any[] = []
  public loaded = false
  private sellerId = localStorage.getItem('codemp_b')!
  private cartStoreId = localStorage.getItem('CartStoreID')!
  isEmpty: boolean = false
  searchTerm$ = new Subject<string>();
  listFiltered: any[] = [];
  isTerm: boolean = false
  isOrdersLoaded: boolean = false
  allOrdersList: any[] = []

  constructor(private _orderService: OrdersService, private router: Router) { }

  ngOnInit() {
    this.getOrder()
  }

  getOrder() {
    this.loaded = false
    this._orderService.getOrdersListByStore$(this.sellerId).subscribe({
      next: (res) => {
        const dataObject = JSON.parse(res.data)
        const { INTRANET } = dataObject.data
        this.arrayDataOrders.push(...INTRANET)
        this.loaded = true

        if (this.arrayDataOrders.length === 0) {
          this.isEmpty = true
        }
      },
      complete: () => {
        this.loaded = true
        this.allOrdersList = this.arrayDataOrders
        this.filterList()
      }
    })
  }


  filterList(): void {
    this.searchTerm$.subscribe((term: any) => {
      let newListOrders: any[] = []
      this.arrayDataOrders.forEach((element: any) => {
        newListOrders.push(element)
      });

      console.log(term)
      console.log(this.arrayDataOrders)

      this.listFiltered = newListOrders
        .filter(item => item.idpedido.toLowerCase().indexOf(term.toLowerCase()) >= 0);

      if (term.length >= 3) {
        this.arrayDataOrders = this.listFiltered
        this.loaded = true
      } else if (term.length < 2) {
        this.arrayDataOrders = this.allOrdersList
        this.loaded = false
        setTimeout(() => {
          this.loaded = true
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

  getProductSubCategories(): string[] {
    const subCategoriesSet = new Set<string>();
    for (const productObject of this.arrayDataOrders) {
      subCategoriesSet.add(productObject.Mes!);
    }
    return Array.from(subCategoriesSet);
  }

  getProductGroup(Mes: string): OrderModel[] {
    return this.arrayDataOrders.filter(o => o.Mes === Mes);
  }

  saveCurrentDetail(order: OrderModel) {
    console.log(order)
    const orderTemp = {
      pedidoId: order.idpedido,
      productos: order.productos,
      valped_b: order.valped_b,
      fecha: order.fecha,
      estped_b: order.estped_b
    }
    localStorage.setItem('oderDetail', JSON.stringify(orderTemp))
    localStorage.setItem('orderDetailIdPedido', order.idpedido)
    this.router.navigate(['/', 'rut', 'order-detail', order.idpedido])
  }

  toggleDropdown(e: any) {
    e.target.closest(
      '.o-checkout__dropdown'
    ).classList.toggle('is-dropdown-show');
  }

}
