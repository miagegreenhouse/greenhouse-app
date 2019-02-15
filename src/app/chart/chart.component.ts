import {AfterContentInit, Component, Input, ViewChild} from '@angular/core';
import {SensorGroup, DataService} from '../services/data/data.service';
import {Events} from '@ionic/angular';
import {StockChart} from 'angular-highcharts';

export interface DateRange {
  min: number;
  max: number;
}

export interface DataInfo {
  isDataLive: boolean;
  source: number;
  dateRange: DateRange;
}

export interface DataResize {
  dateRange: DateRange;
  dataResize: string;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterContentInit {

  @Input() sensorGroup: SensorGroup;

  chartComponent;
  chartObject;
  chartConfig: DataInfo = {
    isDataLive: true,
    source: -1,
    dateRange: {
      min: 0,
      max: new Date().getTime()
    }
  };
  lastSource = -1;
  lastDataLive = true;

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
    this.events.subscribe('resizeChart', (dataResize: DataResize) => {
      if (dataResize.dataResize !== this.sensorGroup._id) {
        this.resizeChart(dataResize.dateRange);
      }
    });
    this.events.subscribe('updateChart', (chartConfig: DataInfo) => {
      let isUpdateChart = false;
      if (this.lastSource !== chartConfig.source) {
        this.lastSource = chartConfig.source;
        isUpdateChart = true;
      }
      if (this.lastDataLive !== chartConfig.isDataLive) {
        this.lastDataLive = chartConfig.isDataLive;
        isUpdateChart = true;
      }
      this.chartConfig = Object.assign({}, chartConfig); // deep copy
      if (isUpdateChart) {
        this.updateChart();
      }
      this.resizeChart(chartConfig.dateRange);
    });
  }

  resizeChart(dateRange: DateRange) {
    if (this.chartObject && this.chartObject.xAxis && this.chartObject.xAxis[0]) {
      this.chartObject.xAxis[0].setExtremes(dateRange.min, dateRange.max);
    }
  }

  ngAfterContentInit() {
    this.events.subscribe('updateData:' + this.sensorGroup._id, () => {
      this.updateChart();
    });
    setTimeout(() => {
      this.updateChart();
    }, 1000);
  }

  public updateChart(): void {
    const self = this;
    this.chartComponent = new StockChart({
      chart: {
        events: {
          load: function() { // TODO: arrrow function
            self.chartObject = this;
          }
        }
      },

      yAxis: {
        events: {},
        plotLines: this.getPlotLines()
      },

      xAxis: {
        events: {
          setExtremes: function (e) {
            if (e.trigger !== 'navigator') { return; }
            const dataResize: DataResize = {
              dateRange: {
                min: e.min,
                max: e.max,
              },
              dataResize: self.sensorGroup._id
            };
            self.events.publish('resizeChart', dataResize);
          }
        }
      },

      tooltip: {
        xDateFormat: '%m/%e/%y %H:%M'
      },

      credits: {
        enabled: false
      },

      legend: {
        enabled: true
      },

      rangeSelector: {
        enabled: false
      },

      title: {
        text: this.sensorGroup.name
      },

      time: {
        // timezone: "Europe/Paris",
        timezoneOffset: 2 * new Date().getTimezoneOffset(),
        // useUTC: false
      },

      series: this.getChartData()
    });
  }

  getPlotLines(): any[] {
    const plotLines = [];
    const nbSensors = this.getSensorsId().length;
    if (nbSensors === 0 || nbSensors > 1) {
      return plotLines;
    }
    const sensorConfig = this.dataService.getSensorConfig(this.getSensorsId()[0]);
    if (sensorConfig.minThresholdValue) {
      plotLines.push(this.getPlotLine(Number(sensorConfig.minThresholdValue), true));
    }
    if (sensorConfig.maxThresholdValue) {
      plotLines.push(this.getPlotLine(Number(sensorConfig.maxThresholdValue), true));
    }
    return plotLines;
  }

  private getPlotLine(value: number, isMin: boolean) {
    return {
      value: value,
      color: 'red',
      dashStyle: 'shortdash',
      zIndex: 5,
      width: 2,
      label: {
        text: isMin ? 'min' : 'max'
      }
    };
  }

  private getChartData(): any[] {
    const series = [];
    this.getSensorsId().forEach(sensorId => {
      series.push({
        name: this.dataService.getSensorConfig(sensorId).sensorName, // this.dataService.getSensorConfig(sensorId).sensorName,
        data: this.dataService.getSensorData(sensorId, this.chartConfig.isDataLive).sort((d1, d2) => { // TODO : sort server side
          return d1[0] > d2[0] ? 1 : -1;
        }),
        color: this.dataService.getSensorConfig(sensorId).color || this.getColor(sensorId)
      });
    });
    return series;
  }

  public getSensorsId(): string[] {
    return this.dataService.getDataSensorsId(this.sensorGroup._id)
      .filter((sensorId) => {
        const sensorDataSource = this.dataService.getSensorConfig(sensorId).dataSource;
        if (this.chartConfig.source === -1) { return true; }
        return (sensorDataSource === this.chartConfig.source);
      });
  }

  public getUnit(sensorId: string): string {
    return this.dataService.getSensorConfig(sensorId).unit;
  }

  public getLastValue(sensorId: string): string {
    const sensorData: number[][] = this.dataService.getSensorData(sensorId, this.chartConfig.isDataLive);
    if (!sensorData || sensorData.length === 0 ) {
      return 'no sensorGroup';
    }
    return sensorData[sensorData.length - 1][1].toFixed(2);
  }

  public getColor(sensorId: string): string {
    let hash = 0;
    for (let i = 0; i < sensorId.length; i++) {
      hash += sensorId.charCodeAt(i);
    }
    return this.dataService.sensorsConfigs[sensorId].color || this.colors[hash % this.colors.length];
  }

  hasData(): boolean {
    return this.getSensorsId().length > 0;
  }

  public getSourceName(): string {
    const sourceFound = this.dataService.sourcesOptions.find((source) => {
      return source.value === this.chartConfig.source;
    });
    return sourceFound ? sourceFound.name : 'Toutes les sources';
  }
}
