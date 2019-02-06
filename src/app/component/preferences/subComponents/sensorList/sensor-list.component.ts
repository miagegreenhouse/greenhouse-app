import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../../services/appConfig/app-config.service'
import { SensorConfig } from '../../../../model/index'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {

  private sensors: SensorConfig[] = [];
  private subscription : Subscription;

  constructor(public appConfig: AppConfigService) {}

  ngOnInit() {
    this.subscription = this.appConfig.getSensors().subscribe((newSensors)=>{
      this.sensors = newSensors;
      console.log("here");
      console.log(newSensors);
    });
  }

  getSensors(){
    return this.sensors;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
