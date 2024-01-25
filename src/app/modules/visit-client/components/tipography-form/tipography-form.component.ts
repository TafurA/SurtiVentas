import { Component, OnInit } from '@angular/core';
import { AlertService } from '@shared/services/alert.service';
import { StoresService } from '@shared/services/stores.service';

@Component({
  selector: 'app-tipography-form',
  templateUrl: './tipography-form.component.html',
  styleUrls: ['./tipography-form.component.scss'],
})
export class TipographyFormComponent implements OnInit {
  isModalOpen = false;
  questionClasificationForm = [
    {
      id: 'actividad_principal',
      question: '¿La actividad principal del cliente es vender productos de la canasta básica (alimentos, bebidas, aseo)?',
    },
    {
      id: 'consumo_fuera_pdv',
      question: '¿El 50% de los productos son para consumo fuera del PDV?',
    },
    {
      id: 'pdv_mas_80_por_mayor',
      question: '¿El PDV tiene al menos 80% de sus productos en venta al por mayor?',
    },
    {
      id: 'pdv_80_detras_mostrador',
      question: '¿El PDV vende el 80% de sus productos detrás del mostrador?',
    },
    {
      id: 'pdv_80_alcance_consumidor_una_gondola',
      question: '¿El PDV tiene el 80% de sus productos al alcance de la mano del consumidor y tiene por lo menos 1 góndola?',
    },
    {
      id: 'pdv_100m_cubicos',
      question: '¿El PDV tiene al menos de 100M cúbicos?',
    },
    {
      id: 'two_pasillos_lineal_botellas',
      question: '¿El PDV tiene más de 2 pasillos o el lineal de botellas abierto al consumidor?',
    },
    {
      id: 'cincuenta_minimo_medicamentos',
      question: '¿El PDV tiene como mínimo el 50% de surtido de medicamentos?',
    },
    {
      id: 'cincuenta_minimo_papeleria',
      question: '¿El PDV tiene como mínimo el 50% de surtido de papelería?',
    },
    {
      id: 'cincuenta_minimo_cosmeticos',
      question: '¿El PDV tiene como mínimo el 50% de surtido en cosméticos / cuidado capilar?',
    },
  ]
  currentIdClasification = ''
  currentIdValue = ''
  stepClasification = false
  topographicCategory = ""

  constructor(private _storeService: StoresService, private _alertService: AlertService) { }

  ngOnInit() {
    this.setOpen(true)
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;

    if (this.isModalOpen) {
      setTimeout(() => {
        this.initFormClasification()
      }, 50)
    }
  }

  toggleDropdown(e: any) {
    e.target.closest(
      '.o-checkout__dropdown'
    ).classList.toggle('is-dropdown-show');
  }

  initFormClasification() {
    const container = document.querySelectorAll(".js-container-clasification")
    container.forEach(c => {
      if (c?.getAttribute("id") == "actividad_principal") {
        c.classList.remove("is-hidden")
        this.stepClasification = true
        this.currentIdClasification = "actividad_principal"
        this.currentIdValue = "SI"
      }
    });
  }

  changeClasification(e: any, question: any) {
    this.currentIdClasification = question.id
    this.currentIdValue = e.target.value
    this.stepClasification = false
  }

  saveClasification() {
    if (this.currentIdClasification === "actividad_principal") {
      if (this.currentIdValue == "SI") {
        document.querySelector("#actividad_principal")?.classList.add("is-hidden")
        document.querySelector("#consumo_fuera_pdv")?.classList.remove("is-hidden")
        setTimeout(() => {
          this.currentIdClasification = "consumo_fuera_pdv"
          this.currentIdValue = "SI"
        }, 500)

      } else {
        // INICIA FLUJO DE OTROS
        document.querySelector("#actividad_principal")?.classList.add("is-hidden")
        document.querySelector("#cincuenta_minimo_medicamentos")?.classList.remove("is-hidden")
        setTimeout(() => {
          this.currentIdClasification = "cincuenta_minimo_medicamentos"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "consumo_fuera_pdv") {
      if (this.currentIdValue == "SI") {
        document.querySelector("#consumo_fuera_pdv")?.classList.add("is-hidden")
        document.querySelector("#pdv_mas_80_por_mayor")?.classList.remove("is-hidden")
        this.topographicCategory = ""

        setTimeout(() => {
          this.currentIdClasification = "pdv_mas_80_por_mayor"
          this.currentIdValue = "SI"
        }, 500)

      } else {
        this.topographicCategory = "Consumo Local"
      }
    }

    if (this.currentIdClasification === "pdv_mas_80_por_mayor") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "Mayorista"
      } else {
        this.topographicCategory = ""
        document.querySelector("#pdv_mas_80_por_mayor")?.classList.add("is-hidden")
        document.querySelector("#pdv_80_detras_mostrador")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "pdv_80_detras_mostrador"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "pdv_80_detras_mostrador") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "TAT"
      } else {
        this.topographicCategory = ""
        document.querySelector("#pdv_80_detras_mostrador")?.classList.add("is-hidden")
        document.querySelector("#pdv_80_alcance_consumidor_una_gondola")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "pdv_80_alcance_consumidor_una_gondola"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "pdv_80_alcance_consumidor_una_gondola") {
      if (this.currentIdValue == "SI") {
        // NUEVAS PREGUNTAS
        document.querySelector("#pdv_80_alcance_consumidor_una_gondola")?.classList.add("is-hidden")
        document.querySelector("#pdv_100m_cubicos")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "pdv_100m_cubicos"
          this.currentIdValue = "SI"
        }, 500)
      } else {
        // INICIA FLUJO DE OTROS
        document.querySelector("#pdv_80_alcance_consumidor_una_gondola")?.classList.add("is-hidden")
        document.querySelector("#cincuenta_minimo_medicamentos")?.classList.remove("is-hidden")
        setTimeout(() => {
          this.currentIdClasification = "cincuenta_minimo_medicamentos"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "pdv_100m_cubicos") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "ISM"
      } else {
        // PREGUNTAS 
        document.querySelector("#pdv_100m_cubicos")?.classList.add("is-hidden")
        document.querySelector("#two_pasillos_lineal_botellas")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "two_pasillos_lineal_botellas"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "two_pasillos_lineal_botellas") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "Mini Tipo A"
      } else {
        this.topographicCategory = "Mini Tipo B"
      }
    }

    if (this.currentIdClasification === "cincuenta_minimo_medicamentos") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "Drogueria"
      } else {
        // PREGUNTAS 
        document.querySelector("#cincuenta_minimo_medicamentos")?.classList.add("is-hidden")
        document.querySelector("#cincuenta_minimo_papeleria")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "cincuenta_minimo_papeleria"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "cincuenta_minimo_papeleria") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "Cacharrería"
      } else {
        // PREGUNTAS 
        document.querySelector("#cincuenta_minimo_papeleria")?.classList.add("is-hidden")
        document.querySelector("#cincuenta_minimo_cosmeticos")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "cincuenta_minimo_cosmeticos"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "cincuenta_minimo_cosmeticos") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "Peluquería / Tienda de belleza"
      } else {
        this.topographicCategory = "Otros"
      }
    }

    this.stepClasification = true
  }

  sendEditForm() {
    const clientId = localStorage.getItem('codemp_b')!
    if (this.topographicCategory == "Consumo Local") {
      this.topographicCategory = "CL"
    } else if (this.topographicCategory == "Mayorista") {
      this.topographicCategory = "M"
    } else if (this.topographicCategory == "Mini Tipo A") {
      this.topographicCategory = "MTA"
    } else if (this.topographicCategory == "Mini Tipo B") {
      this.topographicCategory = "MTB"
    } else if (this.topographicCategory == "Drogueria") {
      this.topographicCategory = "D"
    } else if (this.topographicCategory == "Cacharrería") {
      this.topographicCategory = "C"
    } else if (this.topographicCategory == "Peluquería / Tienda de belleza") {
      this.topographicCategory = "PTB"
    }

    console.log("despues: ", this.topographicCategory)
    this._storeService.setClasificationStore$(clientId, this.topographicCategory).subscribe({
      next: (res) => {
        console.log(" res", res)
        const { message, response } = JSON.parse(res.data)
        this.setOpen(false)
        const typeAlert = response ? 'success' : 'error'
        this._alertService.showAlert("Actualizar clasificación tienda", message, typeAlert)
      }
    })
  }
}
