import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  apiUrl = ''; // TODO Set api URL

  constructor(private http: HttpClient) { }

  get(path: string, queryParameters?: Param[]): Observable<any> {
    const url = this.apiUrl;
    const params = new HttpParams();
    if (queryParameters) {
      queryParameters.forEach(queryParameter => {
        params.append(queryParameter.name, queryParameter.value.toString());
      });
    }
    return this.http.get<any>(url + path, {
      headers: this.headers,
      params: params
    });
  }
}

export interface Param {
  name: string;
  value: number | string | boolean;
}
