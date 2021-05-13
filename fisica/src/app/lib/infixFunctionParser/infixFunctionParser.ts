import * as _ from 'lodash';
const OPERATORS = ['+', '-', '*', '/', '^'];

export class InfixFunctionParser {
  static parse(func: string): string[] {
    return [];
  }
}

interface Expression {
  toPrefixNotation(): string[];
}

class ExpressionAbstract implements Expression {
  toPrefixNotation(): string[] {
    return [];
  }
}

export class TrivialExpression extends ExpressionAbstract {
  constructor(private expression) { super(); }

  toPrefixNotation(): string[] {
    return [this.expression];
  }
}

export class BinaryOperation extends ExpressionAbstract {
  private expressions: Expression[] = [];
  private index = 0;

  constructor(private operator) { super(); }

  add(expression: Expression) {
    this.expressions[this.index] = expression;
    this.index = (this.index + 1) % 2;
  }

  toPrefixNotation(): string[] {
    const left = this.expressions[0].toPrefixNotation();
    const right = this.expressions[1].toPrefixNotation();
    return _.concat([this.operator], left, right);
  }
}

export class FunctionExpression extends ExpressionAbstract {
  private expression: Expression;

  constructor(private functionName) { super(); }

  add(expression: Expression) {
    this.expression = expression;
  }

  toPrefixNotation(): string[] {
    return _.concat([this.functionName], this.expression.toPrefixNotation());
  }
}

export interface Token {
  toExpression(): Expression;
}

export class TerminalToken implements Token {
  constructor(private token: string) {}

  toExpression(): Expression {
    return new TrivialExpression(this.token);
  }
}

class BinaryToken implements Token {
  toExpression(): Expression {
    return new BinaryOperation(' ');
  }
}

export class SumToken extends BinaryToken {
  toExpression() {
    return new BinaryOperation('+');
  }
}

export class MinusToken extends BinaryToken {
  toExpression() {
    return new BinaryOperation('-');
  }
}

export class MultiplyToken extends BinaryToken {
  toExpression() {
    return new BinaryOperation('*');
  }
}

export class PowToken extends BinaryToken {
  toExpression() {
    return new BinaryOperation('^');
  }
}

export class DivisionToken extends BinaryToken {
  toExpression() {
    return new BinaryOperation('/');
  }
}

export class GroupToken implements Token {
  constructor(private tokens: Token[]) {}

  toExpression(): Expression {
    return TokenAnalyzer.analyze(this.tokens);
  }
}

const PRECEDENCES = [SumToken, MinusToken, MultiplyToken, DivisionToken, PowToken, GroupToken, TerminalToken];

export class TokenAnalyzer {
  static analyze(tokens: Token[]): Expression {
    const precedenceIndex = TokenAnalyzer.findPrecedenceIndex(tokens);
    const token = tokens[precedenceIndex];
    const strategy = this.selectStrategy(token, precedenceIndex);
    const result = strategy(tokens, precedenceIndex);
    const expression = result.expression;
    _.each(result.toAdd, (tks) => expression.add(this.analyze(tks)));
    return expression;
  }

  private static findPrecedenceIndex(tokens: Token[]): number {
    let minIndex = Number.MAX_VALUE;
    let index = 0;
    for (let i = 0; i < tokens.length; i++) {
      const preIndex = TokenAnalyzer.precedenceIndex(tokens[i]);
      if (preIndex === 0) return i;
      if (preIndex < minIndex) {
        minIndex = preIndex;
        index = i;
      }
    }
    return index;
  }

  private static precedenceIndex(token): number {
    for (let i = 0; i < PRECEDENCES.length; i++) {
      if (token instanceof PRECEDENCES[i]) return i;
    }
    return Number.MAX_VALUE;
  }

  private static selectStrategy(token: Token, index: number): (tokens: Token[], index: number) => any  {
    if (token instanceof BinaryToken) return this.binaryStrategy;
    return this.terminalStrategy;
  }

  private static binaryStrategy = (tokens: Token[], index): any => {
    const exp: BinaryOperation = tokens[index].toExpression() as BinaryOperation;
    const left = _.slice(tokens, 0, index);
    const right = _.slice(tokens, index + 1);
    return {
      expression: exp,
      toAdd: [left, right]
    };
  }

  private static terminalStrategy = (tokens: Token[], index): any => {
    return {
      expression: tokens[index].toExpression(),
      toAdd: []
    };
  }
}
