import * as _ from 'lodash';
const OPERATORS = ['+', '-', '*', '/', '^'];
const FUNCTIONS = ['sin', 'cos'];

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

export class FunctionToken implements Token {
  constructor(private name: string, private tokens: Token[]) {}
  toExpression(): Expression {
    const exp = TokenAnalyzer.analyze(this.tokens);
    const expression = new FunctionExpression(this.name);
    expression.add(exp);
    return expression;
  }
}

const PRECEDENCES = [SumToken, MinusToken, MultiplyToken, DivisionToken, PowToken, GroupToken, FunctionToken, TerminalToken];

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

interface ExpressionTokenizer {
  supportCharacter(c: string): boolean;
  generate(): Token;
  next(c: string): void;
}

const NUMBER_REGEX = /\d/;
enum NumberState {
  S, N, NDOT, NDOTN
}
class ExpressionNumberTokenizer implements ExpressionTokenizer {
  private number: string;
  private state = NumberState.S;

  constructor() {
    this.number = '';
  }

  static supportInitialCharacter(c: string): boolean {
    return NUMBER_REGEX.test(c);
  }

  supportCharacter(c: string): boolean {
    return ('.' === c && this.state === NumberState.N) ||  NUMBER_REGEX.test(c);
  }

  next(c: string): void {
    this.state = this.nextState(c);
    this.number += c;
  }

  private nextState(c: string): NumberState {
    const isNumber = NUMBER_REGEX.test(c);
    if (this.state === NumberState.S && isNumber) return NumberState.N;
    if (this.state === NumberState.N && isNumber) return NumberState.N;
    if (this.state === NumberState.N && '.' === c) return NumberState.NDOT;
    if (this.state === NumberState.NDOT && isNumber) return NumberState.NDOTN;
    if (this.state === NumberState.NDOTN && isNumber) return NumberState.NDOTN;
    throw new Error(`ExpressionNumberTokenizer error: caracter ${c} no valido.`);
  }

  generate(): Token {
    return new TerminalToken(this.number);
  }
}

const INIT_VAR_REGEX = /[a-zA-Z_]/;
const VAR_REGEX = /[a-zA-Z_0-9]/;
enum VarState {
  S, V
}
class ExpressionVarTokenizer implements ExpressionTokenizer {
  private v: string;
  private state = VarState.S;

  constructor() {
    this.v = '';
  }

  static supportInitialCharacter(c: string): boolean {
    return INIT_VAR_REGEX.test(c);
  }

  supportCharacter(c: string): boolean {
    return VAR_REGEX.test(c);
  }

  next(c: string): void {
    this.state = this.nextState(c);
    this.v += c;
  }

  private nextState(c: string): VarState {
    const isValid = VAR_REGEX.test(c);
    if (this.state === VarState.S && INIT_VAR_REGEX.test(c)) return VarState.V;
    if (isValid) return VarState.V;
    throw new Error(`ExpressionNumberTokenizer error: caracter ${c} no valido.`);
  }

  generate(): Token {
    return new TerminalToken(this.v);
  }
}

class ExpressionBinaryTokenizer implements ExpressionTokenizer {
  private isInitialized;
  constructor(private token: string) {}

  supportCharacter(c: string): boolean {
    return this.token === c && !this.isInitialized;
  }

  next(c: string): void {
    this.isInitialized = true;
  }

  generate(): Token {
    return undefined;
  }
}

class ExpressionSumTokenizer extends ExpressionBinaryTokenizer {

  constructor() { super('+'); }

  static supportInitialCharacter(c: string): boolean {
    return '+' === c;
  }

  generate(): Token {
    return new SumToken();
  }
}

class ExpressionMinusTokenizer extends ExpressionBinaryTokenizer {

  constructor() { super('-'); }

  static supportInitialCharacter(c: string): boolean {
    return '-' === c;
  }

  generate(): Token {
    return new MinusToken();
  }
}

class ExpressionMultiplyTokenizer extends ExpressionBinaryTokenizer {

  constructor() { super('*'); }

  static supportInitialCharacter(c: string): boolean {
    return '*' === c;
  }

  generate(): Token {
    return new MultiplyToken();
  }
}

class ExpressionDivideTokenizer extends ExpressionBinaryTokenizer {

  constructor() { super('/'); }

  static supportInitialCharacter(c: string): boolean {
    return '/' === c;
  }

  generate(): Token {
    return new DivisionToken();
  }
}

class ExpressionPowTokenizer extends ExpressionBinaryTokenizer {

  constructor() { super('^'); }

  static supportInitialCharacter(c: string): boolean {
    return '^' === c;
  }

  generate(): Token {
    return new PowToken();
  }
}

export class InfixExpressionTokenizer {
  private currentExpressionTokenizers: ExpressionTokenizer[];

  static tokenize(expression: string): Token[] {
    const tokenizer = new InfixExpressionTokenizer(expression);
    return tokenizer.process();
  }

  static selectNewTokenizers(c: string): ExpressionTokenizer[] {
    const tokenizers = [];
    if (ExpressionNumberTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionNumberTokenizer());
    if (ExpressionVarTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionVarTokenizer());
    if (ExpressionSumTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionSumTokenizer());
    if (ExpressionMinusTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionMinusTokenizer());
    if (ExpressionMultiplyTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionMultiplyTokenizer());
    if (ExpressionDivideTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionDivideTokenizer());
    if (ExpressionPowTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionPowTokenizer());
    return tokenizers;
  }

  constructor(private expression: string) {}

  private process(): Token[] {
    const tokens = [];
    _.each(this.expression, c => {
      if (_.isEmpty(this.currentExpressionTokenizers)) this.currentExpressionTokenizers = InfixExpressionTokenizer.selectNewTokenizers(c);
      const old = _.clone(this.currentExpressionTokenizers);
      _.each(this.currentExpressionTokenizers, tokenizer => {
        if (!tokenizer.supportCharacter(c)) _.remove(this.currentExpressionTokenizers, (t) => tokenizer === t);
      });
      if (_.isEmpty(this.currentExpressionTokenizers) && !_.isEmpty(old)) {
        tokens.push(_.first(old).generate());
        this.currentExpressionTokenizers = InfixExpressionTokenizer.selectNewTokenizers(c);
        if (!_.isEmpty(this.currentExpressionTokenizers)) _.each(this.currentExpressionTokenizers, (tokenizer) => tokenizer.next(c));
      } else {
        _.each(this.currentExpressionTokenizers, (tokenizer) => tokenizer.next(c));
      }
    });
    if (!_.isEmpty(this.currentExpressionTokenizers)) tokens.push(_.first(this.currentExpressionTokenizers).generate());
    return tokens;
  }
}

