import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appImgBroken]'
})
export class ImgBrokenDirective {
  @Input() customImg: string | boolean = false

  // Listener HTMLElement Image
  @HostListener('error') handleError(): void {
    const elNative = this.elHost.nativeElement
    this.customImg ? elNative.src = this.customImg : elNative.src = 'https://ionicframework.com/docs/img/demos/thumbnail.svg'
  }

  constructor(private elHost: ElementRef) { }
}
