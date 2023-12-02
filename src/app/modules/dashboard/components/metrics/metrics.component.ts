import { Component, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';

import { MetricsService } from '@modules/dashboard/services/metrics.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit {
  private dataRentabilityMetrics: any = "";
  public dataForMetricsRentabilityLoaded: boolean = false;
  public dataForMetricsRentabilityLoadedTwo: boolean = false;
  public chart: any;

  constructor(private _metricsService: MetricsService) { }

  ngOnInit() {
    this.loadDataAll();
  }

  /**
   * Obtiene los datos del servicios de métricas
   * @memberof MetricsComponent
   */
  loadDataAll(): void {
    const idVendedor = localStorage.getItem("codemp_b");
    this._metricsService.consultRentability(idVendedor).then(() => {
      this.dataRentabilityMetrics = []
      this.dataRentabilityMetrics = this._metricsService.dataForMetricsRentability;
      this.setDataForGraphicAndInit();
    });
  }

  /**
   * Rellena las options de la gráfica con
   * los datos del servicio
   * @memberof MetricsComponent
   */
  setDataForGraphicAndInit() {
    let options = {
      series: [
        {
          name: 'Venta bruta',
          data: [] as any
        }
      ],
      chart: {
        height: 350,
        type: 'bar',
        background: 'transparent',
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
          borderRadius: 10
        },
      },
      colors: ['#0174D6'],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ['Venta neta', 'Venta bruta'],
        markers: {
          fillColors: ['#0174D6', '#57D78F']
        }
      },
      xaxis: {
        position: 'bottom',
        labels: {
          show: true,
          rotate: -90,
          rotateAlways: false,
          hideOverlappingLabels: true,
          showDuplicates: false,
          trim: false,
          minHeight: undefined,
          maxHeight: 120,
          style: {
            colors: [],
            fontSize: '10px',
            fontFamily: 'Open Sans, Arial, sans-serif',
            fontWeight: 700
          }
        },
      },
      yaxis: {
        show: false,
        showAlways: false
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          const tempDataRentability = sessionStorage.getItem(
            `dataRentabilityMetrics-${w.globals.labels[dataPointIndex]}`
          )
          const { casa, ventabruta, ventaneta } = JSON.parse(tempDataRentability!)

          return '<div class="c-tooltip">' +
            '<h4 class="c-tooltip__title">' + casa + '</h4>' +
            '<div class="c-tooltip__content">' +
            '<span class="c-tooltip__txt">Venta bruta: ' + ventabruta + '</span class="c-tooltip__txt">' +
            '<span class="c-tooltip__txt">Venta neta: ' + ventaneta + '</span>' +
            '</div>' +
            '</div>';
        }
      },
    };

    // Restablecer los datos antes de llenarlos nuevamente
    options.series[0].data = [];

    // Llenar gráfica con los datos del servicio
    this.dataRentabilityMetrics.forEach((c: any) => {

      let tempData = {
        casa: c.casa,
        ventabruta: c.ventabruta,
        ventaneta: c.ventaneta,
      }

      sessionStorage.setItem(
        `dataRentabilityMetrics-${c.casa}`,
        JSON.stringify(tempData)
      );

      let dataTem = {
        x: c.casa,
        y: this.deleteDotAndConvertToNumber(c.ventabruta),
        goals: [
          {
            name: 'Venta neta',
            value: this.deleteDotAndConvertToNumber(c.ventaneta),
            strokeHeight: 3,
            strokeDashArray: 3,
            strokeColor: '#57D78F'
          }
        ]
      };
      options.series[0].data.push(dataTem);
    });

    this.initChart(options);
  }

  /**
   * Recibe un número de tipo string y lo retorna
   * formateado como número sin puntos.
   * @private
   * @param {string} stringToConvert
   * @return {number} Devuelve el string formateado como número
   * @memberof MetricsComponent
   */
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

  /**
   * Inicia la instancia de la gráfica
   * @param {any} options Objeto que representa la configuración para la gráfica
   * @memberof MetricsComponent
   */
  initChart(options: any) {
    if (this.chart) {
      // Destruir la instancia de la gráfica existente
      this.chart.destroy();
    }

    this.chart = new ApexCharts(document.querySelector("#chart"), options);
    this.chart.render();
    this.dataForMetricsRentabilityLoaded = true;
    this.dataForMetricsRentabilityLoadedTwo = true;
  }
}
