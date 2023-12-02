import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HTTP) { }


  // TODO: revisar el cliente aqui
  getOrdersListByStore$(idVendedor: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getPedidosClienteVendedor?idVendedor=${idVendedor}&idclient=131504`,
      '',
      environment.headers
    ))
  }

  getOrdersListBySeller$(idVendedor: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getPedidosVendedor?idVendedor=${idVendedor}`,
      '',
      environment.headers
    ))
  }

  getOrderDetail(idOrder: any) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getPedidoDetalleVendedor?idpedido=${idOrder}`,
      '',
      environment.headers
    ))
  }

  getDevolutions(idVendedor: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getDevoluciones?Idvendedor=${idVendedor}`,
      '',
      environment.headers
    ))
  }

  getOrdersForDiscounts(idVendedor: string, idGroup: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/GetDescuentos?IdVendedor=${idVendedor}&IdGrupo=${idGroup}`,
      '',
      environment.headers
    ))
  }

  getDiscounts(idVendedor: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/DescuentosDays?idVendedor=${idVendedor}`,
      '',
      environment.headers
    ))
  }

  setDiscounts(idPedido: string, idVendedor: string, idGrupo: string, obsdes_b: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/SetDescuentos?idPedido=${idPedido}&idVendedor=${idVendedor}&idGrupo=${idGrupo}&obsdes_b=${obsdes_b}`,
      '',
      environment.headers
    ))
  }
}
