import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StoreModel } from '@core/models/store_model';
import { StoresService } from '@shared/services/stores.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-store-component',
  templateUrl: './list-store.component.html',
  styleUrls: ['./list-store.component.scss'],
})
export class ListStoreComponent implements OnInit {
  /**
   * Define el color de fondo que va a tener el componente, permite dos opciones.
   *
   * @type {('primary-20' | 'grey-20')}
   * @memberof ListStoreComponent
   */
  @Input() surface: 'primary-20' | 'grey-20' = 'grey-20';
  @Input() title: string = '';
  @Input() type: 'init' | 'detail' | 'visited' = 'init';

  protected storesByVisit: Array<StoreModel> = []
  protected storesVisited: Array<StoreModel> = []
  private idseller = localStorage.getItem('codemp_b')!
  private idGroup = localStorage.getItem('group')!
  public isStoresByVisitLoaded: boolean = false

  searchTerm$ = new Subject<string>();
  listFiltered: any[] = [];
  isTerm: boolean = false
  isStoresLoades: boolean = false
  allStoresList: any[] = []

  constructor(private _storeService: StoresService, private router: Router) { }

  ngOnInit() {
    this.getListStores("normal")
  }

  getListStores(action: string) {
    this.isStoresByVisitLoaded = false
    this._storeService.getStoresList$(this.idseller, this.idGroup)
      .subscribe({
        next: (res) => {
          const { data } = res
          const dataStores = JSON.parse(data)
          Object.entries(dataStores.data).map((store: any) => {

            if (store[1].estped_b === 'FACT') {
              this.storesVisited.push(store[1])
            } else {
              this.storesByVisit.push(store[1])
            }

          })
        },
        error(err) {
          console.log(err)
        },
        complete: () => {
          this.isStoresByVisitLoaded = true
          this.allStoresList = this.storesByVisit
          this.filterList()

          if (action === "close") {
            const textInput: any = document.querySelector(".js-input-search")!
            textInput.value = ""
            this.isTerm = false
          }
        }
      })
  }

  filterList(): void {
    this.searchTerm$.subscribe((term: any) => {
      let newListOrders: any[] = []
      this.storesByVisit.forEach((element: any) => {
        newListOrders.push(element)
      });

      this.listFiltered = newListOrders
        .filter(
          item => item.nomcli_b.toLowerCase().indexOf(term.toLowerCase()) >= 0
          || item.dircli_b.toLowerCase().indexOf(term.toLowerCase()) >= 0
        );

      if (term.length >= 3) {
        this.storesByVisit = this.listFiltered
        this.isStoresByVisitLoaded = true
      } else if (term.length < 2) {
        this.storesByVisit = this.allStoresList
        this.isStoresByVisitLoaded = false
        setTimeout(() => {
          this.isStoresByVisitLoaded = true
        }, 1000)
      }
    })
  }

  sendWord$(event: any) {
    this.searchTerm$.next(event.target.value)
    if (event.target.value.length >= 3) {
      this.isTerm = true
    } else {
      this.isTerm = false
    }
  }

  saveCurrentStore(store: StoreModel) {
    localStorage.setItem('CartStoreID', store.codcli_b)
    setTimeout(() => {
      this.router.navigate(['rut', 'store-detail'])
    }, 200)
  }

}
