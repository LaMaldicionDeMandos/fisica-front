import {Component, ElementRef, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-simple-line-plot',
  templateUrl: './simple-line-plot.html',
  styleUrls: ['./simple-line-plot.scss']
})
export class SimpleLinePlotComponent implements OnInit {
  @Input() title: string;
  @Input() data: any[];
  @Input() width = 700;
  @Input() height = 500;
  @Input() lineColor = 'blue';
  @Input() lineWeight = '1.5px';
  private margin = 20;
  public svg;
  public svgInner;
  public yScale;
  public xScale;
  public xAxis;
  public yAxis;
  public lineGroup;

  constructor(public chartElem: ElementRef) { }

  ngOnInit() {
    this.svg = d3
      .select(this.chartElem.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('height', this.height + this.margin);
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
    this.svg.attr('width', this.width + this.margin);
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

}
