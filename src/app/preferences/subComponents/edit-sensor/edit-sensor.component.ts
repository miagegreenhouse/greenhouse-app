
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, Events } from '@ionic/angular';
import { SensorConfig } from 'src/app/model';
import {Validators, FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { DataService, SensorGroup} from '../../../services/data/data.service';



@Component({
  selector: 'app-edit-sensor',
  templateUrl: './edit-sensor.component.html',
  styleUrls: ['./edit-sensor.component.scss']
})
export class EditSensorComponent implements OnInit {

  sensorForm: FormGroup;
  sensor:SensorConfig;
  sensorEdit:SensorConfig;
  errorTreshold:boolean = true;
  sensorGroup: SensorGroup;
  sensorGroupSelectedValue: string;

  constructor(public navParams: NavParams, public dataService: DataService, public modalController: ModalController, private formBuilder: FormBuilder, public events: Events) {
    this.sensor = this.navParams.get('sensor');

    this.dataService.getSensorGroups().forEach(group => {
      group.sensorsId.forEach(sensorId => {
        if(sensorId == this.sensor._id){
          this.sensorGroup = group;
        }
      });      
    });

    this.sensorForm = this.formBuilder.group({
      nomCapteur: [this.sensor.sensorName],
      unite: [this.sensor.unit],
      seuilMini: [this.sensor.minThresholdValue],
      messageSeuilMini: [this.sensor.minThresholdAlertMessage],
      seuilMaxi: [this.sensor.maxThresholdValue],
      messageSeuilMaxi: [this.sensor.maxThresholdAlertMessage],
      selectSensorGroup: [this.sensorGroupSelectedValue]
    });
  }

  ngOnInit() {
  }

  controlThreshold(){
    let seuilMaxi = Number(this.sensorForm.value['seuilMaxi']);
    let seuilMini = Number(this.sensorForm.value['seuilMini']);

    if(seuilMini > seuilMaxi){
      this.errorTreshold = false;
    }
    else{
      this.errorTreshold = true;
    }
  }


  validateForm(){
    this.controlThreshold();
    if(this.errorTreshold){

      this.sensor.sensorName = this.sensorForm.value['nomCapteur'];
      this.sensor.unit = this.sensorForm.value['unite'];
      this.sensor.minThresholdValue = this.sensorForm.value['seuilMini'];
      this.sensor.minThresholdAlertMessage = this.sensorForm.value['messageSeuilMini'];
      this.sensor.maxThresholdValue = this.sensorForm.value['seuilMaxi'];
      this.sensor.maxThresholdAlertMessage = this.sensorForm.value['messageSeuilMaxi'];

      this.dataService.getSensorGroups().forEach(group => {
        if(group.name == this.sensorForm.value['selectSensorGroup']){
          this.sensorGroup = group;
          let oldGroupId = this.sensor.sensorGroupId;
          if (oldGroupId) {
            this.dataService.sensorsGroups[this.sensor.sensorGroupId].sensorsId.delete(this.sensor._id);
          }
          this.sensor.sensorGroupId = group._id;
          this.dataService.sensorsGroups[this.sensorGroup._id].sensorsId.add(this.sensor._id)

          if(oldGroupId){
            this.events.publish('updateData:' + oldGroupId);
          }
        }   
      });


      this.modalController.dismiss(); // Enlever NgModel du template HTML
      return this.dataService.editSensor(this.sensor).subscribe(() => {});
      
    }
  }

  sensorDismiss(){
    this.modalController.dismiss();
  }

}
