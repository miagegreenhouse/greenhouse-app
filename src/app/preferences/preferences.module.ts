import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PreferencesPage } from './preferences.page';
import {AlertComponent} from './subComponents/alert/alert.component';
import { SensorListComponent } from './subComponents/sensorList/sensor-list.component'

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
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PreferencesPage, AlertComponent,SensorListComponent],
  exports: [AlertComponent,SensorListComponent]
})
export class PreferencesPageModule {}