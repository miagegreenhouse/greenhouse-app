
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
  sensorGroups: SensorGroup[] = [];
  sensorGroupSelectedValue: string;

  constructor(public navParams: NavParams, public dataService: DataService, public modalController: ModalController, private formBuilder: FormBuilder, public events: Events) {
    this.sensor = this.navParams.get('sensor');

    this.dataService.getSensorGroups().forEach(group => {
      group.sensorsId.forEach(sensorId => {
        if(sensorId == this.sensor._id){
          this.sensorGroups.push(group);
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
      selectSensorGroup: [this.sensorGroups]
    });
  }

  ngOnInit() {
  }

  controlThreshold(){
    let seuilMaxi = Number(this.sensorForm.value['seuilMaxi']);
    let seuilMini = Number(this.sensorForm.value['seuilMini']);

    this.errorTreshold = seuilMini > seuilMaxi;
  }


  validateForm(){
    this.controlThreshold();
    if(!this.errorTreshold){

      this.sensor.sensorName = this.sensorForm.value['nomCapteur'];
      this.sensor.unit = this.sensorForm.value['unite'];
      this.sensor.minThresholdValue = this.sensorForm.value['seuilMini'];
      this.sensor.minThresholdAlertMessage = this.sensorForm.value['messageSeuilMini'];
      this.sensor.maxThresholdValue = this.sensorForm.value['seuilMaxi'];
      this.sensor.maxThresholdAlertMessage = this.sensorForm.value['messageSeuilMaxi'];
      let oldGroupIds = this.sensor.sensorGroupIds;
      if (oldGroupIds) {
        this.sensor.sensorGroupIds.forEach(sensorGroupId => {
          console.log(sensorGroupId);
          this.dataService.sensorsGroups[sensorGroupId].sensorsId.delete(this.sensor._id);
        });
        this.sensor.sensorGroupIds = [];
      }
      this.dataService.getSensorGroups().forEach(group => {
        console.log(this.sensorForm.value['selectSensorGroup']);

        this.sensorForm.value['selectSensorGroup'].forEach(selectedSensorGroup => {
          if(group.name == selectedSensorGroup.name){

            this.sensor.sensorGroupIds.push(group._id);
            this.dataService.sensorsGroups[selectedSensorGroup._id].sensorsId.add(this.sensor._id)
  
          }   
        });
      });

      if(oldGroupIds){
        oldGroupIds.forEach(oldGroupId => {
          this.events.publish('updateData:' + oldGroupId);
        });
      }

      this.modalController.dismiss(); // Enlever NgModel du template HTML
      return this.dataService.editSensor(this.sensor).subscribe(() => {});
      
    }
  }

  sensorHasGroup(sensorGroup: SensorGroup) {
    if (this.sensor.sensorGroupIds) {
      console.log(this.sensor.sensorGroupIds.indexOf(sensorGroup._id));
      return this.sensor.sensorGroupIds.indexOf(sensorGroup._id) !== -1;
    } else {
      return false;
    }
  }

  sensorDismiss(){
    this.modalController.dismiss();
  }

}
