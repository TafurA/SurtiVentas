import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable, from } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private http: HTTP) { }

  getBillingTime$(groupId: string): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/horariosGrupo?idGrupo=${groupId}`,
      '',
      environment.headers
    ))
  }

  getFrequentQuestions$(): Observable<any> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/getFrequentquestions`,
      '',
      environment.headers
    ))
  }
}
