import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HideBothMenusGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    setTimeout(() => {
      const footer = document.querySelector("app-footer")!
      const header = document.querySelector("app-header")!
      if (
        window.location.pathname.includes("checkout")
        || window.location.pathname.includes("store-detail")
        || window.location.pathname.includes("history-orders")
        || window.location.pathname.includes("order-detail")
        || window.location.pathname.includes("list-orders")
        || window.location.pathname.includes("metrics")
        || window.location.pathname.includes("incentivo")
        || window.location.pathname.includes("list-stores")
        || window.location.pathname.includes("catalog/list")
        || window.location.pathname.includes("product-detail")
        || window.location.pathname.includes("billing-time")
        || window.location.pathname.includes("frequent-question")
        || window.location.pathname.includes("oportunity")
        || window.location.pathname.includes("semaforo-impact")
        || window.location.pathname.includes("devolutions")
        || window.location.pathname.includes("discounts")
        || window.location.pathname.includes("forgot-password")
        || window.location.pathname.includes("update-password")
      ) {
        header.classList.add("is-hidden")
        footer.classList.add("is-hidden")
      } else {
        if (!window.location.pathname.includes('cart')) {
          header.classList.remove("is-hidden")
          footer.classList.remove("is-hidden")
          header.querySelector(".c-header__actions")?.classList.add("is-opacity")
        } else {
          header.classList.remove("is-hidden")
          setTimeout(() => {
            header.querySelector(".c-header__actions")?.classList.remove("is-opacity")
          }, 500)
          footer.classList.add("is-hidden")
        }
      }
    }, 200)
    return true;
  }

}
