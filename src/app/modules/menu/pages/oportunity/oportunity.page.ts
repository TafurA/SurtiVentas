import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { MenuModule } from '@modules/menu/menu.module';
import { OportunityService } from '@modules/menu/services/oportunity.service';

@Component({
  selector: 'app-oportunity',
  templateUrl: './oportunity.page.html',
  styleUrls: ['./oportunity.page.scss'],
  standalone: true,
  imports: [MenuModule]
})
export class OportunityPage implements OnInit {
  oportunityList: any[] = []
  searchTerm$ = new Subject<string>();
  listFiltered: any[] = [];
  isTerm: boolean = false
  allStoresList: any[] = []
  isOportunityLoaded: boolean = false

  constructor(private _oportunityService: OportunityService) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.getOportunityList('default')
  }

  getOportunityList(action: string) {
    const CLIENT_ID: string = localStorage.getItem('codemp_b')!;

    this.oportunityList = []

    this._oportunityService.getOportunitys(CLIENT_ID).subscribe({
      next: (res) => {
        const { data } = JSON.parse(res.data)
        this.oportunityList.push(...data)
      },
      complete: () => {
        this.allStoresList = this.oportunityList
        this.filterList()
        this.isOportunityLoaded = true

        if (action === "close") {
          const textInput: any = document.querySelector(".js-input-search")!
          textInput.value = ""
        }
      },
      error: (e) => {
        console.log("error getOportunidyList ", e)
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

  filterList(): void {
    this.searchTerm$.subscribe((term: any) => {
      let newListOrders: any[] = []
      this.oportunityList.forEach((element: any) => {
        newListOrders.push(element)
      });
      this.listFiltered = newListOrders.filter(item => {
        return Object.values(item).some(value => {
          return typeof value === 'string' && value.toLowerCase().indexOf(term.toLowerCase()) >= 0;
        });
      });

      if (term.length >= 2) {
        this.oportunityList = this.listFiltered
        this.isOportunityLoaded = true
      } else if (term.length < 2) {
        this.oportunityList = this.allStoresList
        this.isOportunityLoaded = false
        setTimeout(() => {
          this.isOportunityLoaded = true
        }, 1000)
      }
    })
  }

}
