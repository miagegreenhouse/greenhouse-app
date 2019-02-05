import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { Chart } from 'chart.js';

// @ts-ignore
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() title: string;
  @Input() data: ChartData;
  @Input() dateRange = 21600000; // Default value is 6h
  @Input() min: number = null;
  @Input() max: number = null;

  chart = null;
  paddingPercent = 0.1;

  @ViewChild('chart') canvas;

  constructor() {}

  ngOnInit() {

    // In order to be more readable add a paddingPercent padding top and bottom in chart
    const chartBounds: number[] = this.getChartBounds();

    // Add horizontal lines for min and max alert values in chart
    const annotations = [];
    if (this.min !== null) {
      annotations.push(this.getAnnotation(this.min, true));
    }
    if (this.max !== null) {
      annotations.push(this.getAnnotation(this.max, false));
    }

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: this.data,
      options: {
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
  private getChartBounds(): number[] {
    const minMax: number[] = this.getMinMax();
    const marginChart = (minMax[1] - minMax[0]) * this.paddingPercent;

    minMax[0] = minMax[0] - marginChart;
    minMax[1] = minMax[1] + marginChart;

    return minMax;
  }

  // Return [min, max]
  // min: Min value between all values and min alert value
  // max: Max value between all values and max alert value
  private getMinMax(): number[] {
    if (this.data.datasets.length === 0 && this.data.datasets[0].data.length === 0) {
      return [0, 0];
    }
    const initValue = this.data.datasets[0].data[0].y;
    const minMax: number[] = [initValue, initValue];

    this.data.datasets.forEach(dataset => {
      dataset.data.forEach(data => {
        minMax[0] = Math.min(data.y, minMax[0]);
        minMax[1] = Math.max(data.y, minMax[1]);
      });
    });
    minMax[0] = Math.min(this.min, minMax[0]);
    minMax[1] = Math.max(this.max, minMax[1]);

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

}

export interface ChartData {
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: DataFormat[];
  borderColor: string;
}


export interface DataFormat {
  t: Date;
  y: number;
}
