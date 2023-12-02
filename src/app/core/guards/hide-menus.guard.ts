import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HideMenusGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    setTimeout(() => {
      const footer = document.querySelector("app-footer")
      if (footer) {
        if (
          window.location.pathname.includes("cart") ||
          window.location.pathname.includes("billing-time") ||
          window.location.pathname.includes("list-stores")
        ) {
          footer.classList.add("is-hidden")
        } else {
          footer.classList.remove("is-hidden")
        }
      }
    }, 200)
    return true;
  }

}
