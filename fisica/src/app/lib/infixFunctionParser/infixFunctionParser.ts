import * as _ from 'lodash';
const OPERATORS = ['+', '-', '*', '/', '^'];
const FUNCTIONS = ['sin', 'cos'];

export class InfixFunctionParser {
  static parse(func: string): string[] {
    const tokens = InfixExpressionTokenizer.tokenize(func);
    return TokenAnalyzer.analyze(tokens).toPrefixNotation();
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

  static create(operation: string): BinaryOperation {
    if ('+' === operation || '-' === operation) return new BinaryOperation(operation, '0');
    else return new BinaryOperation(operation);
  }

  private constructor(private operator, private indentity: string = '1') { super(); }

  add(expression: Expression) {
    this.expressions[this.index] = expression;
    this.index = (this.index + 1) % 2;
  }

  toPrefixNotation(): string[] {
    if (this.expressions.length === 1) {
      this.expressions.push(this.expressions[0]);
      this.expressions[0] = new TrivialExpression(this.indentity);
    }
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
    return BinaryOperation.create(' ');
  }
}

export class SumToken extends BinaryToken {
  toExpression() {
    return BinaryOperation.create('+');
  }
}

export class MinusToken extends BinaryToken {
  toExpression() {
    return BinaryOperation.create('-');
  }
}

export class MultiplyToken extends BinaryToken {
  toExpression() {
    return BinaryOperation.create('*');
  }
}

export class PowToken extends BinaryToken {
  toExpression() {
    return BinaryOperation.create('^');
  }
}

export class DivisionToken extends BinaryToken {
  toExpression() {
    return BinaryOperation.create('/');
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

enum GroupState {
  S, G, O
}

class ExpressionGroupTokenizer implements ExpressionTokenizer {
  private state = GroupState.S;
  private tokenizer;
  private subGroup: ExpressionTokenizer;
  private tokens: Token[];
  private subCounter = 0;
  constructor() {
    this.tokens = [];
    this.tokenizer = new InfixExpressionTokenizer();
  }

  static supportInitialCharacter(c: string): boolean {
    return '(' === c;
  }

  supportCharacter(c: string): boolean {
    if (GroupState.S === this.state && c === '(') return true;
    if (GroupState.G === this.state && c === ')' && this.subCounter > 1) return true;
    if (GroupState.G === this.state && c === ')' && this.subCounter <= 1) return false;
    if (GroupState.G === this.state && c !== ')') return true;
    if (GroupState.O === this.state) return true;
    return false;
  }

  next(c: string): void {
    const nextState = this.nextState(c);
    if ('(' === c) this.subCounter++;
    if (')' === c) this.subCounter--;
    if (GroupState.G === this.state && nextState === GroupState.G) {
      this.tokenizer.processNext(c);
    }
    if (GroupState.G === this.state && nextState === GroupState.O) {
      this.tokens = _.concat(this.tokens, this.tokenizer.end());
      this.tokenizer = new InfixExpressionTokenizer();
      this.subGroup = new ExpressionGroupTokenizer();
      this.subGroup.next(c);
    }
    if (GroupState.O === this.state && nextState === GroupState.O) {
      this.subGroup.next(c);
    }

    if (GroupState.O === this.state && nextState === GroupState.G) {
      this.tokens.push(this.subGroup.generate());
      this.state = nextState;
      this.subGroup = undefined;
    } else {
      this.state = nextState;
    }

  }

  private nextState(c: string): GroupState {
    if (GroupState.S === this.state && c === '(') return GroupState.G;
    if (GroupState.G === this.state && c === ')' && this.subCounter === 2) return GroupState.G;
    if (GroupState.G === this.state && c === ')' && this.subCounter > 2) return this.state;
    if (GroupState.G === this.state && c === ')' && this.subCounter < 2) throw new Error('El grupo no soporta el caracter ")"');
    if (GroupState.G === this.state && c === '(' && !this.tokenizer.hasFunctionExpression()) return GroupState.O;
    if (GroupState.O === this.state && this.subGroup.supportCharacter(c)) return this.state;
    if (GroupState.O === this.state && !this.subGroup.supportCharacter(c)) return GroupState.G;
    else return this.state;
  }

  generate(): Token {
    this.tokens = _.concat(this.tokens, this.tokenizer.end());
    return new GroupToken(this.tokens);
  }

  get generatedTokens() {
    return _.clone(this.tokens);
  }
}

enum FunctionState {
  S, V, G
}
class FunctionTokenizer implements ExpressionTokenizer {
  private name;
  private state = FunctionState.S;
  private group: ExpressionGroupTokenizer;
  constructor() { this.name = ''; }

  static supportInitialCharacter(c: string): boolean {
    return FunctionTokenizer.supportNextName(c);
  }

  private static supportNextName(name: string): boolean {
    return _.some(FUNCTIONS, func => _.startsWith(func, name));
  }

  generate(): Token {
    this.group.generate();
    const groupTokens = this.group.generatedTokens;
    return new FunctionToken(this.name, groupTokens);
  }

  supportCharacter(c: string): boolean {
    if (this.state === FunctionState.S) return FunctionTokenizer.supportInitialCharacter(c);
    if (this.state === FunctionState.V && (('(' === c && this.supportCompleteName()) || FunctionTokenizer.supportNextName(this.name + c))) {
      return true;
    }
    if (this.state === FunctionState.G) return this.group.supportCharacter(c);
    return false;
  }

  next(c: string): void {
    const nextState = this.nextState(c);
    if (this.state === FunctionState.S || (this.state === FunctionState.V && nextState === FunctionState.V)) this.name += c;
    if (this.state === FunctionState.V && nextState === FunctionState.G) {
      this.group = new ExpressionGroupTokenizer();
      this.group.next(c);
    }
    if (this.state === FunctionState.G) {
      this.group.next(c);
    }
    this.state = nextState;
  }

  private supportCompleteName(): boolean {
    return _.some(FUNCTIONS, (func) => func.toLowerCase() === this.name.toLowerCase());
  }

  private nextState(c: string): FunctionState {
    if (this.state === FunctionState.S && FunctionTokenizer.supportInitialCharacter(c)) return FunctionState.V;
    if (this.state === FunctionState.V && FunctionTokenizer.supportNextName(this.name + c)) return FunctionState.V;
    if (this.state === FunctionState.V && '(' === c && this.supportCompleteName()) return FunctionState.G;
    if (this.state === FunctionState.G && this.group.supportCharacter(c)) return this.state;
    throw new Error('Function: estado invalido');
  }
}

export class InfixExpressionTokenizer {
  private currentExpressionTokenizers: ExpressionTokenizer[];
  private tokens: Token[] = [];

  static addMultipliers(expression): string {
    if (typeof expression !== 'string') return '(' + _.reduce(expression, (exp, item) => {
      if (this.shouldAddMultiplier(exp, item)) {
        exp += '*';
      }
      return exp + this.addMultipliers(item);
    }, '') + ')';
    const list = this.splitGroups(expression);
    let last;
    let lastChar;
    let finalExp = '';
    for (const item of list) {
      if (this.shouldAddMultiplier(finalExp, item)) {
        finalExp += '*';
      }
      if (typeof item === 'string') {
        finalExp = _.reduce(item, (exp, c) => {
          last = _.filter(last, e => e.supportCharacter(c));
          if (_.isEmpty(last)) {
            if (lastChar && !_.includes(OPERATORS, lastChar) && lastChar !== '(' && c !== ' ' && !_.includes(OPERATORS, c) && c !== ')') {
              exp += '*';
            }
            last = InfixExpressionTokenizer.selectNewTokenizers(c);
          }
          _.each(last, ex => ex.next(c));
          if (' ' !== c) lastChar = c;
          return exp + c;
        }, finalExp);
      } else {
        finalExp += '(' + _.reduce(item, (fExp, exp) => {
          if (this.shouldAddMultiplier(fExp, exp)) {
            fExp += '*';
          }
          return fExp + this.addMultipliers(exp);
        }, '') + ')';
      }
    }
    return finalExp;
  }

  private static shouldAddMultiplier(exp, currentExp): boolean {
    return(!_.isEmpty(exp)
      && !_.some(OPERATORS, op => _.endsWith(exp.trim(), op))
      && !_.some(FUNCTIONS, func => _.endsWith(exp, func))
      && !_.some(OPERATORS, op => typeof currentExp === 'string' && _.startsWith(currentExp.trim(), op)));
  }

  private static splitGroups(expression: string): string[] {
    let ignore = 0;
    let current = '';
    const list = [];
    for (let i = 0; i < expression.length; i++) {
      const c = expression[i];
      if (c === '(') {
        if (!ignore) {
          if (current.length > 0) list.push(current);
          list.push(this.splitGroups(expression.substring(i + 1)));
          current = '';
        }
        ignore++;
      } else if (c === ')') {
        ignore--;
        if (ignore <= 0) {
          if (current.length > 0) list.push(current);
          current = '';
          if (ignore < 0) return list;
        }
      } else {
        if (!ignore) current += c;
      }
    }
    if (current.length > 0) list.push(current);
    return list;
  }

  static tokenize(expression: string): Token[] {
    const tokenizer = new InfixExpressionTokenizer(expression);
    return tokenizer.process();
  }

  static selectNewTokenizers(c: string, ignore: any[] = []): ExpressionTokenizer[] {
    const tokenizers = [];
    if (ExpressionNumberTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionNumberTokenizer());
    if (ExpressionVarTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionVarTokenizer());
    if (ExpressionSumTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionSumTokenizer());
    if (ExpressionMinusTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionMinusTokenizer());
    if (ExpressionMultiplyTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionMultiplyTokenizer());
    if (ExpressionDivideTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionDivideTokenizer());
    if (ExpressionPowTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionPowTokenizer());
    if (FunctionTokenizer.supportInitialCharacter(c)) tokenizers.push(new FunctionTokenizer());
    if (ExpressionGroupTokenizer.supportInitialCharacter(c)) tokenizers.push(new ExpressionGroupTokenizer());
    return tokenizers;
  }

  constructor(private expression: string = '') {}

  processNext(c: string): void {
    if (_.isEmpty(this.currentExpressionTokenizers)) this.currentExpressionTokenizers = InfixExpressionTokenizer.selectNewTokenizers(c);
    const old = _.clone(this.currentExpressionTokenizers);
    this.currentExpressionTokenizers = _.filter(this.currentExpressionTokenizers, (t) => t.supportCharacter(c));
    if (_.isEmpty(this.currentExpressionTokenizers) && !_.isEmpty(old)) {
      this.tokens.push(_.first(old).generate());
      this.currentExpressionTokenizers = InfixExpressionTokenizer.selectNewTokenizers(c);
      if (!_.isEmpty(this.currentExpressionTokenizers)) _.each(this.currentExpressionTokenizers, (tokenizer) => tokenizer.next(c));
    } else {
      _.each(this.currentExpressionTokenizers, (tokenizer) => tokenizer.next(c));
    }
  }

  end(): Token[] {
    if (!_.isEmpty(this.currentExpressionTokenizers)) this.tokens.push(_.first(this.currentExpressionTokenizers).generate());
    return this.tokens;
  }

  hasFunctionExpression(): boolean {
    return _.some(this.currentExpressionTokenizers, (ex) => ex instanceof FunctionTokenizer);
  }

  private process(): Token[] {
    this.expression = InfixExpressionTokenizer.addMultipliers(this.expression);
    _.each(this.expression, c => {
      this.processNext(c);
    });
    if (!_.isEmpty(this.currentExpressionTokenizers)) this.tokens.push(_.first(this.currentExpressionTokenizers).generate());
    return this.tokens;
  }
}

