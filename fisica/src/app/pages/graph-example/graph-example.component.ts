import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import {Color, Label} from 'ng2-charts';

@Component({
  selector: 'app-graph-example',
  templateUrl: './graph-example.component.html',
  styleUrls: ['./graph-example.component.scss']
})
export class GraphExampleComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [25, 16, 9, 4, 1, 0, 1, 4, 9, 16, 25], label: 'Series A', lineTension: 0.5 },
  ];
  public lineChartLabels: Label[] = ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5'];
  public lineChartOptions = { responsive: true, scales: {
      xAxes: [{
        gridLines: { color: 'transparent' }
      }],
      yAxes: [{
        gridLines: { color: 'transparent' }
      }]
    }};
  public lineChartColors: Color[] = [
    {
      borderColor: 'blue',
      borderWidth: 1.5,
      backgroundColor: 'rgba(255,0,0,0)',
      //pointBorderColor: 'rgba(255,0,0,0)'
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor() { }

  ngOnInit() {
  }

}
