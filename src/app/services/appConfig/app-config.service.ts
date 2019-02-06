import { Injectable } from '@angular/core';
import { GreenHouseConfig, SensorConfig } from '../../model/index'
import { RestService } from '../rest/rest.service'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  public config : GreenHouseConfig ={mailList: [], sensorList: []};
  private sensorsSubject : BehaviorSubject<SensorConfig[]>;
  private sensorsSource : Observable<SensorConfig[]>


  constructor(public restService: RestService) {
    this.config.sensorList = [{
      id: 's1',
      name: 'sensor 1',
      unit: 'celcius',
      minThresholdValue: -20,
      minThresholdAlertMessage: 'Findus',
      maxThresholdValue: 50,
      maxThresholdAlertValue: 'Gratin'
    }]
    this.sensorsSubject = new BehaviorSubject<SensorConfig[]>(this.config.sensorList)
    this.sensorsSource = this.sensorsSubject.asObservable()
    var delayInMilliseconds = 10000; 
    var context = this
    setTimeout(function() {
      context.refreshSensor();
    }, delayInMilliseconds);

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
  
  private refreshSensor() {
    this.config.sensorList.push(
      {
        id: 's2',
        name: 'sensor 2',
        unit: 'celcius',
        minThresholdValue: -20,
        minThresholdAlertMessage: 'Findus',
        maxThresholdValue: 50,
        maxThresholdAlertValue: 'Gratin'
      }
    );
    this.sensorsSubject.next(this.config.sensorList)
  }

  getSensors() : Observable<SensorConfig[]>{
    return this.sensorsSource;
  }
}
