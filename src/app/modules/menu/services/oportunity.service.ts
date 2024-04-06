import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable, from } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OportunityService {

  constructor(private http: HTTP) { }

  getOportunitys(clientId: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getOportunidadSurti?Idvendedor=${clientId}`,
      '',
      environment.headers
    ))
  }

  getSemaforoImpacts(IdVendedor: string, IdGrupo: string, fecha_inicial: any, fecha_final: any) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/ConsultaSemaforoVendedores?IdVendedor=${IdVendedor}&IdGrupo=${IdGrupo}&fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`,
      '',
      environment.headers
    ))
  }

}
