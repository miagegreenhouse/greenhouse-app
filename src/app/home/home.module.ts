import { ToastService } from '../services/toast/toast.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import {ChartComponent} from '../chart/chart.component';
import {DateRangePickerComponent} from '../component/date-range-picker/date-range-picker.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import stock from 'highcharts/modules/stock.src';
import more from 'highcharts/highcharts-more.src';

export function highchartsModules() {
  return [stock, more];
}

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, ChartComponent, DateRangePickerComponent],
  providers: [
    ToastService,
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
  ],
  entryComponents: [DateRangePickerComponent],
  exports: [DateRangePickerComponent]
})
export class HomePageModule {}
