import {Component, QueryList, ViewChildren} from '@angular/core';
import {ToastService} from '../services/toast/toast.service';
import {ChartComponent} from '../chart/chart.component';
import {AlertMessage, DataService} from '../services/data/data.service';
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
  sourceSelected = 'Toutes';

  constructor(public toastService: ToastService,
              public dataService: DataService,
              public events: Events) {
  }

  onChangeDateRange() {
    this.charts.forEach(chart => {
      chart.updateDateRange(this.dateRange[this.dateRangeSelected].timestamp);
    });
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

  addData() {
    const dataId = (Math.random() > 0.5 ? '1' : '2');
    const sensorId = (Math.random() > 0.5 ? '1' : '2');
    const data = {
      timestamp: new Date().getTime(),
      value: Math.random()
    };
    const dataCaptor = {};
    dataCaptor[sensorId] = data;
    const dataMessage = {};
    dataMessage[dataId] = dataCaptor;
    this.events.publish(MessageType.DATA, dataMessage);
  }

  addAlert() {
    const alert: AlertMessage = {
      message: 'Random Alert',
      alertId: '' + (Object.keys(this.dataService.alerts).length + 100),
      acquit: null,
      dataId: '1',
      sensorId: '1',
      timestamp: new Date().getTime(),
      value: Math.random()
    };
    this.events.publish(MessageType.ALERT, alert);
  }
}

export interface Tick {
  name: string; // Displayed name in form
  timestamp: number; // display time area from now in ms
}
