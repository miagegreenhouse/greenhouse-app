import { Component, OnInit,Input } from '@angular/core';
import { Events, ModalController } from '@ionic/angular';
import { DataService} from '../../../services/data/data.service';
import { SensorConfig } from 'src/app/model';
import { EditSensorComponent } from '../edit-sensor/edit-sensor.component';



@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {


  sensorList: SensorConfig[]= [];

  constructor(public events: Events, public dataService: DataService, public modalController: ModalController) {}

  ngOnInit() {
  }

  /*editSensor() {
    return this.dataService.editSensor(this.sensorEdit).subscribe(() => {});
  }*/

  async editSensor(sensor:SensorConfig) {
    const modal = await this.modalController.create({
      component: EditSensorComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        'sensor': sensor,
      }
    });
    return await modal.present();
  }
}
