import { Component, OnInit } from '@angular/core';
import { DataService, SensorGroup } from 'src/app/services/data/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sensor-group',
  templateUrl: './sensor-group.component.html',
  styleUrls: ['./sensor-group.component.scss']
})
export class SensorGroupComponent implements OnInit {

  newGroupName = '';

  constructor(public dataService: DataService,private toastr: ToastrService) { }

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
    //TODO
  }  
}
