import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {DateRange} from '../../chart/chart.component';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  @ViewChild('startDate') min;
  @ViewChild('endDate') max;
  dateRange: DateRange;

  constructor(private navParams: NavParams, private modalCtrl: ModalController) {
    this.dateRange = this.navParams.get('dateRange');
    console.log(this.dateRange);
  }

  ngOnInit() {
  }

  closeModal(isSave) {
    if (isSave) {
      this.dateRange.start = new Date(this.min.value).getTime();
      this.dateRange.end = new Date(this.max.value).getTime();
    }
    this.modalCtrl.dismiss();
  }

  getDateTime(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }
}
