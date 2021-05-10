import { Component, OnInit } from '@angular/core';
import {OperationBuilder} from '../../lib/prefix-functions';
import * as _ from 'lodash';

const MRU_X = '+ x0 * v tf';
const MRU_T = '/ - xf x0 v';
const MRU_V = '/ - xf x0 tf';

const DEFAULT_STEPS = 2000;

@Component({
  selector: 'app-cinematic-page',
  templateUrl: './cinematic.page.html',
  styleUrls: ['./cinematic.page.scss']
})
export class CinematicPage implements OnInit {
  x0 = 0;
  t0 = 0;
  v = 1;
  tf;
  xf;
  question;
  position = [];
  velocity = [];

  showForm: boolean;
  showGraphs: boolean;

  constructor() { }

  ngOnInit() {}

  newExperiment() {
    this.showForm = true;
  }

  calculate() {
    this.showForm = false;
    this.showGraphs = true;
    this['calculate_' + this.question]();
    this.position = this.generateData(MRU_X,
      {x0: this.x0, v: this.v, tf: this.tf},
      'tf',
      {init: this.t0, end: this.tf}, DEFAULT_STEPS);
    this.velocity = this.generateData(MRU_V,
      {x0: this.x0, xf: this.xf, tf: this.tf},
      'v',
      {init: this.t0, end: this.tf}, DEFAULT_STEPS);
  }

  calculate_tf() {
    this.tf = this.calculateFunction(MRU_T, this);
    console.log(this.tf);
  }

  calculate_xf() {
    this.xf = this.calculateFunction(MRU_X, this);
    console.log(this.xf);
  }

  calculate_v() {
    this.v = this.calculateFunction(MRU_V, this);
    console.log(this.v);
  }

  private calculateFunction(func, data) {
    return OperationBuilder.fromPrefixFunction(func).build().evaluate(data);
  }

  private evaluate(result: OperationBuilder, value: string | number) {
    return result.addOperation(value);
  }

  private generateData(func, staticData, variableName, range, steps) {
    const variables = this.createRangeArray(range.init, range.end, steps);
    return _.map(variables, (variable) => {
      staticData[variableName] = variable;
      const result = this.calculateFunction(func, staticData);
      return {x: variable, y: result};
    });
  }

  private createRangeArray(init: number, end: number, steps: number) {
    const delta = (end - init) / steps;
    const array = [];
    for (let point = init; point <= end; point += delta) {
      array.push(point);
    }
    return array;
  }

}
