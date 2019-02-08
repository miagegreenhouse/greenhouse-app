import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { Chart } from 'chart.js';
import {SensorGroup, DataService, SensorData} from '../services/data/data.service';
import {Events} from '@ionic/angular';
import {SensorConfig} from '../model';

// @ts-ignore
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() data: SensorGroup;
  dateRange = 21600000; // Default value is 6h
  source = null;

  chart = null;
  paddingPercent = 0.1;

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

  ngOnInit() {
    this.updateChart();
    this.events.subscribe('updateData:' + this.data.dataId, () => {
      this.updateChart();
    });
  }

  private updateChart(): void {
    const chartData: ChartData = this.getChartData();

    // In order to be more readable add a paddingPercent padding top and bottom in chart
    const chartBounds: number[] = (chartData.datasets.length === 0) ? [0, 1] : this.getChartBounds(chartData);

    // Add horizontal lines for min and max alert values in chart
    const annotations = [];
    // TODO set annotations min max for each sensor

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: chartData,
      options: {
        title: {
          display: true,
          text: this.data.name
        },
        animation: { duration: 0 },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: chartBounds[0],
              suggestedMax: chartBounds[1]
            }
          }],
          xAxes: this.getOptionxAxes(this.dateRange)
        },
        annotation: {
          annotations: annotations
        }
      }
    });
  }

  public updateDateRange(newDateRange: number): void {
    this.chart.options.scales.xAxes = this.getOptionxAxes(newDateRange);
    this.chart.update();
  }

  public updateSource(newSource: string): void {
    this.source = newSource;
    this.updateChart();
  }

  private getChartData(): ChartData {
    const chartData: ChartData = {
      datasets: []
    };
    this.getSensorsId().forEach(sensorId => {
      const sensorDatas: SensorData[] = this.dataService.getSensorData(sensorId);
      const sensorConfig: SensorConfig = this.dataService.getSensorConfig(sensorId);
      const dataset: Dataset = {
        label: sensorConfig.source,
        borderColor: this.getColor(sensorId),
        data: []
      };
      if (this.source && this.source !== sensorConfig.source) {
        return;
      }
      sensorDatas.forEach(data => {
        dataset.data.push({
          t: new Date(data.timestamp),
          y: data.value
        });
      });
      chartData.datasets.push(dataset);
    });
    return chartData;
  }

  private getOptionxAxes(dateRange: number) {
    return [{
      type: 'time',
      time: {
        min: new Date(new Date().getTime() - dateRange),
        max: new Date()
      }
    }];
  }

  // Return [min, max]
  // min: min chart display - paddingPercent % margin
  // max: maxchart display - paddingPercent % margin
  private getChartBounds(chartData: ChartData): number[] {
    const minMax: number[] = this.getMinMax(chartData);
    const marginChart = (minMax[1] - minMax[0]) * this.paddingPercent;

    minMax[0] = minMax[0] - marginChart;
    minMax[1] = minMax[1] + marginChart;

    return minMax;
  }

  // Return [min, max]
  // min: Min value between all values and min alert value
  // max: Max value between all values and max alert value
  private getMinMax(chartData: ChartData): number[] {
    if (chartData.datasets.length === 0 && chartData.datasets[0].data.length === 0) {
      return [0, 0];
    }
    const initValue = chartData.datasets[0].data[0].y;
    const minMax: number[] = [initValue, initValue];

    for (const sensorId of this.getSensorsId()) {
      const sensorConfig = this.dataService.getSensorConfig(sensorId);
      if (sensorConfig.minThresholdValue != null) {
        minMax[0] = Math.min(sensorConfig.minThresholdValue, minMax[0]);
      }
      if (sensorConfig.minThresholdValue != null) {
        minMax[1] = Math.max(sensorConfig.maxThresholdValue, minMax[1]);
      }
    }

    chartData.datasets.forEach(dataset => {
      dataset.data.forEach(data => {
        minMax[0] = Math.min(data.y, minMax[0]);
        minMax[1] = Math.max(data.y, minMax[1]);
      });
    });

    return minMax;
  }

  private getAnnotation(value: number, isMin: boolean) {
    return {
      type: 'line',
      mode: 'horizontal',
      scaleID: 'y-axis-0',
      value: value,
      borderColor: '#ff0000',
      borderWidth: 1,
      label: {
        enabled: true,
        backgroundColor: 'rgba(0,0,0,0.8)',
        fontSize: 12,
        fontStyle: 'bold',
        fontColor: '#fff',
        position: 'left',
        content: (isMin ? 'min' : 'max') + ' : ' + value
      }
    };
  }

  public getSensorsId(): string[] {
    return Object.keys(this.data.sensorsId);
  }

  public getLastValue(sensorId: string): string {
    const sensorData: SensorData[] = this.dataService.getSensorData(sensorId);
    if (sensorData.length === 0 ) {
      return 'no data';
    }
    return sensorData[sensorData.length - 1].value.toFixed(2);
  }

  public getColor(sensorId: string): string {
    let hash = 0;
    for (let i = 0; i < sensorId.length; i++) {
      hash += sensorId.charCodeAt(i);
    }
    return this.colors[hash % this.colors.length];
  }
}

export interface ChartData {
  datasets: Dataset[];
}

export interface Dataset {
  label: string; // source
  data: DataFormat[];
  borderColor: string;
}


export interface DataFormat {
  t: Date;
  y: number;
}
