import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PreferencesPage } from './preferences.page';
import {AlertComponent} from './subComponents/alert/alert.component';
import { SensorListComponent } from './subComponents/sensorList/sensor-list.component';
import { EditSensorComponent } from './subComponents/edit-sensor/edit-sensor.component';



const routes: Routes = [
  {
    path: '',
    component: PreferencesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PreferencesPage, AlertComponent,SensorListComponent, EditSensorComponent],
  entryComponents: [EditSensorComponent],
  exports: [AlertComponent,SensorListComponent, EditSensorComponent]
})
export class PreferencesPageModule {}
