import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { OrdersService } from '@modules/rut/services/orders.service';

import { VisitClientModule } from '@modules/visit-client/visit-client.module';

@Component({
  selector: 'app-devolutions',
  templateUrl: './devolutions.page.html',
  styleUrls: ['./devolutions.page.scss'],
  standalone: true,
  imports: [VisitClientModule]
})
export class DevolutionsPage implements OnInit {

  private idVendedor: any = localStorage.getItem('codemp_b')
  public devolutionList: any[] = []
  public producstList: any[] = []
  public loader: any


  constructor(private _orderService: OrdersService, public loadingController: LoadingController) { }

  ngOnInit() {
    this.getDevolutions()
  }

  getDevolutions() {
    let arrayTemp: any[] = []
    let arrayTempData: any[] = []
    this.loader = false

    this._orderService.getDevolutions(this.idVendedor).subscribe(({
      next: (res: any) => {
        const data = JSON.parse(res.data)
        for (const clave in data) {
          if (data.hasOwnProperty(clave)) {
            const arregloDeObjetos = data[clave];
            if (clave !== 'response') {
              // Recorre el arreglo de objetos correspondiente
              for (const objetoDeArreglo of arregloDeObjetos) {
                console.log("ESTOS SON LOS DATOS", objetoDeArreglo)
                const tempData: any = {
                  id: objetoDeArreglo.numFactura,
                  productos: arregloDeObjetos.length,
                  total: objetoDeArreglo.TotalDevolucion,
                  fecha: objetoDeArreglo.feDevolucion,
                  cliente: objetoDeArreglo.Cliente,
                  causal: objetoDeArreglo.Causal,
                  trasnportador: objetoDeArreglo.trasnportador
                }
                arrayTemp.push(tempData)
                const tempProductsData = {
                  cant: objetoDeArreglo.Cantidad,
                  precio: objetoDeArreglo.TotalProducto,
                  nombre: objetoDeArreglo.Producto,
                  fact: objetoDeArreglo.numFactura,
                  total: Number(objetoDeArreglo.Cantidad) * Number(objetoDeArreglo.TotalProducto),
                  image: ''
                }
                arrayTempData.push(tempProductsData)
              }
              this.producstList = arrayTempData
              this.devolutionList = this.removeDuplicatesIntoList(arrayTemp, "id")
            }
          }
        }
      }, complete: () => {
        this.loader = true
      }
    }))
    // })
  }


  toggleDropdown(e: any) {
    e.target.closest(
      '.o-checkout__dropdown'
    ).classList.toggle('is-dropdown-show');
  }

  /**
   *
   *
   * @private
   * @param {*} originalProductList List of products to compare
   * @param {string} codeProduct Property of the object to compare
   * @return {Array} newArray A new array of products without duplicates 
   * @memberof CartService
   */
  private removeDuplicatesIntoList(originalProductList: any, codeProduct: string): Array<any> {
    var newArray = [];
    var lookupObject: any = {};

    for (var i in originalProductList) {
      lookupObject[originalProductList[i][codeProduct]] = originalProductList[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }


  getDevolutionsDate(): string[] {
    const devolutionsSet = new Set<string>();
    for (const discountObject of this.devolutionList) {
      devolutionsSet.add(discountObject.fecha!);
    }
    return Array.from(devolutionsSet);
  }

  getDevolutionsGroup(devolutionDate: string): any[] {
    return this.devolutionList.filter((devolutionObject: any) => devolutionObject.fecha === devolutionDate);
  }

}
