import {Component, QueryList, ViewChildren} from '@angular/core';
import {ToastService} from '../services/toast/toast.service';
import {ChartComponent, DataInfo, DateRange} from '../chart/chart.component';
import {AlertMessage, DataService} from '../services/data/data.service';
import {Events, ModalController} from '@ionic/angular';
import {MessageType} from '../services/socket/socket.service';
import {DateRangePickerComponent} from '../component/date-range-picker/date-range-picker.component';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChildren(ChartComponent) charts: QueryList<ChartComponent>;

  customActionSheetOptions: any = {
    header: 'Sélectionner une plage de données'
  };

  dateRange: Tick[] = [
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
  dateRangeSelected = 0;
  sourceSelected = 'Toutes';

  customDateRange: DateRange = {
    min: new Date().getTime() - (1000 * 60 * 60 * 3),
    max: new Date().getTime()
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
    const dataInfo: DataInfo = {
      isDataLive: true,
      dateRange: {
        min: new Date().getTime() - this.dateRange[this.dateRangeSelected].timestamp,
        max: new Date().getTime()
      }
    };
    this.events.publish('updateChart', dataInfo);
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
        'dateRange': this.customDateRange
      }
    });
    modal.onDidDismiss().then((datRangeSelected) => {
      if (datRangeSelected.data) {
        this.customDateRange = <DateRange>datRangeSelected.data;
        this.dataService.getDatasInDateRange(this.customDateRange.min, this.customDateRange.max)
            .then(() => {
              const dataInfo: DataInfo = {
                isDataLive: false,
                dateRange: this.customDateRange
              };
              this.events.publish('updateChart', dataInfo);
            })
            .catch(err => {
              this.toastService.showToast('Erreur lors de la récupération des donneés', 'danger', 3000);
            });
      }
    });
    return await modal.present();
  }

  onChangeSource() {
    this.charts.forEach(chart => {
      chart.updateSource((this.sourceSelected === 'Toutes') ? null : this.sourceSelected);
    });
  }

  getSourceOptions(): string[] {
    const sources = this.dataService.getSources();
    sources.unshift('Toutes');
    return sources;
  }
}

export interface Tick {
  name: string; // Displayed name in form
  timestamp: number; // display time area from now in ms
}
