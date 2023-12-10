import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MetricsService } from '@modules/dashboard/services/metrics.service';
import { MetricsModule } from '@modules/metrics/metrics.module';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.page.html',
  styleUrls: ['./metrics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MetricsModule]
})
export class MetricsPage implements OnInit {

  private sellerId: any = localStorage.getItem('codemp_b')
  private groupId: any = localStorage.getItem('group')
  public dataForMesAnterior: any = []
  public dataForMesActual: any = []
  public dataProjection: any = []
  public providersList: any = []
  public dataMesActual = {
    totalDevolucion: '',
    porcentajeDevolucion: '',
    pedidos: '',
    impactos: '',
    volumen: ''
  }
  public dataMesAnterior = {
    totalDevolucion: '',
    porcentajeDevolucion: '',
    pedidos: '',
    impactos: '',
    volumen: ''
  }
  isDataLoaded = false

  public generalMetric: boolean = true

  constructor(private _metricsService: MetricsService) { }

  ngOnInit() {
    this.getMetricsSeller().then(() => {
      this.renderGraphicVol()
    }).then(() => {
      this.getAllProviders()
    }).then(() => {
      this.renderDataActualOfMetrics('default')
      this.renderDataAnteriorlOfMetrics('default')
    })
  }

  async getMetricsSeller() {
    await this._metricsService.metricsSeller(this.groupId, this.sellerId).then((res) => {
      this.dataForMesAnterior = this._metricsService.dataForMesAnterior
      this.dataForMesActual = this._metricsService.dataForMesActual
      this.dataProjection = this._metricsService.dataProjection
    })
  }

  getAllProviders() {
    this.dataForMesActual.ventasMesActual.filter((provider: any) => {
      this.providersList.push(provider.nomlarg_b)
    })
  }

  filterDataByProvider(e: any) {
    this.isDataLoaded = false
    const providerSelected = e.target.value
    this.dataForMesActual.ventasMesActual.filter((provider: any) => {
      if (providerSelected == 'general') {
        this.renderDataActualOfMetrics('default')
      } else if (provider.nomlarg_b == providerSelected) {
        this.renderDataActualOfMetrics(provider)
      }
    })
    this.dataForMesAnterior.ventasMesAnterior.filter((provider: any) => {
      if (providerSelected == 'general') {
        this.renderDataAnteriorlOfMetrics('default')
      } else if (provider.nomlarg_b == providerSelected) {
        this.renderDataAnteriorlOfMetrics(provider)
      }
    })
  }

  renderGraphicVol() {
    var options = {
      series: [{
        name: 'Volumen',
        data: [
          this.deleteDotAndConvertToNumber(this.dataForMesAnterior.VOLMESANTERIOR),
          this.deleteDotAndConvertToNumber(this.dataForMesActual.VOLMESACTUAL)
        ]
      }],
      chart: {
        type: 'bar',
        height: 250,
        toolbar: {
          show: false
        }
      },
      grid: {
        show: false,
        borderColor: '#90A4AE',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
        row: {
          colors: undefined,
          opacity: 0.5
        },
        column: {
          colors: undefined,
          opacity: 0.5
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          borderRadius: 10
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Periodo Anterior', 'Periodo Actual'],
      },
      yaxis: {
        show: false,
        showAlways: false
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
          // Accede al valor del punto de datos
          const value = w.globals.series[seriesIndex][dataPointIndex];

          // Formatea el valor según tus necesidades
          const formattedValue = `$${value.toFixed(2)}`; // Ejemplo de formato

          // Retorna el valor formateado para mostrar en el tooltip
          return '<div class="c-tooltip">' +
            '<h4 class="c-tooltip__title">' + 'Volumen' + '</h4>' +
            '<div class="c-tooltip__content">' +
            '<span class="c-tooltip__txt">Periodo Anterior: ' + this.dataForMesAnterior.VOLMESANTERIOR + '</span class="c-tooltip__txt">' +
            '<span class="c-tooltip__txt">Periodo Actual: ' + this.dataForMesActual.VOLMESACTUAL + '</span class="c-tooltip__txt">' +
            '</div>' +
            '</div>';
        }
      },
    };

    var chart = new ApexCharts(document.querySelector("#chart-metrics"), options);
    chart.render();
  }

  renderDataActualOfMetrics(optSelected: any) {
    if (optSelected !== 'default') {
      this.generalMetric = false
      this.dataMesActual.totalDevolucion = optSelected.totalDevolucion
      this.dataMesActual.porcentajeDevolucion = optSelected.porcentajeDev
      this.dataMesActual.impactos = optSelected.impactos
      this.dataMesActual.pedidos = optSelected.pedidos
      this.dataMesActual.volumen = optSelected.volumen
    } else {
      this.generalMetric = true
      this.dataMesActual.totalDevolucion = this.dataForMesActual.TOTALDEVMESACTUAL
      this.dataMesActual.porcentajeDevolucion = this.dataForMesActual.PORCEDEVMESACTUAL
      this.dataMesActual.impactos = this.dataForMesActual.IMPMESACTUAL
      this.dataMesActual.pedidos = this.dataForMesActual.PEDMESACTUAL
      this.dataMesActual.volumen = this.dataForMesActual.VOLMESACTUAL
    }

    this.isDataLoaded = true
  }

  renderDataAnteriorlOfMetrics(optSelected: any) {
    if (optSelected !== 'default') {
      this.generalMetric = false
      this.dataMesAnterior.totalDevolucion = optSelected.totalDevolucion
      this.dataMesAnterior.porcentajeDevolucion = optSelected.porcentajeDev
      this.dataMesAnterior.impactos = optSelected.impactos
      this.dataMesAnterior.pedidos = optSelected.pedidos
      this.dataMesAnterior.volumen = optSelected.volumen
    } else {
      this.generalMetric = true
      this.dataMesAnterior.totalDevolucion = this.dataForMesAnterior.TOTALDEVMESANTERIOR
      this.dataMesAnterior.porcentajeDevolucion = this.dataForMesAnterior.PORCEDEVMESANTERIOR
      this.dataMesAnterior.impactos = this.dataForMesAnterior.IMPMESANTERIOR
      this.dataMesAnterior.pedidos = this.dataForMesAnterior.PEDMESANTERIOR
      this.dataMesAnterior.volumen = this.dataForMesAnterior.VOLMESANTERIOR
    }

    this.isDataLoaded = true
  }

  private deleteDotAndConvertToNumber(stringToConvert: string): number {

    for (let index = 0; index < stringToConvert.length; index++) {
      const element = stringToConvert[index];
      if (element == ".") {
        stringToConvert = stringToConvert.replace(".", "")
      }
    }

    let logNum: any = Math.log(Number(stringToConvert))
    logNum = logNum.toString().replace(".", "")

    return Number(logNum);
  }

}
