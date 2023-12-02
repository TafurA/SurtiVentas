import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonicSlides } from '@ionic/angular';
import { Subject } from 'rxjs';

import { ProductModel } from '@core/models/product_model';
import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {
  swiperModules = [IonicSlides];
  @Input() title: string = 'PRODUCTOS RECOMENDADOS'
  @Input() productsList: ProductModel[] = []
  @Input() productsListRecommended: ProductModel[] = []
  allProductsList: ProductModel[] = []
  public isOffers: boolean = false
  public isProductOffers: boolean = false
  public isFiltersShow: boolean = false
  resetSlider: boolean = false;
  private groupId: any = localStorage.getItem('group')
  public selectedProvider = ''
  public categoriesList: any[] = []
  public REALcategoriesList: any[] = []
  selectedCategories: string[] = [];
  @ViewChild(IonModal) modal!: IonModal;
  @Input() reset: boolean = false;
  public isProductsListLoaded: boolean = false;
  searchTerm$ = new Subject<string>();
  listFiltered: any[] = [];
  isTerm: boolean = false

  constructor(private _productService: ProductService, public _cartService: CartService) { }

  ngOnInit() {
    this.getProductsList()
  }

  filterList(): void {
    this.searchTerm$.subscribe((term: any) => {
      let newListProducts: any[] = []
      this.productsList.forEach(element => {
        newListProducts.push(element)
      });

      this.listFiltered = newListProducts
        .filter(item => {
          let tempData: any = ''
          if (item.palabrasClaves != null) {
            tempData = item.palabrasClaves.toLowerCase().indexOf(term.toLowerCase()) >= 0
          }
          return tempData
        });

      if (term.length >= 3) {
        this.productsList = this.listFiltered
        this.isProductsListLoaded = true
      } else if (term.length < 2) {
        this.productsList = this.allProductsList
        this.isProductsListLoaded = false
        setTimeout(() => {
          this.isProductsListLoaded = true
        }, 1000)
      }
    })
  }

  sendWord$(event: any) {
    const historyFabBtn = document.querySelector("#history-cart")!
    const causalCart = document.querySelector("#causal-cart")!
    this.searchTerm$.next(event.target.value)
    if (event.target.value.length >= 3) {
      this.isTerm = true
      historyFabBtn.classList.add("is-hidden")
      causalCart.classList.add("is-hidden")
    } else {
      this.isTerm = false
      historyFabBtn.classList.remove("is-hidden")
      causalCart.classList.remove("is-hidden")
    }
  }

  async getProductsList() {

    // Only for reset filter
    const inputSearch: any = document.querySelector("#search-word")
    const historyFabBtn = document.querySelector("#history-cart")!
    const causalCart = document.querySelector("#causal-cart")!
    if (inputSearch) {
      inputSearch.value = ""
      this.isTerm = false
      historyFabBtn.classList.remove("is-hidden")
      causalCart.classList.remove("is-hidden")
    }

    this.isProductsListLoaded = false
    this.productsList = []
    await this._productService.getProductsList$(this.groupId).subscribe({
      next: (res) => {
        const { data } = JSON.parse(res.data)
        this.productsList.push(...data)

        this.categoriesList = this.productsList.slice()
        this.categoriesList = this.categoriesList.map((p: ProductModel) => p.proveedor)
        const categoryWithoutDuplicates = Array.from(new Set(this.categoriesList));
        this.categoriesList = categoryWithoutDuplicates
        this.allProductsList = this.productsList

        this.REALcategoriesList = this.productsList.slice()
        this.REALcategoriesList = this.REALcategoriesList.map((p: ProductModel) => p.category)
        const categoryWithoutDuplicates2 = Array.from(new Set(this.REALcategoriesList));
        this.REALcategoriesList = categoryWithoutDuplicates2
      },
      complete: () => {
        this.isProductsListLoaded = true;
        this.filterList()
      }
    })
  }

  applyFilters() {
    // Obtener todos los productos
    this.productsList = []
    this._productService.getProductsList$(this.groupId).subscribe({
      next: (res) => {
        const { data } = JSON.parse(res.data)
        this.productsList.push(...data)

        // Aplicar filtro de ofertas
        if (this.isOffers) {
          this.productsList = this.productsList.filter((product: ProductModel) => product.porcDescuento !== "0.00");
          this.isProductOffers = true
        } else {
          this.isProductOffers = false
        }

        this.categoriesList = this.productsList.slice()
        this.categoriesList = this.categoriesList.map((p: ProductModel) => p.proveedor)
        const categoryWithoutDuplicates = Array.from(new Set(this.categoriesList));
        this.categoriesList = categoryWithoutDuplicates
        this.allProductsList = this.productsList
      },
    })
  }

  public applyFilterProvide() {
    this.productsList = this.allProductsList
    this.selectedCategories = []

    if (this.selectedProvider) {
      this.productsList = this.productsList.filter((product: ProductModel) => {
        return product.proveedor?.trim() === this.selectedProvider.trim()
      })
    }

    this.REALcategoriesList = this.productsList.slice()
    this.REALcategoriesList = this.REALcategoriesList.map((p: ProductModel) => p.category)
    const categoryWithoutDuplicates = Array.from(new Set(this.REALcategoriesList));
    this.REALcategoriesList = categoryWithoutDuplicates
  }

  createCategorys(e: any) {
    if (this.selectedCategories.includes(e.target.value)) {
      // La categoría ya está seleccionada, la quitamos del arreglo
      const index = this.selectedCategories.indexOf(e.target.value);
      this.selectedCategories.splice(index, 1);
    } else {
      // La categoría no está seleccionada, la agregamos al arreglo
      this.selectedCategories.push(e.target.value);
    }
  }

  toggleCategory() {
    this.modal.dismiss(null, 'cancel');
    this.isFiltersShow = true
    if (this.selectedCategories.length > 0) {
      this.productsList = this.allProductsList
      this.productsList = this.productsList.filter((product: ProductModel) => {
        return this.selectedCategories.includes(product.category?.trim()!);
      });

      this.selectedCategories = []
    }
  }

  resetFilters() {
    this.getProductsList()
    this.selectedProvider = ""
    this.isOffers = false
    this.isFiltersShow = false
  }

  getProductSubCategories(): string[] {
    const subCategoriesSet = new Set<string>();
    for (const productObject of this.productsList) {
      subCategoriesSet.add(productObject.subcategory!);
    }
    return Array.from(subCategoriesSet);
  }

  getProductGroup(subCategory: string): ProductModel[] {
    return this.productsList.filter(productObject => productObject.subcategory === subCategory);
  }

}
