import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { StoresService } from '@shared/services/stores.service';
import { AlertService } from '@shared/services/alert.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-start-visit',
  templateUrl: './start-visit.component.html',
  styleUrls: ['./start-visit.component.scss'],
})
export class StartVisitComponent implements OnInit {

  @Input() modalIdentifier: string = '';
  @Input() idStore: string = '';
  @Input() idPedido: string = '';
  @Input() nameStore: string = '';
  @Input() estped_b: string = '';
  @Input() metaCurrent: string = '';
  @Input() address: string = '';
  @Input() ultimacompra: string = '';

  constructor(
    private router: Router,
    private modalController: ModalController,
  ) { }

  ngOnInit() { }

  openModalToEndZero() {
    this.modalController.dismiss();
  }

  startClientVisit() {
    this.modalController.dismiss();
    this.router.navigate(['/', 'client-visit', 'cart']).then(() => {
      localStorage.setItem('CartStoreID', this.idStore)
      localStorage.setItem('nameStoreId', this.nameStore)
      localStorage.setItem('idPedidoCurrentOrderPend', this.idPedido)
      localStorage.setItem('metaCurrentPedido', this.metaCurrent)
      localStorage.setItem('currentOrderState', this.estped_b)
      localStorage.setItem('currentOrderAddress', this.address)
      localStorage.setItem('ultimacompra', this.ultimacompra)
    })
  }

}
