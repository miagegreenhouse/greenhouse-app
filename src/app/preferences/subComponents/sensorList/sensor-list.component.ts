import { Component, OnInit } from '@angular/core';
import { DataService} from '../../../services/data/data.service';
import { SensorConfig } from 'src/app/model';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {

  sensorEdit: SensorConfig;

  constructor(public dataService: DataService) {}

  ngOnInit() {
  }

  editSensor() {
    return this.dataService.editSensor(this.sensorEdit).subscribe(() => {});
  }
}
