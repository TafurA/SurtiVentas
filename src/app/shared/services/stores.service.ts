import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  private TOKEN_API_DECODE: string = "SurtiApp:31a5a5b0140e0137e08aadaa60eb016a4b434812"

  constructor(private http: HTTP) { }

  getStoresList$(idVendedor: string, idGrupo: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/GetTiendas?idVendedor=${idVendedor}&idGrupo=${idGrupo}`,
      '',
      environment.headers
    ))
  }

  getStoreDetail$(idCliente: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/DatosUsuarioCliente?idclient=${idCliente}`,
      '',
      environment.headers
    ))
  }

  getListCausalNotOrder() {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/GetConceptosNoPedido`,
      '',
      environment.headers
    ))
  }

  getListNomenclaturas() {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getNomenclaturas`,
      '',
      environment.headers
    ))
  }

  setOrderNoCausal$(idVendedor: string, idCliente: string, idCausal: string, lat: string, long: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/SetCautalNoPedido?idVendedor=${idVendedor}&idCliente=${idCliente}&idCausal=${idCausal}&lat=${lat}=${long}`,
      '',
      environment.headers
    ))
  }

  removeCausal$(idVendedor: string, idCliente: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/DeleteCautalNoPedido?idVendedor=${idVendedor}&idCliente=${idCliente}`,
      '',
      environment.headers
    ))
  }

  updateDataStore$(idCliente: any, emaCliente: any, telCliente: any, empcli_b: any) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/updateInformationClient?idCliente=${idCliente}&emaCliente=${emaCliente}&telCliente=${telCliente}&empCliente=${empcli_b}`,
      '',
      environment.headers
    ))
  }

  createStore(
    tipo_doc: any,
    nitcli_b: any,
    nomcli_b: any, 
    nom2cli_b: any,
    ape1cli_b: any, 
    ape2cli_b: any,
    telcli_b: any,
    emailcli_b: any,
    empcli_b: any,
    dircli_b: any,
    idVendedor: any,
    lat: any,
    lon: any,
    imagen: any
  ) {

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${this.encodeTokenApi()}`,
    };

    const bodyParams: any = [{
      tipo_doc: tipo_doc,
      nitcli_b: nitcli_b,
      nomcli_b: nomcli_b,
      nom2cli_b: nom2cli_b,
      ape1cli_b: ape1cli_b,
      ape2cli_b: ape2cli_b,
      telcli_b: telcli_b,
      emailcli_b: emailcli_b,
      empcli_b: empcli_b,
      dircli_b: dircli_b,
      idVendedor: idVendedor,
      lat: lat,
      lon: lon,
      imagen: imagen
    }]

    this.http.setDataSerializer('json')
    return from(this.http.post(
      `${environment.API_URL}${environment.API_PATH}/preRegistroClienteImg`,
      bodyParams,
      headers,
    )).pipe(
      catchError(error => {
        console.error('Error en la solicitud:', error);
        throw error; // Re-lanza el error para que el componente pueda manejarlo
      })
    );
  }

  encodeTokenApi(): string {
    return window.btoa(unescape(encodeURIComponent(this.TOKEN_API_DECODE)))
  }

  getCurrentRout$(idEmp: string) {

    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getRuta?idVendedor=${idEmp}`,
      '',
      environment.headers
    ))
  }

  getRoutList$(idEmp: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getRutas?idvendedor=${idEmp}`,
      '',
      environment.headers
    ))
  }

  getRequestClient(idVendedor: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/ListSolicitudesCliente?idVendedor=${idVendedor}`,
      '',
      environment.headers
    ))
  }

  setRoutList$(idVendedor: string, idRuta: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/SetRuta?idVendedor=${idVendedor}&idRuta=${idRuta}`,
      '',
      environment.headers
    ))
  }

  setClasificationStore$(idCliente: string, idtipologia: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/TipologiaUsuarioCliente?idcliente=${idCliente}&idtipologia=${idtipologia}`,
      '',
      environment.headers
    ))
  }

  getIncentivos(idVendedor: any, idGrupo: any) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getIncentivoVendedor?idVendedor=${idVendedor}&idGrupo=${idGrupo}`,
      '',
      environment.headers
    ))
  }
}
