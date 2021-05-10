import * as _ from 'lodash';

export interface Operation {
  apply(op: string | number): Operation;
  evaluate(vars?: any): number;
  isValid(): boolean;
}

class EmptyOperation implements Operation {
  constructor() {}

  apply(op: string | number): Operation {
    return OperationFactory.create(op);
  }

  evaluate(vars?: any): number {
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

  evaluate(vars?: any): number {
    return this.param;
  }

  isValid(): boolean {
    return true;
  }
}

class Variable implements Operation {
  constructor(private param: string) {}

  apply(op: string | number): Operation {
    const operation: Operation = OperationFactory.create(op);
    return (operation instanceof Variable) ? operation : operation.apply(this.evaluate());
  }

  evaluate(vars?: any): number {
    return vars[this.param];
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

  evaluate(vars?: any): number {
    return 0;
  }

  isValid(): boolean {
    return (!_.isNil(this.a) || this.a instanceof EmptyOperation) && (!_.isNil(this.b) || this.b instanceof EmptyOperation);
  }
}

class Sum extends BinaryOperator {
  evaluate(vars?: any): number {
    return this.a.evaluate(vars) + this.b.evaluate(vars);
  }
}

class Diff extends BinaryOperator {
  evaluate(vars?: any): number {
    return this.a.evaluate(vars) - this.b.evaluate(vars);
  }
}

class Multiply extends BinaryOperator {
  evaluate(vars?: any): number {
    return this.a.evaluate(vars) * this.b.evaluate(vars);
  }
}

class Devide extends BinaryOperator {
  evaluate(vars?: any): number {
    return this.a.evaluate(vars) / this.b.evaluate(vars);
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
    return new Variable(op);
  }
}

export class OperationBuilder {
  private stack = [];

  private constructor() {
    this.stack = [new EmptyOperation()];
  }

  static builder() {
    return new OperationBuilder();
  }

  static fromPrefixArray(array) {
    return _.reduce(array, (b, op) =>  b.addOperation(op), new OperationBuilder());
  }

  static fromPrefixFunction(func) {
    return OperationBuilder.fromPrefixArray(_.words(func, /[^ ]+/g));
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
    return _.first(this.stack);
  }
}
