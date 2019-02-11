
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { SensorConfig } from 'src/app/model';
import {Validators, FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { minValueValidator } from './seuilValidator';



@Component({
  selector: 'app-edit-sensor',
  templateUrl: './edit-sensor.component.html',
  styleUrls: ['./edit-sensor.component.scss']
})
export class EditSensorComponent implements OnInit {

  sensorForm: FormGroup;
  sensor:SensorConfig;
  errorTreshold:boolean = true;

  constructor(public navParams: NavParams, public modalController: ModalController, private formBuilder: FormBuilder) {
    this.sensor = this.navParams.get('sensor');

    this.sensorForm = this.formBuilder.group({
      nomCapteur: [this.sensor.name, Validators.required],
      unite: [this.sensor.unit, Validators.required],
      seuilMini: [this.sensor.minThresholdValue, Validators.required],
      messageSeuilMini: [this.sensor.minThresholdAlertMessage, Validators.required],
      seuilMaxi: [this.sensor.maxThresholdValue, Validators.required],
      messageSeuilMaxi: [this.sensor.maxThresholdAlertMessage, Validators.required]
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
      //TODO : Faire appel au service pour modifier le capteur      
      this.modalController.dismiss(); // Enlever NgModel du template HTML
    }
  }

  sensorDismiss(){
    this.modalController.dismiss();
  }

}
