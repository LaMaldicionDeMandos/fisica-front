import {Component, ElementRef, Input, OnInit} from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import {Color, Label} from 'ng2-charts';

import * as d3 from 'd3';

@Component({
  selector: 'app-simple-line-plot',
  templateUrl: './simple-line-plot.html',
  styleUrls: ['./simple-line-plot.scss']
})
export class SimpleLinePlotComponent implements OnInit {
  @Input() title: string;
  @Input() customStyle = 'display: block; width: 30rem; height: 30rem';

  private data = [
    {x: -1, y: -2},
    {x: 0, y: 0},
    {x: 1, y: 2},
    {x: 2, y: 4},
    {x: 3, y: 6},
    {x: 4, y: 8},
    {x: 5, y: 10},
    {x: 6, y: 12},
  ];

  private width = 700;
  private height = 500;
  private margin = 20;
  public svg;
  public svgInner;
  public yScale;
  public xScale;
  public xAxis;
  public yAxis;
  public lineGroup;
/*
  public lineChartData: ChartDataSets[] = [
    { data: [25, 16, 9, 4, 1, 0, 1, 4, 9, 16, 25], label: 'X', lineTension: 0.3},
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
*/
  constructor(public chartElem: ElementRef) { }

  ngOnInit() {
    this.svg = d3
      .select(this.chartElem.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('height', this.height);
    this.svgInner = this.svg.append('g').style('transform', 'translate(' + this.margin + 'px, ' + this.margin + 'px)');
    this.yScale = d3.scaleLinear()
      .domain([
        d3.max(this.data, d => d.y) + 1,
        d3.min(this.data, d => d.y) - 1
    ])
    .range([0, this.height - 2 * this.margin]);
    this.xScale = d3.scaleLinear().domain(d3.extent(this.data, d => d.x));
    this.yAxis = this.svgInner.append('g')
      .attr('id', 'y-axis')
      .style('transform', 'translate(' + this.margin + 'px, 0)');
    this.xAxis = this.svgInner.append('g')
      .attr('id', 'x-axis')
      .style('transform', 'translate(0, ' + (this.height - 2 * this.margin) + 'px)');
    this.lineGroup = this.svgInner.append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'blue')
      .style('stroke-width', '1.5px');
    this.svg.attr('width', this.width);
    this.xScale.range([this.margin, this.width - 2 * this.margin]);
    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(10);
    this.xAxis.call(xAxis);
    const yAxis = d3
      .axisRight(this.yScale);
    this.yAxis.call(yAxis);
    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);
    const points: [number, number][] = this.data.map(
      d => [this.xScale(d.x), this.yScale(d.y)]
    );
    this.lineGroup.attr('d', line(points));
  }

}
