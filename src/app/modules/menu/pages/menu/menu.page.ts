import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemNavigationMenu } from '@core/models/item_navigation_menu.model';

import { UserSellerModel } from '@core/models/user_seller_model';
import { AuthService } from '@modules/auth/services/auth.service';
import { MenuModule } from '@modules/menu/menu.module';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [MenuModule]
})
export class MenuPage implements OnInit {

  protected userModel: UserSellerModel = {
    userId: '',
    name: '',
    lastName: '',
  }

  /**
   * Define a list with the sub menu navigation
   * @type {Array<ItemNavigationMenu>}
   * @memberof MenuComponent
   */
  protected NAVIGATION_MENU: Array<ItemNavigationMenu> = []

  constructor(
    private _authService: AuthService,
    private _cookie: CookieService,
    private router: Router
  ) {
    this.NAVIGATION_MENU = [
      {
        ico: 'user',
        title: 'Mis Datos',
        pathModule: '/auth/profile',
      },
      {
        ico: 'eye',
        title: 'Actualizar contraseña',
        pathModule: '/auth/update-password',
      },
      {
        ico: 'devolution',
        title: 'Devoluciones',
        pathModule: '/client-visit/devolutions',
      },
    ]
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.getSellerData()
  }

  getSellerData() {
    const { name, lastName } = this._authService.getDataSessionStorage()
    this.userModel.name = `${name} ${lastName}`
  }

  toggleDropdownSupport(e: any) {
    e.target.closest(
      ".js-dropdown-target"
    ).classList.toggle("is-dropdown-show")
  }

  logOut() {
    localStorage.clear()
    sessionStorage.clear()
    this._cookie.deleteAll()
    this.router.navigate(['/', 'auth', 'login'])
  }

}
