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

  chart = null;

  @ViewChild('chart') canvas;

  constructor() {}

  ngOnInit() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: this.data,
      options: {
        scales: {
          xAxes: this.getOptionxAxes(this.dateRange)
        },
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: '12',
            borderColor: 'tomato',
            borderWidth: 1
          }],
          drawTime: "afterDraw" // (default)
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

}

export interface ChartData {
  data: {
    datasets: Dataset[];
  };
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
