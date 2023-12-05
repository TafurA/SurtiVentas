import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

import { environment } from 'src/environments/environment';
import { GraphicRentabilityModel } from '@core/models/graphic_rentability_model';


/**
 * Servicio encargado de consumir las métricas del vendedor.
 * @param {HTTP} http - para las conexiones https
 * @export
 * @class MetricsService
 */
@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  public dataForMetricsRentability: any = []
  public dataForMesAnterior: any = []
  public dataForMesActual: any = []
  public dataProjection: any = []
  public dataForMetricsRentabilityLoaded: boolean = false

  constructor(private http: HTTP) { }

  /**
   * Función asincrona, obtiene los datos de venta
   * de cada una de las casas por vendedor
   * @memberof MetricsService
   */
  async consultRentability(idVendedor: any) {
    await this.http.get(
      `${environment.API_URL}${environment.API_PATH}/consultaRentabilidad?idVendedor=${idVendedor}`
      ,
      '',
      environment.headers
    ).then((data) => {
      const dataService = JSON.parse(data.data)
      this.dataForMetricsRentability = []
      for (let key in dataService.data) {
        const { casa, ventabruta, ventaneta } = dataService.data[key]
        if (ventabruta !== "0" || ventaneta !== "0") {
          const dataObjectTemp: GraphicRentabilityModel = {
            casa: casa,
            ventabruta: ventabruta,
            ventaneta: ventaneta
          }
          this.dataForMetricsRentability.push(dataObjectTemp)
        }
      }
    }).finally(() => {
      this.dataForMetricsRentabilityLoaded = true
    })
  }

  async metricsSeller(idGrupo: any, idVendedor: any) {
    await this.http.get(
      `${environment.API_URL}${environment.API_PATH}/metricasVendedor?idGrupo=${idGrupo}&idVendedor=${idVendedor}`
      ,
      '',
      environment.headers
    ).then((res) => {
      const { data } = JSON.parse(res.data)
      const { dataAnterior, dataActual, dataProyectada } = data
      this.dataForMesAnterior = dataAnterior
      this.dataForMesActual = dataActual
      this.dataProjection = dataProyectada
    })
  }
}
