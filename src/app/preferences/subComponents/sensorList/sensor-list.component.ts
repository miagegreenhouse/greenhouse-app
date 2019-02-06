import { Component, OnInit,Input } from '@angular/core';
import {Events} from '@ionic/angular';
import {Data, DataService} from '../../../services/data/data.service';
import { SensorConfig } from 'src/app/model';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {

  @Input() data: Data;

  sensorList: SensorConfig;

  constructor(public events: Events, public dataService: DataService) {}

  ngOnInit() {
    fillSensors();
    this.events.subscribe('updateData:' + this.data.dataId, () => {
      this.updateSensors();
    });
  }

  updateSensors(){
    
  }

  fillSensors(){
    Object.keys(this.dataService.getDatas()).forEach(dataId =>{

    });
  }

  ngOnDestroy() {
    this.events.unsubscribe((response: string) => {
      
    });
  }
}
