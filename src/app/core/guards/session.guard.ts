import { Injectable } from '@angular/core';
// TODO: Revisar CanActivate en desuso
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkCookieSession();
  }

  /**
   * Comprueba si existe un token en la cookie del navegador y redirige a la página de autenticación si no se encuentra.
   *
   * @return {token} Valor booleano que indica si existe el token o no `true` or `false`.
   * @throws excepción si ocurre un error al procesar la cookie.
   * @access private
   * @memberOf SessionGuard
   */
  private checkCookieSession(): boolean {
    try {
      const token: boolean = this.cookieService.check('sessionToken')
      if (!token) {
        this.router.navigate(['/', 'auth'])
      }
      return token
    } catch (e) {
      console.log('Algo sucedió al guardar la Cookie de sesión 🔴', e);
      return false
    }
  }

}
