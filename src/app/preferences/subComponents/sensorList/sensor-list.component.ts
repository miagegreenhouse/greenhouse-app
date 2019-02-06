import { Component, OnInit,Input } from '@angular/core';
import { Events } from '@ionic/angular';
import { DataService} from '../../../services/data/data.service';
import { SensorConfig } from 'src/app/model';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {

  sensor: SensorConfig;

  sensorList: SensorConfig[]= [];

  constructor(public events: Events, public dataService: DataService) {}

  ngOnInit() {
    this.fillSensors();
    this.sensorList.forEach(element => {
      this.events.subscribe('updateData:' + element.dataId, () => {
        this.fillSensors();
      });
    });
  }
  
  fillSensors(){
    this.sensorList = [];
    this.dataService.getDatas().forEach(data =>{
      Object.keys(data.sensor).forEach(sensorID => {
        const sensor = data.sensor[sensorID]
        let newConfig: SensorConfig;
        newConfig = {
          id : sensor.sensorId,
          dataId: data.dataId,
          name : sensor.nom,
          maxThresholdValue : data.max,
          minThresholdValue : data.min,

          //TODO remplir ces données lorsque le modèle est à jour
          unit : '',
          minThresholdAlertMessage : '',
          maxThresholdAlertMessage : ''
        };
        this.sensorList.push(newConfig);
      });
    });
  }

  ngOnDestroy() {
    /*this.events.unsubscribe((response: string) => {
      
    });*/
  }
}
