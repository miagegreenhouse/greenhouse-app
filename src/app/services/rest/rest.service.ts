import { StorageService } from './../storage/storage.service';
import { AppConfig, ApiEntry, HTTPMethod, UserForm, Email, SensorConfig } from './../../model/index';
import { Injectable, APP_INITIALIZER } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ConfigService } from '../config/config.service';
import { SensorGroup } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  public endPoints: Map<string, ApiEntry> = new Map<string, ApiEntry>();
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': (JSON.parse(localStorage.getItem('access_token')) ? 'Bearer ' + JSON.parse(localStorage.getItem('access_token')).value : '')
  });
  apiUrl = 'http://greenhouse-iot.tk';
  public LOGIN_ENDPOINT: string           = '/api/token';
  public GET_ME_ENDPOINT: string          = '/api/users/me';
  public EMAIL_ENDPOINT: string           = '/api/adminmails';
  public SENSORS_GROUP_ENDPOINT: string   = '/public/sensorsgroup';
  public SENSORS_CONFIG_ENDPOINT: string  = '/public/sensorsconfig';
  public SENSORS_DATA_ENDPOINT: string    = '/public/sensorsdata';
  public GET_USERS_COUNT_ENDPOINT: string = '/public/users/count';
  public CREATE_USER_ENDPOINT: string     = '/public/users';

  constructor(private http: HttpClient,
    public storageService: StorageService
    ) { }

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


  getEmails() {
    let url = this.apiUrl + this.EMAIL_ENDPOINT;
    return this.http.get(url, {headers: this.headers});
  }

  getEmail(mail: Email) {
    let url = this.apiUrl + this.EMAIL_ENDPOINT + '/' + mail._id;
    return this.http.get(url, {headers: this.headers});
  }

  createEmail(mailForm: MailForm) {
    let url = this.apiUrl + this.EMAIL_ENDPOINT;
    return this.http.post(url, mailForm, {headers: this.headers});
  }

  updateEmail(mail: Email) {
    let url = this.apiUrl + this.EMAIL_ENDPOINT + '/' + mail._id;
    return this.http.put(url, mail, {headers: this.headers});
  }

  deleteEmail(mail: Email) {
    let url = this.apiUrl + this.EMAIL_ENDPOINT + '/' + mail._id;
    return this.http.delete(url, {headers: this.headers});
  }



  getSensorsGroups() {
    let url = this.apiUrl + this.SENSORS_GROUP_ENDPOINT;
    return this.http.get(url, {headers: this.headers});
  }

  getSensorsGroup(sensorGroup: SensorGroup) {
    let url = this.apiUrl + this.SENSORS_GROUP_ENDPOINT + '/' + sensorGroup._id;
    return this.http.get(url, {headers: this.headers});
  }

  createSensorsGroup(sensorGroupForm: SensorGroupForm) {
    let url = this.apiUrl + this.SENSORS_GROUP_ENDPOINT;
    return this.http.post(url, sensorGroupForm, {headers: this.headers});
  }

  updateSensorsGroup(sensorGroup: SensorGroup) {
    let url = this.apiUrl + this.SENSORS_GROUP_ENDPOINT + '/' + sensorGroup._id;
    return this.http.put(url, sensorGroup, {headers: this.headers});
  }

  deleteSensorsGroup(sensorGroup: SensorGroup) {
    let url = this.apiUrl + this.SENSORS_GROUP_ENDPOINT + '/' + sensorGroup._id;
    return this.http.delete(url, {headers: this.headers});
  }


  getSensorsConfigs() {
    let url = this.apiUrl + this.SENSORS_CONFIG_ENDPOINT;
    return this.http.get(url, {headers: this.headers});
  }

  getSensorsConfig(sensorConfig: SensorConfig) {
    let url = this.apiUrl + this.SENSORS_CONFIG_ENDPOINT + '/' + sensorConfig._id;
    return this.http.get(url, {headers: this.headers});
  }

  createSensorsConfig(sensorConfigForm: SensorConfigForm) {
    let url = this.apiUrl + this.SENSORS_CONFIG_ENDPOINT;
    return this.http.post(url, sensorConfigForm, {headers: this.headers});
  }

  updateSensorsConfig(sensorConfig: SensorConfig) {
    let url = this.apiUrl + this.SENSORS_CONFIG_ENDPOINT + '/' + sensorConfig._id;
    return this.http.put(url, sensorConfig, {headers: this.headers});
  }

  deleteSensorsConfig(sensorConfig: SensorConfig) {
    let url = this.apiUrl + this.SENSORS_CONFIG_ENDPOINT + '/' + sensorConfig._id;
    return this.http.delete(url, {headers: this.headers});
  }

  getUsersCount() {
    let url = this.apiUrl + this.GET_USERS_COUNT_ENDPOINT;
    return this.http.get(url, {headers: this.headers});
  }

  getSensorsData(startTimestamp: number, endTimestamp: number) {
    let url = this.apiUrl + this.SENSORS_DATA_ENDPOINT + '?';
    url += [
      startTimestamp ? ('start=' + startTimestamp) : null,
      endTimestamp ? ('end=' + endTimestamp) : null
    ].join('&');
    return this.http.get(url, {headers: this.headers});
  }

  createAdminAccount(adminForm) {
    let url = this.apiUrl + this.CREATE_USER_ENDPOINT;
    return this.http.post(url, adminForm, {headers: this.headers});
  }

}

export interface MailForm {
  email: string;
}

export interface SensorConfigForm {
  sensorName?: string;
  sensorGroupId?: string;
  dataId?: string;
  dataSource?: string;
  unit?: string;
  minThresholdValue?: number;
  minThresholdAlertMessage?: string;
  maxThresholdValue?: number;
  maxThresholdAlertMessage?: string;
}

export interface SensorGroupForm {
  name: string; // ex: Temperature de l'eau
  sensorsId: Set<string>; // sensorId set
}

export interface Param {
  name: string;
  value: number | string | boolean;
}


export function RestFactory(config: ConfigService, rest: RestService) {
  return () => rest.loadFromAppConfig(config.appConfig);
}

export function init() {
  return {
      provide: APP_INITIALIZER,
      useFactory: RestFactory,
      deps: [ConfigService, RestService],
      multi: true
  };
}

const RestModule = {
  init: init
};

export { RestModule };
