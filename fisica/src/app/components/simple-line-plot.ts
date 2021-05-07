import {Component, Input, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import {Color, Label} from 'ng2-charts';

@Component({
  selector: 'app-simple-line-plot',
  templateUrl: './simple-line-plot.html',
  styleUrls: ['./simple-line-plot.scss']
})
export class SimpleLinePlotComponent implements OnInit {
  @Input() title: string;
  @Input() customStyle = 'display: block; width: 30rem; height: 30rem';

  public lineChartData: ChartDataSets[] = [
    { data: [25, 16, 9, 4, 1, 0, 1, 4, 9, 16, 25], label: 'X', lineTension: 0.5},
  ];
  public lineChartLabels: Label[] = ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5'];
  public lineChartOptions: ChartOptions = { responsive: true, scales: {
      xAxes: [{
        gridLines: { color: 'transparent' }
      }],
      yAxes: [{
        gridLines: { color: 'transparent' }
      }],
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'blue',
      borderWidth: 1.5,
      backgroundColor: 'rgba(255,0,0,0)',
      pointBorderColor: 'rgba(255,0,0,0)'
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor() { }

  ngOnInit() {
  }

}
