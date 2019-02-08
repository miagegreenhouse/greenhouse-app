
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { SensorConfig } from 'src/app/model';
import {Validators, FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { minValueValidator, maxValueValidator } from './seuilValidator';



@Component({
  selector: 'app-edit-sensor',
  templateUrl: './edit-sensor.component.html',
  styleUrls: ['./edit-sensor.component.scss']
})
export class EditSensorComponent implements OnInit {

  sensorForm: FormGroup;
  sensor:SensorConfig;
  constructor(public navParams: NavParams, public modalController: ModalController, private formBuilder: FormBuilder) {
    this.sensor = this.navParams.get('sensor');

    this.initValidator(this.sensor);
  }

  initValidator(sensorForm: SensorConfig){
    this.sensorForm = this.formBuilder.group({
      nomCapteur: [sensorForm.name, Validators.required],
      unite: [sensorForm.unit, Validators.required],
      seuilMini: new FormControl(sensorForm.minThresholdValue, Validators.compose([
        minValueValidator(sensorForm.maxThresholdValue),
        Validators.required
      ])),
      messageSeuilMini: [sensorForm.minThresholdAlertMessage, Validators.required],
      seuilMaxi: new FormControl(sensorForm.maxThresholdValue, Validators.compose([
        maxValueValidator(sensorForm.minThresholdValue),
        Validators.required
      ])),
      messageSeuilMaxi: [sensorForm.maxThresholdAlertMessage, Validators.required]
    });
  }
  


  ngOnInit() {
  }

  controlThreshold(){

    let newConfig: SensorConfig;
    newConfig = {
      id : '',
      dataId: '',
      name : this.sensorForm.value['nomCapteur'],
      maxThresholdValue : this.sensorForm.value['seuilMaxi'],
      minThresholdValue : this.sensorForm.value['seuilMini'],

      //TODO remplir ces données lorsque le modèle est à jour
      unit : this.sensorForm.value['unite'],
      minThresholdAlertMessage : this.sensorForm.value['messageSeuilMini'],
      maxThresholdAlertMessage : this.sensorForm.value['messageSeuilMaxi']
    };

    this.initValidator(newConfig);
  }


  validateForm(){
    console.log(this.sensorForm.value);
    this.modalController.dismiss(); // Enlever NgModel du template HTML
  }

  sensorDismiss(){
    this.modalController.dismiss();
  }

}
