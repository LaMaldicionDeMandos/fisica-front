import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

const MRU = ['+', 'x0', '*', 'v', 'tf'];
const MRU_T = ['/', '-', 'xf', 'x0', 'v'];

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

  calculateT() {
    this.tf = this.calculate(MRU_T);
    console.log(this.tf);
  }

  private calculate(func) {
    const ecuation = _.map(func, (value) => !isNaN(this[value]) ? this[value] : value);
    return _.reduce(ecuation, this.evaluate, OperationBuilder.builder()).build().evaluate();
  }

  private evaluate(result: OperationBuilder, value: string | number) {
    return result.addOperation(value);
  }

}

interface Operation {
  apply(op: string | number): Operation;
  evaluate(): number;
  isValid(): boolean;
}

class EmptyOperation implements Operation {
  constructor() {}

  apply(op: string | number): Operation {
    return OperationFactory.create(op);
  }

  evaluate(): number {
    return undefined;
  }

  isValid(): boolean {
    return false;
  }
}

class Identity implements Operation {
  constructor(private param: number) {}

  apply(op: string | number): Operation {
    const operation: Operation = OperationFactory.create(op);
    return (operation instanceof Identity) ? operation : operation.apply(this.evaluate());
  }

  evaluate(): number {
    return this.param;
  }

  isValid(): boolean {
    return true;
  }
}

class BinaryOperator implements Operation {
  protected a: Operation;
  protected b: Operation;
  constructor() {}

  apply(op: string | number): Operation {
    const operation = OperationFactory.create(op);
    if (!this.a || this.a instanceof EmptyOperation) {
      this.a = operation;
    } else if (!this.b || !_.isNil(this.b)) {
      this.b = operation;
    }
    return operation;
  }

  evaluate(): number {
    return 0;
  }

  isValid(): boolean {
    return (!_.isNil(this.a) || this.a instanceof EmptyOperation) && (!_.isNil(this.b) || this.b instanceof EmptyOperation);
  }
}

class Sum extends BinaryOperator {
  evaluate(): number {
    return this.a.evaluate() + this.b.evaluate();
  }
}

class Diff extends BinaryOperator {
  evaluate(): number {
    return this.a.evaluate() - this.b.evaluate();
  }
}

class Multiply extends BinaryOperator {
  evaluate(): number {
    return this.a.evaluate() * this.b.evaluate();
  }
}

class Devide extends BinaryOperator {
  evaluate(): number {
    return this.a.evaluate() / this.b.evaluate();
  }
}

class OperationFactory {
  static create(op: string | number): Operation {
    if (op === undefined || op === null) {
      return new EmptyOperation();
    }
    if (typeof op === 'number') {
      return new Identity(op);
    }
    if (!Number.isNaN(Number.parseFloat(op))) {
      return new Identity(Number.parseFloat(op));
    }
    if (op === '+') {
      return new Sum();
    }
    if (op === '-') {
      return new Diff();
    }
    if (op === '*') {
      return new Multiply();
    }
    if (op === '/') {
      return new Devide();
    }
    return new EmptyOperation();
  }
}

class OperationBuilder {
  private stack = [];

  private constructor() {
    this.stack = [new EmptyOperation()];
  }

  static builder() {
    return new OperationBuilder();
  }

  addOperation(op: string | number): OperationBuilder {
    let current: Operation = this.stack.pop();
    while (current.isValid()) {
      current = this.stack.pop();
    }
    let operation: Operation;
    if (current instanceof EmptyOperation) {
      operation = OperationFactory.create(op);
      this.stack.push(operation);
    } else {
      operation = current.apply(op);
      this.stack.push(current);
      if (!operation.isValid()) {
        this.stack.push(operation);
      }
    }
    return this;
  }

  build(): Operation {
    return this.stack.pop();
  }
}
