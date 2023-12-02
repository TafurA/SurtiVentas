import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable, from } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HTTP) { }

  getProductsList$(groupId: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/consultarProductosSeller?grupo=${groupId}`,
      '',
      environment.headers
    ))
  }

  getRecommendedProductsList$(idclient: string, cdi: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getRecommended?idclient=${idclient}&bodega=${cdi}`,
      '',
      environment.headers
    ))
  }

  getRelatedProductsList$(productId: string, bodega: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getProductoRelated?producto=${productId}&bodega=${bodega}`,
      '',
      environment.headers
    ))
  }

  getGoldProductsList$(groupId: string, clientId: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getDorados?grupo=${groupId}&cliente=${clientId}`,
      '',
      environment.headers
    ))
  }

  getProductsCategory$(groupId: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getCategoryCliente?grupo=${groupId}`,
      '',
      environment.headers
    ))
  }

  getProductDetail$(codeProductId: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getProductoDetail?producto=${codeProductId}`,
      '',
      environment.headers
    ))
  }
}
