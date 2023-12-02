import { Component, Input, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { CartService } from '@shared/services/cart.service';

@Component({
  selector: 'app-history-cart',
  templateUrl: './history-cart.component.html',
  styleUrls: ['./history-cart.component.scss'],
})
export class HistoryCartComponent implements OnInit {
  @Input() modalIdentifier: string = '';

  constructor(public _cartService: CartService, private modalController: ModalController) { }

  ngOnInit() {
    this._cartService.numberProductsCart$.next(
      Number(localStorage.getItem('historyCountCart'))
    )
  }

  hideModalStoreDetail() {
    this.modalController.dismiss()
  }
}
