import {AfterContentInit, Component, Input, ViewChild} from '@angular/core';
import {SensorGroup, DataService} from '../services/data/data.service';
import {Events} from '@ionic/angular';
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
    const self = this;
    this.theChart = new StockChart({
      chart: {
        events: {
          load: function() {
            let chart = this;
            self.events.subscribe('resizeChart', function(dataResize) {
              if (dataResize !== self.data._id) {
                chart.xAxis[0].setExtremes(dataResize.min, dataResize.max);
              }
            });
          }
        }
      },

      yAxis: {
        events: {},
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
            if (e.trigger !== 'navigator') return;
            self.events.publish('resizeChart', {
              min: e.min,
              max: e.max,
              dataResize: self.data._id
            });
          }
        }
      },

      rangeSelector: {
        enabled: false
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
