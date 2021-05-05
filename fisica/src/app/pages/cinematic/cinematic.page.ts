import { Component, OnInit } from '@angular/core';
import {OperationBuilder} from '../../lib/prefix-functions';

const MRU_X = '+ x0 * v tf';
const MRU_T = '/ - xf x0 v';
const MRU_V = '/ - xf x0 tf';

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

  constructor() { }

  ngOnInit() {}

  calculate() {
    this['calculate_' + this.question]();
  }

  calculate_tf() {
    this.tf = this.calculateFunction(MRU_T);
    console.log(this.tf);
  }

  calculate_xf() {
    this.xf = this.calculateFunction(MRU_X);
    console.log(this.xf);
  }

  calculate_v() {
    this.v = this.calculateFunction(MRU_V);
    console.log(this.v);
  }

  private calculateFunction(func) {
    return OperationBuilder.fromPrefixFunction(func).build().evaluate(this);
  }

  private evaluate(result: OperationBuilder, value: string | number) {
    return result.addOperation(value);
  }

}
