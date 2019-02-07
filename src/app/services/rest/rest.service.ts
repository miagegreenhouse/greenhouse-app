import { StorageService } from './../storage/storage.service';
import { AppConfig, ApiEntry, HTTPMethod } from './../../model/index';
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
    'Content-Type': 'application/json'
    // 'access-token': 'token' // TODO get token
  });
  apiUrl = 'http://greenhouse-iot.tk';

  constructor(private http: HttpClient,
    public storageService: StorageService
    ) { }

  get(path: string, queryParameters?: Param[]): Observable<any> {
    return this.http.get<any>(this.apiUrl + path, {
      headers: this.headers,
      params: this.getHttpParams(queryParameters)
    });
  }

  post(path: string, data: any, queryParameters?: Param[]): Observable<any> {
    return this.http.post<any>(this.apiUrl + path, data, {
      headers: this.headers,
      params: this.getHttpParams(queryParameters)
    });
  }

  getHttpParams(params: Param[]): HttpParams {
    const httpParams: HttpParams = new HttpParams();
    if (params) {
      params.forEach(queryParameter => {
        console.log(queryParameter);
        httpParams.append(queryParameter.name, queryParameter.value.toString());
      });
    }
    return httpParams;
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

  getApi() {
    let api: any = {};
    this.endPoints.forEach((val, key) => {
      let cb;
      switch (val.method) {
        case HTTPMethod.GET:
          cb = (params) => {
            return new Promise((resolve, reject) => {
              this.http.get(this.createUrlFromParams(val.url, params), {
                headers: this.getHeaders()
              }).subscribe(resolve, reject);
            });
          };
          break;
        case HTTPMethod.POST:
          cb = (value, params) => {
            return new Promise((resolve, reject) => {
              this.http.post(this.createUrlFromParams(val.url, params), value, {
                headers: this.getHeaders()
              }).subscribe(resolve, reject);
            });
          };
          break;
        case HTTPMethod.PUT:
          cb = (value, params) => {
            return new Promise((resolve, reject) => {
              this.http.put(this.createUrlFromParams(val.url, params), value, {
                headers: this.getHeaders()
              }).subscribe(resolve, reject);
            });
          };
          break;
        case HTTPMethod.DELETE:
          cb = (params) => {
            return new Promise((resolve, reject) => {
              this.http.delete(this.createUrlFromParams(val.url, params), {
                headers: this.getHeaders()
              }).subscribe(resolve, reject);
            });
          };
          break;
        default:
          throw "Unknown method";
      }
      api[key] = cb;
    });
    return api;
  }

  getHeaders() {
    let access_token = this.storageService.get("access_token");
    let token;
    if (access_token) {
      token = access_token.value;
    }
    return Object.assign({"Authorization": (token ? 'Bearer ' + token : undefined)}, this.headers);
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
