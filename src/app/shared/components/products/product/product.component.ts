import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';

import { ProductModel } from '@core/models/product_model';
import { CartService } from '@shared/services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @Input() productObject: ProductModel = {
    codeProduct: '',
    nameProduct: '',
    img_prod: '',
    providerProduct: '',
    totalValue: '',
    precioSinDcto: '',
    color_champions: '',
    cant_nort: '',
    cant_sur: '',
    cantidadCart: 0
  };
  @Input() isCheckout: boolean = false;
  @Input() isCatalog: boolean = false;
  @Input() isBonification: boolean = false;
  @Input() isGold: boolean = false;
  @ViewChild(IonModal) modal!: IonModal;

  name!: string;
  cartCount!: number;

  constructor(public _cartService: CartService, private modalController: ModalController) {
    this._cartService.countCart$.subscribe(count => {
      this.cartCount = count;
    });
  }

  ngOnInit() {
    this.calculateAmount()
    // if (this.productObject.codeProduct == '191179') {
    //   console.log("NOMBRE ORODUCTO: ", this.productObject)
    // }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
    this._cartService.closeCartModal()
    this.calculateAmount()
  }

  calculateAmount() {
    let totalAmount = 0
    if (this.productObject.totalValue) {
      totalAmount = Number(this.productObject.totalValue.replace('.', '')) * this.productObject.cantidadCart!
    }
    return totalAmount
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

  openModalCart() {
    this.productObject.cant_nort = "45"
    this.productObject.cant_sur = "25"
    this.productObject.isGold = this.isGold
    this._cartService.openCartModal(this.productObject)
  }

  removeCartProduct(idProduct: ProductModel) {
    this._cartService.removeCartProductButton(idProduct)
  }

}
