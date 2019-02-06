import {Component, QueryList, ViewChildren} from '@angular/core';
import {ToastService} from '../services/toast/toast.service';
import {ChartComponent} from '../chart/chart.component';
import {DataService} from '../services/data/data.service';
import {Events} from '@ionic/angular';
import {Message, MessageType} from '../services/socket/socket.service';

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

  constructor(public toastService: ToastService,
              public dataService: DataService,
              public events: Events) {
  }

  onChangeDateRange() {
    this.charts.forEach(chart => {
      chart.updateDateRange(this.dateRange[this.dateRangeSelected].timestamp);
    });
  }

  addData() {
    const dataId = (Math.random() > 0.5 ? '1' : '2');
    const captorId = (Math.random() > 0.5 ? '1' : '2');
    const data = {
      timestamp: new Date().getTime(),
      value: Math.random()
    };
    const dataCaptor = {};
    dataCaptor[captorId] = data;
    const dataMessage = {};
    dataMessage[dataId] = dataCaptor;
    const message: Message = {
      type: MessageType.DATA,
      data: dataMessage
    };
    this.events.publish('data', message);
  }
}

export interface Tick {
  name: string; // Displayed name in form
  timestamp: number; // display time area from now in ms
}
