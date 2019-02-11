import {AfterContentInit, Component, Input, ViewChild} from '@angular/core';
import {SensorGroup, DataService, SensorData} from '../services/data/data.service';
import {Events} from '@ionic/angular';
import {SensorConfig} from '../model';
import {StockChart} from 'angular-highcharts';

export interface DateRange {
  start: number;
  end: number;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterContentInit {

  theChart;

  @Input() data: SensorGroup;
  dateRange: DateRange = {
    start: new Date().getTime() - 180000, // Default value is 3min
    end: new Date().getTime()
  };
  source = null;

  colors: string[] = [
    '#953686',
    '#cf368d',
    '#f17e2f',
    '#edb446',
    '#66cd7f',
    '#62a1d1',
    '#5cd0dd'
  ];

  @ViewChild('chart') canvas;

  constructor(public events: Events, public dataService: DataService) {
  }

  ngAfterContentInit() {
    this.events.subscribe('updateData:' + this.data._id, () => {
      this.updateChart();
    });
    setTimeout(() => {
      this.updateChart();
    }, 1000);
  }

  public updateChart(): void {
    this.theChart = new StockChart({
      chart: {
        events: {
          setExtremes: function(event) {
            // log the min and max of the primary, datetime x-axis
            console.log(event.xAxis[0].min);
            console.log(event.xAxis[0].max);
            console.log(event.yAxis[0].min, event.yAxis[0].max);
          }
        }
      },

      yAxis: {
        title: {
          text: 'Exchange rate'
        },
        plotLines: [{
          value: 25,
          color: 'green',
          dashStyle: 'shortdash',
          width: 2,
          label: {
            text: 'Last quarter minimum'
          }
        }, {
          value: 70,
          color: 'red',
          dashStyle: 'shortdash',
          width: 2,
          label: {
            text: 'Last quarter maximum'
          }
        }]
      },

      xAxis: {
        events: {
          setExtremes: function (e) {
            // TODO : date range selected
            console.log(e);
          }
        }
      },

      rangeSelector: {
        selected: 1
      },

      title: {
        text: this.data.name
      },

      series: this.getChartData()
    });
  }

  public updateDateRange(dateRange: DateRange): void {
    this.dateRange = dateRange;
    this.updateChart();
  }

  public updateSource(newSource: string): void {
    this.source = newSource;
    this.updateChart();
  }

  private getChartData(): any[] {
    const series = [];
    this.getSensorsId().forEach(sensorId => {
      series.push({
        name: this.dataService.getSensorConfig(sensorId).sensorName,
        data: this.dataService.getSensorData(sensorId).sort((d1, d2) => { // TODO : sort server side
          return d1[0] > d2[0] ? 1 : -1;
        })
      });
    });
    return series;
  }

  public getSensorsId(): string[] {
    return this.dataService.getDataSensorsId(this.data._id);
  }

  public getLastValue(sensorId: string): string {
    const sensorData: number[][] = this.dataService.getSensorData(sensorId);
    if (!sensorData || sensorData.length === 0 ) {
      return 'no data';
    }
    return sensorData[sensorData.length - 1][1].toFixed(2);
  }

  public getColor(sensorId: string): string {
    let hash = 0;
    for (let i = 0; i < sensorId.length; i++) {
      hash += sensorId.charCodeAt(i);
    }
    return this.colors[hash % this.colors.length];
  }
}
