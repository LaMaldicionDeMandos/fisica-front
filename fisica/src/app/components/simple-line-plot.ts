import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import * as _ from 'lodash';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-simple-line-plot',
  templateUrl: './simple-line-plot.html',
  styleUrls: ['./simple-line-plot.scss']
})
export class SimpleLinePlotComponent implements OnInit, OnChanges {
  @Input() data: any[];
  @Input() lineColor = 'blue';
  @Input() lineWeight = 1.5;
  @Input() horizontalLabel = 'x';
  @Input() verticalLavel = 'y';
  @Input() ticks = 10;

  private yValues;
  private xValues;

  public lineChartData: ChartDataSets[] = [
    { data: this.yValues, label: this.verticalLavel, lineTension: 0.3 },
  ];
  public lineChartLabels: Label[] = this.xValues;
  public lineChartOptions = { responsive: true, scales: {
      xAxes: [{
        gridLines: { color: 'transparent' },
        ticks: {
          autoSkip: true,
          maxTicksLimit: this.ticks
        }
      }],
      yAxes: [{
        gridLines: { color: 'transparent' },
      }]
    }};
  public lineChartColors: Color[] = [
    {
      borderColor: this.lineColor,
      borderWidth: this.lineWeight,
      backgroundColor: 'rgba(255,0,0,0)',
      pointBorderColor: 'rgba(255,0,0,0)'
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  /* D3 vars
  private margin = 20;
  public svg;
  public svgInner;
  public yScale;
  public xScale;
  public xAxis;
  public yAxis;
  public lineGroup;
   */

  constructor(public chartElem: ElementRef, private numberPip: DecimalPipe) { }

  ngOnChanges(changes: SimpleChanges) {
    // this.updateD3Plot();
    const values = _.reduce(this.data, (lists, pair) => {
      lists.x.push(this.numberPip.transform(pair.x, '1.0-2'));
      lists.y.push(pair.y);
      return lists;
    }, {x: [], y: []});
    this.yValues = values.y;
    this.xValues = values.x;
    this.lineChartData[0].data = this.yValues;
    this.lineChartData[0].label = this.verticalLavel;
    this.lineChartLabels = this.xValues;
    this.lineChartOptions.scales.xAxes[0].ticks.maxTicksLimit = this.ticks;
    this.lineChartColors[0].borderColor = this.lineColor;
    this.lineChartColors[0].borderWidth = this.lineWeight;
  }
  ngOnInit() {
    // this.buildD3Plot();
  }

  /*
  private updateD3Plot() {
    this.yScale.domain([
      d3.max(this.data, d => d.y),
      d3.min(this.data, d => d.y)
    ])
      .range([0, this.height - 2 * this.margin]);
    this.xScale.domain(d3.extent(this.data, d => d.x));
    this.xScale.range([this.margin, this.width - 2 * this.margin]);
    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(this.width * 0.03);
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

  private buildD3Plot() {
    this.svg = d3
      .select(this.chartElem.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('height', parseFloat(String(this.height)) + parseFloat(String(this.margin)));
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
      .style('stroke', this.lineColor)
      .style('stroke-width', this.lineWeight);
    this.svg.attr('width', parseFloat(String(this.width)) + parseFloat(String(this.margin)));
    this.xScale.range([this.margin, this.width - 2 * this.margin]);
    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(this.width * 0.03);
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
    this.svg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'end')
      .attr('x', parseFloat(String(this.width)))
      .attr('y', parseFloat(String(this.height)) + 10)
      .text(this.horizontalLabel);

    this.svg.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .attr('y', 15)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text(this.verticalLavel);
  }
   */
}
