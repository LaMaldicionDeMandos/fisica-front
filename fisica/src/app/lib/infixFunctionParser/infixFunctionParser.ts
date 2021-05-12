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

export class TrivialExpression implements Expression {
  constructor(private expression) {}

  toPrefixNotation(): string[] {
    return [this.expression];
  }
}

export class BinaryOperation implements Expression {
  private expressions: Expression[] = [];
  private index = 0;

  constructor(private operator) {}

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

export class FunctionExpression implements Expression {
  private expression: Expression;

  constructor(private functionName) {}

  add(expression: Expression) {
    this.expression = expression;
  }

  toPrefixNotation(): string[] {
    return _.concat([this.functionName], this.expression.toPrefixNotation());
  }
}

export interface Token {
  toExpression(): Expression;
  analyze(tokens: Token[], index): Expression;
}

export class TerminalToken implements Token {
  constructor(private token: string) {}

  toExpression(): Expression {
    return new TrivialExpression(this.token);
  }

  analyze(tokens: Token[], index): Expression {
    return this.toExpression();
  }
}

class BinaryToken implements Token {
  analyze(tokens: Token[], index): Expression {
    if (index === 0 && tokens.length === 1) return tokens[0].toExpression();
    const exp: BinaryOperation = this.toExpression() as BinaryOperation;
    const left = TokenAnalyzer.analyze(_.slice(tokens, 0, index));
    const right = TokenAnalyzer.analyze(_.slice(tokens, index + 1));
    exp.add(left);
    exp.add(right);
    return exp;
  }
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

export class DivisionToken extends BinaryToken {
  toExpression() {
    return new BinaryOperation('/');
  }
}

export class GroupOpenToken implements Token {
  constructor() {}

  toExpression(): Expression {
    throw new Error('Operacion no permitida');
  }

  analyze(tokens: Token[], index): Expression {
    return undefined;
  }
}

export class GroupCloseToken implements Token {
  constructor() {}

  toExpression(): Expression {
    throw new Error('Operacion no permitida');
  }

  analyze(tokens: Token[], index): Expression {
    return undefined;
  }
}

const PRECEDENCES = [GroupOpenToken, SumToken, MinusToken, MultiplyToken, DivisionToken, TerminalToken, GroupCloseToken];

export class TokenAnalyzer {
  static analyze(tokens: Token[]): Expression {
    const precedenceIndex = TokenAnalyzer.findPrecedenceIndex(tokens);
    const token = tokens[precedenceIndex];
    return token.analyze(tokens, precedenceIndex);
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
}
