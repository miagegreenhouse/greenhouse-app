import { StorageService } from './../storage/storage.service';
import { AppConfig, ApiEntry, HTTPMethod, UserForm } from './../../model/index';
import { Injectable, APP_INITIALIZER } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  public endPoints: Map<string, ApiEntry> = new Map<string, ApiEntry>();
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': (JSON.parse(localStorage.getItem('access_token')) ? 'Bearer ' + JSON.parse(localStorage.getItem('access_token')).value : '')
  });
  apiUrl = ''; // TODO Set api URL
  public LOGIN_ENDPOINT: string   = '/api/token';
  public GET_ME_ENDPOINT: string  = '/api/users/me';

  constructor(private http: HttpClient,
    public storageService: StorageService
    ) { }

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

  createUrlFromParams(url: string, queryParameters: Param[]) {
    let endPoint = this.apiUrl + '/' + url;
    if (queryParameters) {
      queryParameters.forEach((queryParameter, i) => {
        if (i === 0) {
          endPoint += '?' + queryParameter.name + '=' + queryParameter.value.toString();
        } else {
          endPoint += '&' + queryParameter.name + '=' + queryParameter.value.toString();
        }
      });
    }
    return endPoint;
  }

  loadFromAppConfig(appConfig: AppConfig) {
    Object.keys(appConfig.restApi).forEach(endPointKey => {
      this.endPoints.set(endPointKey, appConfig.restApi[endPointKey]);
    });
    this.apiUrl = appConfig.method + "://" + appConfig.host;
    console.log(this.endPoints);
    console.log(this.apiUrl);
  }

  // getApi() {
  //   let api: any = {};
  //   this.endPoints.forEach((val, key) => {
  //     let cb;
  //     switch (val.method) {
  //       case HTTPMethod.GET:
  //         cb = (params) => {
  //           return new Promise((resolve, reject) => {
  //             this.http.get(this.createUrlFromParams(val.url, params), {
  //               headers: this.getHeaders()
  //             }).subscribe(resolve, reject);
  //           });
  //         };
  //         break;
  //       case HTTPMethod.POST:
  //         cb = (value, params) => {
  //           return new Promise((resolve, reject) => {
  //             this.http.post(this.createUrlFromParams(val.url, params), value, {
  //               headers: this.getHeaders()
  //             }).subscribe(resolve, reject);
  //           });
  //         };
  //         break;
  //       case HTTPMethod.PUT:
  //         cb = (value, params) => {
  //           return new Promise((resolve, reject) => {
  //             this.http.put(this.createUrlFromParams(val.url, params), value, {
  //               headers: this.getHeaders()
  //             }).subscribe(resolve, reject);
  //           });
  //         };
  //         break;
  //       case HTTPMethod.DELETE:
  //         cb = (params) => {
  //           return new Promise((resolve, reject) => {
  //             this.http.delete(this.createUrlFromParams(val.url, params), {
  //               headers: this.getHeaders()
  //             }).subscribe(resolve, reject);
  //           });
  //         };
  //         break;
  //       default:
  //         throw "Unknown method";
  //     }
  //     api[key] = cb;
  //   });
  //   return api;
  // }

  getMe() {
    let url = this.apiUrl + this.GET_ME_ENDPOINT;
    this.getHeaders();
    console.log(this.headers);
    return this.http.get(url, {headers: this.headers});
  }

  getHeaders() {
    let access_token = this.storageService.get("access_token");
    console.log(access_token);
    let token;
    if (access_token) {
      token = access_token.value;
      this.headers = this.headers.set('Authorization', 'Bearer ' + token);
    }
  }

  login(userForm: UserForm) {
    let url = this.apiUrl + this.LOGIN_ENDPOINT;
    return this.http.post(url, userForm, {headers: this.headers});
  }

}

export interface Param {
  name: string;
  value: number | string | boolean;
}


export function RestFactory(config: ConfigService, rest: RestService) {
  return () => rest.loadFromAppConfig(config.appConfig);
};

export function init() {
  return {
      provide: APP_INITIALIZER,
      useFactory: RestFactory,
      deps: [ConfigService, RestService],
      multi: true
  }
};

const RestModule = {
  init: init
}

export { RestModule };