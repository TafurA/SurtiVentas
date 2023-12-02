import { Injectable } from '@angular/core';
import { HTTPResponse } from '@awesome-cordova-plugins/http';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable, from } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RankingSellerService {

  constructor(private http: HTTP) { }

  getRankingSellerList$(): Observable<HTTPResponse> {
    return from(this.http.get(
      `${environment.API_URL}${environment.API_PATH}/GetRanking`,
      '',
      environment.headers
    ))
  }
}
