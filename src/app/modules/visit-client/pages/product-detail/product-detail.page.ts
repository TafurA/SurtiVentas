import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ProductModel } from '@core/models/product_model';
import { IonicSlides } from '@ionic/angular';
import { VisitClientModule } from '@modules/visit-client/visit-client.module';
import { ProductService } from '@shared/services/product.service';
import Swiper, { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [VisitClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailPage implements OnInit {
  product: ProductModel = {
    codeProduct: '',
    nameProduct: '',
    descrProduct: '',
    img_prod: '',
    img_prod1: '',
    img_prod2: '',
    img_prod3: '',
    totalValue: ''
  }
  isDescriptionDropdown: boolean = false
  swiperModules = [IonicSlides];
  slidesPerView = 'auto'
  relatedProducts: any[] = []
  isProductsRelatedLoad: boolean = false
  private bodega: any = localStorage.getItem('bodega')

  constructor(private _productService: ProductService, public rutaActiva: ActivatedRoute) { }

  ngOnInit() {
    this.getProductDetail()
    this.getRelatedProducts()
  }

  getProductDetail() {
    this.getCurrentProduct().then(() => {
      this._productService.getProductDetail$(this.product.codeProduct).subscribe({
        next: (res: any) => {
          const { dataObjProduct } = JSON.parse(res.data)
          this.product = dataObjProduct[0]
        },
        complete: () => {
          this.showDropdownDescription()
        }
      })
    })
  }

  getRelatedProducts() {
    this._productService.getRelatedProductsList$(this.product.codeProduct, this.bodega).subscribe({
      next: (res) => {
        const { dataObjRelated } = JSON.parse(res.data)
        this.relatedProducts = dataObjRelated
      },
      complete: () => {
        this.isProductsRelatedLoad = true;
      }
    })
  }

  public async getCurrentProduct() {
    await this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.product.codeProduct = params['idProduct'];
      })
  }

  public showDropdownDescription() {
    if (this.product.descrProduct!.length > 180) {
      this.isDescriptionDropdown = true
    } else {
      this.isDescriptionDropdown = false
    }
  }

  toggleDropdown(e: any) {
    e.target.closest(
      ".o-detail__dropdown"
    ).classList.toggle("is-dropdown-show")
  }

}
