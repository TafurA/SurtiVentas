import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ItemNavigationMenu } from '@core/models/item_navigation_menu.model';

import { AuthService } from '@modules/auth/services/auth.service';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  /**
   * Define a list with the principal menu navigation
   * @type {Array<ItemNavigationMenu>}
   * @memberof MenuComponent
   */
  protected NAVIGATION_MENU: Array<ItemNavigationMenu> = []
  private idSeller: string = localStorage.getItem('codemp_b')!
  private alert: any = ''

  constructor(
    private router: Router,
    private _authService: AuthService,
    private alertController: AlertController,
    private alertService: AlertService
  ) {
    this.NAVIGATION_MENU = [
      {
        ico: 'visit',
        title: 'VISITAR CLIENTE',
        description: 'Gestión clientes',
        pathModule: '/client-visit/list-stores',
        color: '#013D7E'
      },
      {
        ico: 'route-outline',
        title: 'RUTERO',
        description: 'Administrar',
        pathModule: '/rut/list-stores',
        color: '#C960E6',
      },
      {
        ico: 'work-history-outline',
        title: 'HISTORIAL',
        description: 'Gestión pedidos',
        pathModule: '/history/list-orders',
        color: '#57CB6B',
      },
      {
        ico: 'graph-box',
        title: 'MÉTRICAS',
        description: 'Mediciones',
        pathModule: '/metrics/list',
        color: '#399CEC',
      },
      {
        ico: 'catalog',
        title: 'CATÁLOGOS',
        description: 'Gestión catálogos',
        pathModule: '/catalog/list',
        color: '#F5D449',
      },
      {
        ico: 'prize',
        title: 'INCENTIVOS',
        description: 'Programas',
        pathModule: '/incentivo/home',
        color: '#FF9797',
      },
    ]
  }

  ngOnInit() { }

  hrefToPage(href: string, btn: any) {
    if (btn === "visit") {
      this._authService.checkAsistenciaSeller(this.idSeller).subscribe({
        next: (res) => {
          const { response, message } = JSON.parse(res.data)
          if (!response) {
            this.presentAlert(message)
          } else {
            this.validateCurrentRout(href)
          }
        }
      })
    } else if (btn === "router") {
      this.validateCurrentRout(href)
    }
  }

  validateCurrentRout(href: string) {
    if (localStorage.getItem("currentRout")) {
      this.router.navigate([href])
    } else {
      this.alertService.showAlert("Ruta del dia", 'Cambia tu ruta del dia', 'error')
    }
  }

  async presentAlert(message: string) {
    this.alert = await this.alertController.create({
      header: 'Control de asistencia',
      message: message,
      cssClass: `c-alert is-error`
    });

    await this.alert.present();
  }
}
