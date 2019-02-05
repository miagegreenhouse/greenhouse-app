import {Component, QueryList, ViewChildren} from '@angular/core';
import { ToastService } from '../services/toast/toast.service';
import {ChartComponent} from '../chart/chart.component';

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

  mockData1 = {
    title: 'Chart1',
    data: {
      datasets: [
        {
          label: 'My First dataset',
          borderColor: '#ff0000',
          data: [
            {
              t: new Date(1549292555136),
              y: 1
            },
            {
              t: new Date(1549288955136),
              y: 2
            },
            {
              t: new Date(1549206155136),
              y: 5
            },
            {
              t: new Date(1548082955136),
              y: 3
            }
          ],
        },
      ]
    }
  };
  mockData2 = {
    title: 'Chart2',
    data: {
      datasets: [
        {
          label: 'Second DataSet',
          borderColor: '#0000ff',
          data: [
            {
              t: new Date(1549292555136),
              y: 1
            },
            {
              t: new Date(1549288955136),
              y: 20
            },
            {
              t: new Date(1549206155136),
              y: -5
            },
            {
              t: new Date(1548082955136),
              y: 12
            }
          ],
        },
      ]
    }
  };

  constructor(public toastService: ToastService) {
  }

  onChangeDateRange() {
    this.charts.forEach(chart => {
      chart.updateDateRange(this.dateRange[this.dateRangeSelected].timestamp);
    });
  }
}

export interface Tick {
  name: string; // Displayed name in form
  timestamp: number; // display time area from now in ms
}
