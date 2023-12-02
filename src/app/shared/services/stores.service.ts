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

  createStore(imagen: any) {

    console.log("QUE LE LLEGA AL SERVICIO ", imagen)
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Basic ${this.encodeTokenApi()}`,
    };

    const bodyParams: any = {
      nomcli_b: "123456789"
    }

    //   tipo_doc: tipo_doc,
    //   nitcli_b: nitcli_b,
    //   nomcli_b: nomcli_b,
    //   nom2cli_b: nom2cli_b,
    //   ape1cli_b: ape1cli_b,
    //   ape2cli_b: ape2cli_b,
    //   telcli_b: telcli_b,
    //   emailcli_b: emailcli_b,
    //   empcli_b: empcli_b,
    //   idVendedor: idVendedor,
    //   lat: lat,
    //   lon: lon,
    //   dircli_b: dircli_b,
    //   imagen: imagen
    // }

    // Object.keys(bodyParams).forEach(key => {
    //   formData.append(key, bodyParams[key]);
    // });

    const formData = new FormData();
    formData.append('imagen', imagen);

    console.log("DATOS A ENVIAARRR", bodyParams);

    console.log("A VER ", this.http.getDataSerializer())
    this.http.setDataSerializer('multipart')
    console.log("A VER despues ", formData)
    return from(this.http.post(
      `${environment.API_URL}${environment.API_PATH}/preRegistroClienteImg`,
      formData,
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
}
