import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {DateRange} from '../../chart/chart.component';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  @ViewChild('startDate') start;
  @ViewChild('endDate') end;
  dateRange: DateRange;

  constructor(private navParams: NavParams, private modalCtrl: ModalController) {
    this.dateRange = this.navParams.get('dateRange');
    console.log(this.dateRange);
  }

  ngOnInit() {
  }

  closeModal(isSave) {
    if (isSave) {
      this.dateRange.start = new Date(this.start.value).getTime();
      this.dateRange.end = new Date(this.end.value).getTime();
    }
    this.modalCtrl.dismiss();
  }

  getDateTime(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }
}
