import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CartService } from '@shared/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchComponent') searchComponent: ElementRef = new ElementRef('')

  constructor(public _cartService: CartService) { }

  ngOnInit() { }

  protected showSearchInput() {
    const searchNativeElement: HTMLElement = this.searchComponent.nativeElement
    searchNativeElement.classList.add("is-open");
  }

  showSearch() {
    const elementDomScroll = document.querySelector('#search-component-scroll')!
    const elementDom = document.querySelector('#search-component')!
    elementDom.classList.remove("is-hidden")
    elementDomScroll.scrollIntoView({ behavior: 'smooth' });
  }

}
