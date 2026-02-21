import { describe, it, expect, test } from 'vitest';
import { isRawElement } from 'tsprose';

import {
  inlinerMathSchema,
  M,
  tryTextInlinerMath,
  type InlinerMathSchema,
} from '@src/elements/math/inliner';
import { asEruditRaw } from '@src/rawElement';

describe('tryTextInlinerMath', () => {
  it('should tokenize simple expressions', () => {
    const result = tryTextInlinerMath('a + b = c');
    expect(result).toEqual({
      type: 'text',
      tokens: [
        { type: 'word', value: 'a' },
        { type: 'other', value: ' + ' },
        { type: 'word', value: 'b' },
        { type: 'other', value: ' = ' },
        { type: 'word', value: 'c' },
      ],
    });
  });

  it('should tokenize expressions with numbers', () => {
    const result = tryTextInlinerMath('2x + 3y = 10');
    expect(result).toEqual({
      type: 'text',
      tokens: [
        { type: 'other', value: '2' },
        { type: 'word', value: 'x' },
        { type: 'other', value: ' + 3' },
        { type: 'word', value: 'y' },
        { type: 'other', value: ' = 10' },
      ],
    });
  });

  it('should tokenize expressions with words', () => {
    const result = tryTextInlinerMath('abc + (def) = ghi');
    expect(result).toEqual({
      type: 'text',
      tokens: [
        { type: 'word', value: 'abc' },
        { type: 'other', value: ' + (' },
        { type: 'word', value: 'def' },
        { type: 'other', value: ') = ' },
        { type: 'word', value: 'ghi' },
      ],
    });
  });

  it('should tokenize expressions with special math symbols', () => {
    const result = tryTextInlinerMath('a * b / c - d');
    expect(result).toEqual({
      type: 'text',
      tokens: [
        { type: 'word', value: 'a' },
        { type: 'other', value: ' * ' },
        { type: 'word', value: 'b' },
        { type: 'other', value: ' / ' },
        { type: 'word', value: 'c' },
        { type: 'other', value: ' – ' },
        { type: 'word', value: 'd' },
      ],
    });
  });

  it('should return undefined for expressions with complex symbols: ^', () => {
    const result = tryTextInlinerMath('a^2 + b^2 = c^2');
    expect(result).toBeUndefined();
  });

  it('should return undefined for expressions with complex symbols: {', () => {
    const result = tryTextInlinerMath('{x');
    expect(result).toBeUndefined();
  });

  it('should return undefined for expressions with complex symbols: }', () => {
    const result = tryTextInlinerMath('x}');
    expect(result).toBeUndefined();
  });

  it('should return undefined for expressions with complex symbols: _', () => {
    const result = tryTextInlinerMath('a_1 + a_2');
    expect(result).toBeUndefined();
  });

  it('should return undefined for expressions with complex symbols: \\', () => {
    const result = tryTextInlinerMath('\\alpha + \\beta');
    expect(result).toBeUndefined();
  });

  it('should tokenize expressions with unicode characters', () => {
    const result = tryTextInlinerMath('α + β = γ');
    expect(result).toEqual({
      type: 'text',
      tokens: [
        { type: 'word', value: 'α' },
        { type: 'other', value: ' + ' },
        { type: 'word', value: 'β' },
        { type: 'other', value: ' = ' },
        { type: 'word', value: 'γ' },
      ],
    });
  });

  describe('should prettify math strings before tokenization', () => {
    test.each([
      // No spaces
      ['a-b', 'a – b'],
      ['a+b', 'a + b'],
      ['a=b', 'a = b'],
      // Redundant spaces
      ['a  -  b', 'a – b'],
      ['a  +  b', 'a + b'],
      ['a  =  b', 'a = b'],
      // Brackets
      ['n+(k+1)', 'n + (k + 1)'],
      ['n+[k+1]', 'n + [k + 1]'],
      // Unary operators
      ['-a', '–a'],
      ['+2', '+2'],
    ])('should handle %s', (input, expected) => {
      const result = tryTextInlinerMath(input);
      expect(result?.tokens.map((token) => token.value).join('')).toEqual(
        expected,
      );
    });
  });
});

describe('Inliner Math', () => {
  it('should create inliner math correctly', () => {
    const inlinerMath = asEruditRaw<InlinerMathSchema>(<M>A + b</M>);

    expect(isRawElement(inlinerMath, inlinerMathSchema)).toBe(true);
    expect(inlinerMath.data).toBe('A + b');
    expect(inlinerMath.storageKey).toBe('$ A + b $');
  });

  it('should throw when empty math expression is provided', () => {
    expect(() => asEruditRaw(<M> </M>)).toThrow();
  });
});
