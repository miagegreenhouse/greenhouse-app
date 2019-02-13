import { Component, OnInit } from '@angular/core';
import { DataService, SensorGroup } from 'src/app/services/data/data.service';
import { ToastrService } from 'ngx-toastr';
import { AlertController } from '@ionic/angular';
import { SensorConfig } from '../../../model/index';

@Component({
  selector: 'app-sensor-group',
  templateUrl: './sensor-group.component.html',
  styleUrls: ['./sensor-group.component.scss']
})
export class SensorGroupComponent implements OnInit {

  newGroupName = '';

  constructor(public dataService: DataService,private toastr: ToastrService, public alertController: AlertController) { }

  ngOnInit() {
  }

  addSensorGroup(){
    if(this.newGroupName != ''){
      this.dataService.createSensorGroup(this.newGroupName).subscribe( (sensorGroup: SensorGroup) =>{
        this.dataService.sensorsGroups[sensorGroup._id] = sensorGroup;
        this.dataService.sensorsGroups[sensorGroup._id].sensorsId = new Set<string>();
        this.newGroupName = '';
      }, err => {
        this.toastr.warning(err,"Erreur",{
          timeOut: 5000,
          positionClass: 'toast-top-right'
        });
      })
    }
  }

  removeSensorGroup(group: SensorGroup){
    this.dataService.removeSensorGroup(group).subscribe( (response: any) =>{
      //this.dataService.sensorsGroups[sensorGroup._id] = sensorGroup;
      delete this.dataService.sensorsGroups[group._id];
    }, err => {
      this.toastr.warning(err,"Erreur",{
        timeOut: 5000,
        positionClass: 'toast-top-right'
      });
    })
  }  

  async confirmationAlert(group: SensorGroup) {

    let sensors:SensorConfig[];
    sensors = this.getSensorByGroup(group);
    let message : string = '';

    if(sensors.length > 0){
      message = '</br>Capteurs impactés : ';
    }
    sensors.forEach(sensorId => {
      message += '</br> - '+sensorId.sensorName;
    })

    const alert = await this.alertController.create({
      header: 'Attention',
      subHeader: 'Voulez vous vraiment supprimer ce type de capteur ?',
      message: message,
      buttons: [
        {
          text: 'Annuler',
          role: 'annuler',
          cssClass: 'secondary',
        }, {
          text: 'Valider',
          handler: () => {
            console.log('Confirm Okay');
            this.removeSensorGroup(group);
          }
        }
      ]
    });

    await alert.present();
  }


  getSensorByGroup(group: SensorGroup){
    let sensors: SensorConfig[] = [];
    group.sensorsId.forEach(sensorId => {
      Object.values(this.dataService.sensorsConfigs).forEach(sensorConfig=> {
        if(sensorConfig._id == sensorId){
          sensors.push(sensorConfig);
        }
      });
    });

    return sensors;
  }
}
