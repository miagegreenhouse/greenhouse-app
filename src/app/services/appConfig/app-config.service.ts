import { Injectable } from '@angular/core';
import { AppConfig } from '../../model/index'
import { RestService } from '../rest/rest.service'

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  public config : AppConfig;

  constructor(public restService: RestService) {
    this.getMails();
    this.getSensors();
   }

  getMails(){
    //TODO
    this.restService.get(""); 
  }

  addMail(mail: string){
    //TODO
  }

  removeMail(mail: string){
    //TODO
  }
  
  getSensors(){
    //TODO
  }
}
