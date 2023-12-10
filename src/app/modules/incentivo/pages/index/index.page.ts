import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoresService } from '@shared/services/stores.service';
import { IncentivoModule } from '@modules/incentivo/incentivo.module';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IncentivoModule]
})
export class IndexPage implements OnInit {
  private sellerId: any = localStorage.getItem('codemp_b')
  private groupId: any = localStorage.getItem('group')
  public listProviders: any[] = []
  public listConcurso: any[] = []
  listLoaded: boolean = false

  constructor(private _storeService: StoresService) { }

  ngOnInit() {
    this.getIncentivos()
  }

  getIncentivos() {
    this._storeService.getIncentivos(this.sellerId, this.groupId).subscribe({
      next: (res) => {
        const { data } = JSON.parse(res.data)
        for (const nombreEmpresa in data) {
          if (data.hasOwnProperty(nombreEmpresa)) {
            const empresaData = data[nombreEmpresa];

            // Extraigo los concursos como un array
            const concursosArray = Object.keys(empresaData).map((concurso) => ({
              concurso: concurso,
              data: empresaData[concurso]
            }));

            // Filtrar y restar los datos para determinar si se debe aplicar la clase
            const shouldApplyClass = concursosArray.some((concurso) => {
              const impactoResult = Number(concurso.data.impacto) - Number(concurso.data.cimpacto)
              const pedidoResult = Number(concurso.data.pedido) - Number(concurso.data.cpedido)
              const volumenResult = Number(concurso.data.volumen) - Number(concurso.data.cvolumen)
              const unidadResult = Number(concurso.data.unidad) - Number(concurso.data.cunidad)
              // Filtrar y sumar los datos de 'cimpacto' y 'pedido'
              // Verificar si se cumple la condición para aplicar la clase

              return impactoResult <= 0 || pedidoResult <= 0 || volumenResult <= 0 || unidadResult <= 0;
            });

            const cssClass = shouldApplyClass ? 'is-red-flag' : ''

            this.listProviders.push({
              name: nombreEmpresa,
              concursos: concursosArray,
              cssClass: cssClass
            });
          }
        }

      }, complete: () => {
        this.listLoaded = true
      }
    })
  }

  convertirYRestar(cpedido: string, pedido: string): number {
    const cpedidoNumero = Number(cpedido);
    const pedidoNumero = Number(pedido);

    console.log(cpedidoNumero, pedidoNumero)

    return pedidoNumero - cpedidoNumero;
  }

  toggleDropdown(e: any) {
    e.target.closest(
      '.o-checkout__dropdown'
    ).classList.toggle('is-dropdown-show');
  }

  toggleDropdownTable(e: any) {
    e.target.closest(
      '.js-table'
    ).classList.toggle('is-dropdown-show-table');
  }

}
