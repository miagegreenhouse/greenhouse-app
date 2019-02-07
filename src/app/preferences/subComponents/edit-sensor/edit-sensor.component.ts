import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { SensorConfig } from 'src/app/model';


@Component({
  selector: 'app-edit-sensor',
  templateUrl: './edit-sensor.component.html',
  styleUrls: ['./edit-sensor.component.scss']
})
export class EditSensorComponent implements OnInit {

  sensor:SensorConfig;
  constructor(public navParams: NavParams, public modalController: ModalController) {
    this.sensor = this.navParams.get('sensor');
     }

  ngOnInit() {
  }

  sensorValidate(){
    console.log(this.sensor.name);
    this.modalController.dismiss();
  }

  sensorDismiss(){
    this.modalController.dismiss();
  }

}
