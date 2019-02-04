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

  chart = null;

  @ViewChild('chart') canvas;

  constructor() { }

  ngOnInit() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: this.data,
      options: {
        scales: {
          xAxes: [{
            type: 'time',
          }]
        }
      }
    });
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
