import {
  BinaryOperation,
  FunctionExpression, FunctionToken, GroupToken, InfixExpressionTokenizer, MinusToken,
  MultiplyToken, PowToken,
  SumToken,
  TerminalToken,
  TokenAnalyzer,
  TrivialExpression
} from './infixFunctionParser';

describe('Infix Trivial expression {2.35}', () => {
  it(`should numeric expression generate trivial prefix notation'`, () => {
    const expression = new TrivialExpression('2.35');
    const result = expression.toPrefixNotation();
    expect(result).toEqual(['2.35']);
  });

  it('should variable expression generate trivial prefix notation {x}', () => {
    const expression = new TrivialExpression('x');
    const result = expression.toPrefixNotation();
    expect(result).toEqual(['x']);
  });
});

describe('Infix Binary operation', () => {
  it('sum of two trivials expression {a + b}', () => {
    const a = new TrivialExpression('a');
    const b = new TrivialExpression('b');

    const sum = new BinaryOperation('+');
    sum.add(a);
    sum.add(b);
    const result = sum.toPrefixNotation();
    expect(result).toEqual(['+', 'a', 'b']);
  });

  it('sum of expression and trivial {2x + 1}', () => {
    const a = new BinaryOperation('*');
    a.add(new TrivialExpression('2'));
    a.add(new TrivialExpression('x'));

    const b = new TrivialExpression('1');

    const sum = new BinaryOperation('+');
    sum.add(a);
    sum.add(b);
    const result = sum.toPrefixNotation();
    expect(result).toEqual(['+', '*', '2', 'x', '1']);
  });

  it('sum of expression and expression {2x - 3 + y}', () => {
    const two = new TrivialExpression('2');
    const x = new TrivialExpression('x');
    const three = new TrivialExpression('3');
    const y = new TrivialExpression('y');

    const mOp = new BinaryOperation('*');
    mOp.add(two);
    mOp.add(x);

    const minOp = new BinaryOperation('-');
    minOp.add(mOp);
    minOp.add(three);

    const plusOp = new BinaryOperation('+');
    plusOp.add(minOp);
    plusOp.add(y);

    const result = plusOp.toPrefixNotation();
    expect(result).toEqual(['+', '-', '*', '2', 'x', '3', 'y']);
  });
});
describe('Infix Function expression', () => {
  it('function expressions of expression {f(2x + 1)}', () => {
    const two = new TrivialExpression('2');
    const x = new TrivialExpression('x');
    const one = new TrivialExpression('1');

    const mOp = new BinaryOperation('*');
    mOp.add(two);
    mOp.add(x);

    const plusOp = new BinaryOperation('+');
    plusOp.add(mOp);
    plusOp.add(one);

    const func = new FunctionExpression('f');
    func.add(plusOp);

    const result = func.toPrefixNotation();
    expect(result).toEqual(['f', '+', '*', '2', 'x', '1']);
  });
});

describe('tokens to prefix notation transpiler', () => {
  describe('simple expresions', () => {
    it('terminal token {x}', () => {
      const tokens = [new TerminalToken('x')];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['x']);
    });

    it('one sum token {a + b}', () => {
      const tokens = [new TerminalToken('a'), new SumToken(), new TerminalToken('b')];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['+', 'a', 'b']);
    });

    it('tokens with precedences token {a * b - c}', () => {
      const tokens = [new TerminalToken('a'), new MultiplyToken(), new TerminalToken('b'), new MinusToken(), new TerminalToken('c')];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['-', '*', 'a', 'b', 'c']);
    });
  });
  describe('grouping tokens', () => {
    it('grouping tokens {(a + b) * c}', () => {
      const tokens = [new GroupToken([new TerminalToken('a'), new SumToken(), new TerminalToken('b')]), new MultiplyToken(),
        new TerminalToken('c')];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['*', '+', 'a', 'b', 'c']);
    });

    it('grouping tokens more complex {k * (a + b) * c}', () => {
      const tokens = [new TerminalToken('k'), new MultiplyToken(), new GroupToken([new TerminalToken('a'), new SumToken(),
        new TerminalToken('b')]), new MultiplyToken(), new TerminalToken('c')];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['*', 'k', '*', '+', 'a', 'b', 'c']);
    });

    it('subgrouping tokens {((k - p)*(a + b)) ^ c}', () => {
      const tokens = [new GroupToken([
        new GroupToken([
          new TerminalToken('k'), new MinusToken(), new TerminalToken('p')]),
        new MultiplyToken(),
        new GroupToken([
          new TerminalToken('a'), new SumToken(), new TerminalToken('b')
        ])]), new PowToken(), new TerminalToken('c')];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['^', '*', '-', 'k', 'p', '+', 'a', 'b', 'c']);
    });

    it('subgrouping tokens no subgroupping {(k - p)*(a + b) ^ c}', () => {
      const tokens = [
        new GroupToken([
          new TerminalToken('k'), new MinusToken(), new TerminalToken('p')]),
        new MultiplyToken(),
        new GroupToken([
          new TerminalToken('a'), new SumToken(), new TerminalToken('b')
        ]), new PowToken(), new TerminalToken('c')];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['*', '-', 'k', 'p', '^', '+', 'a', 'b', 'c']);
    });
  });
  describe('function tokens', () => {
    it('simple function token {f(x)}', () => {
      const tokens = [new FunctionToken('f', [new TerminalToken('x')])];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['f', 'x']);
    });

    it('complex function token {f(x - 2)}', () => {
      const tokens = [new FunctionToken('f', [new TerminalToken('x'), new MinusToken(), new TerminalToken('2')])];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['f', '-', 'x', '2']);
    });

    it('expression with function token {x * f(x - 2) + g(y)}', () => {
      const tokens = [new TerminalToken('x'), new MultiplyToken(), new FunctionToken('f', [
        new TerminalToken('x'), new MinusToken(), new TerminalToken('2')]),
        new SumToken(), new FunctionToken('g', [new TerminalToken('y')])];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['+', '*', 'x', 'f', '-', 'x', '2', 'g', 'y']);
    });

    it('function with functions token {x * f(g(y) + h(x))}', () => {
      const tokens = [new TerminalToken('x'), new MultiplyToken(), new FunctionToken('f', [
        new FunctionToken('g', [new TerminalToken('y')]), new SumToken(), new FunctionToken('h', [new TerminalToken('z')])])];
      const expression = TokenAnalyzer.analyze(tokens);
      expect(expression.toPrefixNotation()).toEqual(['*', 'x', 'f', '+', 'g', 'y', 'h', 'z']);
    });
  });
});

describe('Tokenizer', () => {
  it('simple number tokenizer { 2.35 }', () => {
    const tokens = InfixExpressionTokenizer.tokenize('2.35');
    expect(tokens.length).toBe(1);
    expect(tokens).toContain(new TerminalToken('2.35'));
  });
});
