import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { CookieService } from 'ngx-cookie-service';
import { Observable, from } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserSellerModel } from '@core/models/user_seller_model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_DATA_SESSION: any = '';
  public DECODE_DATA_SESSION: any = '';
  private userModel: UserSellerModel = {
    userId: '',
    name: '',
    firstSurName: '',
    lastName: '',
    foto: '',
    email: '',
    telemp_b: '',
    grupo: '',
    nitEmp: '',
  }

  constructor(private http: HTTP, private cookie: CookieService) { }

  /**
   * Valida en la intranet si el usuario es vendedor
   *
   * @param {string} user - Usuario asignado al usuario
   * @param {string} password - Contraseña del usuario
   * @return {*}  {Observable<any>} - Devuelve los datos de la sesión o mensaje de error
   * @memberof AuthService
   */
  sendCredentials$(user: string, password: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/autenticarVendedor?login=${user}&clave=${password}`,
      '',
      environment.headers
    ))
  }

  passwordChange(e: any) {
    const inputToChange = e.target.closest(".o-form__field-wrap").querySelector("input")
    if (e.target.classList.contains("i-eye")) {
      e.target.classList.remove("i-eye")
      e.target.classList.add("i-eye-lock")
      inputToChange.type = 'text';
    } else {
      e.target.classList.add("i-eye")
      e.target.classList.remove("i-eye-lock")
      inputToChange.type = 'password';
    }
  }

  /**
   * Obtiene el token de session
   * 
   * Decodifica los datos del usuario en sesión
   * 
   * Genera variables globales codemp_b | bodemp_b | cdi | minimoCompra
   * 
   * Setea los datos a usar del usuario
   * 
   * @memberof AuthService
   */
  setDataSessionStorage() {
    this.TOKEN_DATA_SESSION = this.cookie.get('sessionToken')
    this.DECODE_DATA_SESSION = JSON.parse(atob(this.TOKEN_DATA_SESSION))
    let {
      codemp_b,
      bodemp_b,
      nomemp_b,
      apeemp_b,
      ape2emp_b,
      coremp_b,
      telemp_b,
      grupo,
      nitemp_b,
      foto,
      cdi,
      Minimo_compra
    } = this.DECODE_DATA_SESSION
    // Global data
    localStorage.setItem('codemp_b', codemp_b)
    localStorage.setItem('group', bodemp_b)
    localStorage.setItem('bodega', cdi)
    localStorage.setItem('minimoCompra', Minimo_compra)

    // User session data
    this.userModel.userId = codemp_b
    this.userModel.name = nomemp_b
    this.userModel.firstSurName = apeemp_b
    this.userModel.lastName = ape2emp_b
    this.userModel.email = coremp_b
    this.userModel.telemp_b = telemp_b
    this.userModel.grupo = grupo
    this.userModel.nitEmp = nitemp_b
    this.userModel.numBodega = bodemp_b
    this.userModel.foto = foto
  }

  getDataSessionStorage() {
    this.setDataSessionStorage()
    return this.userModel
  }

  editDataUser(idVendedor: string, emailVendedor: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/updateInformationSeller?idVendedor=${idVendedor}&emaVendedor=${emailVendedor}`,
      '',
      environment.headers
    ))
  }

  checkAsistenciaSeller(idVendedor: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/validarAsistencia?IdVendedor=${idVendedor}`,
      '',
      environment.headers
    ))
  }

  updatePassword$(idVendedor: string, password: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/Changepassword?idVendedor=${idVendedor}&password=${password}`,
      '',
      environment.headers
    ))
  }

  serviceCredentialValidate$(idVendedor: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/Forgotpassword?identificacion=${idVendedor}`,
      '',
      environment.headers
    ))
  }

  serviceSecurityCodeValidate(code: string, email: string) {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/VerificationVendedor?codigo=${code}&email=${email}`,
      '',
      environment.headers
    ))
  }

}
