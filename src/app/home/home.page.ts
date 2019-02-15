import {Component} from '@angular/core';
import {ToastService} from '../services/toast/toast.service';
import {DataInfo, DateRange} from '../chart/chart.component';
import {DataService} from '../services/data/data.service';
import {Events, ModalController} from '@ionic/angular';
import {DateRangePickerComponent} from '../component/date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  customActionSheetOptions: any = {
    header: 'Sélectionner une plage de données'
  };

  dateRangeList: Tick[] = [
    {
      name:  'Temps réel',
      timestamp: 21600000 // 6h
    },
    {
      name:  '1 jour',
      timestamp: 86400000
    },
    {
      name:  '3 jours',
      timestamp: 259200000,
    },
    {
      name:  '1 semaine',
      timestamp: 604800000,
    },
    {
      name:  '3 mois',
      timestamp: 7776000000,
    },
  ];
  dateRangeSelected = 4;

  chartConfig: DataInfo = {
    isDataLive: true,
    source: -1,
    dateRange: {
      min: new Date().getTime() - 7776000000,
      max: new Date().getTime()
    }
  };

  constructor(public toastService: ToastService,
              public dataService: DataService,
              public modalCtrl: ModalController,
              public events: Events) {
  }

  onChangeDateRange() {
    if (this.dateRangeSelected === -1) {
      this.openModal();
      return;
    }

    this.chartConfig.isDataLive = true;
    this.chartConfig.dateRange = {
      min: new Date().getTime() - this.dateRangeList[this.dateRangeSelected].timestamp,
      max: new Date().getTime()
    };
    this.events.publish('updateChart', this.chartConfig);
  }

  updateCustomDateRange() {
    if (this.dateRangeSelected === -1) {
      this.openModal();
    } else {
      this.dateRangeSelected = -1;
    }
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: DateRangePickerComponent,
      componentProps: {
        'dateRange': this.chartConfig.dateRange
      }
    });
    modal.onDidDismiss().then((datRangeSelected) => {
      if (datRangeSelected.data) {
        this.chartConfig.dateRange = <DateRange>datRangeSelected.data;
        this.dataService.getDatasInDateRange(this.chartConfig.dateRange.min, this.chartConfig.dateRange.max)
            .then(() => {
              this.chartConfig.isDataLive = false;
              this.events.publish('updateChart', this.chartConfig);
            })
            .catch(err => {
              this.toastService.showToast('Erreur lors de la récupération des donneés', 'danger', 3000);
            });
      }
    });
    return await modal.present();
  }

  onChangeSource() {
    this.events.publish('updateChart', this.chartConfig);
  }
}

export interface Tick {
  name: string; // Displayed name in form
  timestamp: number; // display time area from now in ms
}
