import { HttpClient } from '@angular/common/http';
import { AppConfig } from './../../model/index';
import { Injectable, APP_INITIALIZER } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public appConfig: AppConfig;
  public env: string;

  constructor(
    public http: HttpClient
  ) { }

  load() {
    return new Promise((resolve, reject) => {
      this.http.get('./assets/config/' + (environment.production ? 'prod' : 'dev') + '.json').subscribe(config => {
        this.appConfig = <AppConfig> config;
        console.log(config);
        resolve(true);
      }, reject);
    });
  }

}

export function ConfigFactory(config: ConfigService) {
  return () => config.load();
};

export function init() {
  return {
      provide: APP_INITIALIZER,
      useFactory: ConfigFactory,
      deps: [ConfigService],
      multi: true
  }
};

const ConfigModule = {
  init: init
}

export { ConfigModule };