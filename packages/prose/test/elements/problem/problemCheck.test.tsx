import { describe, expect, it, vi } from 'vitest';
import type { ToRawElement } from 'tsprose';
import {
  createProblemCheckObject,
  defineProblemCheck,
  defineProblemChecker,
} from '@erudit-js/core/problemCheck';

import {
  toSerializableValidator,
  checkProblemAnswer,
  fromSerializableValidator,
  problemCheckSchema,
  ProblemCheck,
  type ProblemCheckValidator,
  type ProblemCheckSchema,
  type ProblemCheckers,
  type ProblemCheckObject,
  type ProblemCheckContext,
} from '@src/elements/problem/problemCheck';

const check = (
  answer: string,
  against: ProblemCheckValidator | ProblemCheckObject,
  context?: Partial<ProblemCheckContext>,
) => {
  const defaultContext: ProblemCheckContext = {
    yesRegexp: /^(yes|y|true|t|1)$/i,
    noRegexp: /^(no|n|false|f|0)$/i,
    checkers: {},
  };
  return checkProblemAnswer(answer, against, { ...defaultContext, ...context });
};

describe('<ProblemCheck>', () => {
  it('should throw on non-check children', () => {
    expect(() => <ProblemCheck yes> </ProblemCheck>).toThrow();
  });

  it('should fill info and serialized validator for root check and nested check correctly', () => {
    const rootCheck = (
      <ProblemCheck label="Root label" yes>
        <ProblemCheck
          hint="Nested label"
          answers={{
            ordered: false,
            separator: '|',
            values: ['a', ['b', /\d+/i], 42],
          }}
        />
      </ProblemCheck>
    ) as ToRawElement<ProblemCheckSchema>;

    const childrenCheck = rootCheck
      .children![0] as ToRawElement<ProblemCheckSchema>;

    expect(rootCheck.data).toEqual({
      label: 'Root label',
      hint: undefined,
      placeholder: undefined,
      serializedValidator: {
        type: 'boolean',
        answer: true,
      },
    });

    expect(childrenCheck.data).toEqual({
      label: undefined,
      hint: 'Nested label',
      placeholder: undefined,
      serializedValidator: {
        type: 'array',
        ordered: false,
        separator: '|',
        answers: [
          'a',
          ['b', { type: 'regexp', source: '\\d+', flags: 'i' }],
          42,
        ],
      },
    });
  });
});

describe('ProblemCheckData serialization', () => {
  it('should serialize and deserialize boolean data correctly', () => {
    const data: ProblemCheckValidator = { type: 'boolean', answer: true };
    expect(
      fromSerializableValidator(toSerializableValidator(data)),
    ).toStrictEqual(data);
  });

  it('should serialize and deserialize value data correctly', () => {
    const regexpData: ProblemCheckValidator = {
      type: 'value',
      answer: /test/i,
    };
    expect(
      fromSerializableValidator(toSerializableValidator(regexpData)),
    ).toStrictEqual(regexpData);

    const undefinedData: ProblemCheckValidator = {
      type: 'value',
      answer: undefined,
    };
    expect(
      fromSerializableValidator(toSerializableValidator(undefinedData)),
    ).toStrictEqual(undefinedData);
  });

  it('should serialize and deserialize array data correctly', () => {
    const arrayData: ProblemCheckValidator = {
      type: 'array',
      ordered: true,
      separator: ',',
      answers: ['answer1', 0, 55, ['answer2', /regex/i]],
    };
    expect(
      fromSerializableValidator(toSerializableValidator(arrayData)),
    ).toStrictEqual(arrayData);
  });
});

describe('checkProblemAnswer', () => {
  describe('boolean type', () => {
    it('should return true when answer matches yes pattern for true answer', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'boolean',
        answer: true,
      };
      expect(await check('yes', checkData)).toBe(true);
      expect(await check('y', checkData)).toBe(true);
      expect(await check('TRUE', checkData)).toBe(true);
      expect(await check('1', checkData)).toBe(true);
    });

    it('should return false when answer does not match yes pattern for true answer', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'boolean',
        answer: true,
      };
      expect(await check('no', checkData)).toBe(false);
      expect(await check('maybe', checkData)).toBe(false);
      expect(await check('', checkData)).toBe(false);
    });

    it('should return true when answer matches no pattern for false answer', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'boolean',
        answer: false,
      };
      expect(await check('no', checkData)).toBe(true);
      expect(await check('n', checkData)).toBe(true);
      expect(await check('FALSE', checkData)).toBe(true);
      expect(await check('0', checkData)).toBe(true);
    });

    it('should return false when answer does not match no pattern for false answer', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'boolean',
        answer: false,
      };
      expect(await check('yes', checkData)).toBe(false);
      expect(await check('maybe', checkData)).toBe(false);
    });
  });

  describe('value type', () => {
    it('should match string values exactly', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'value',
        answer: 'hello',
      };
      expect(await check('hello', checkData)).toBe(true);
      expect(await check('Hello', checkData)).toBe(false);
      expect(await check('hello ', checkData)).toBe(false);
    });

    it('should match number values', async () => {
      const checkData: ProblemCheckValidator = { type: 'value', answer: 42 };
      expect(await check('42', checkData)).toBe(true);
      expect(await check('42.0', checkData)).toBe(true);
      expect(await check('43', checkData)).toBe(false);
      expect(await check('forty-two', checkData)).toBe(false);

      const negativeFloatCheckData: ProblemCheckValidator = {
        type: 'value',
        answer: -3.14,
      };
      expect(await check('-3.14', negativeFloatCheckData)).toBe(true);
      expect(await check('-3.140', negativeFloatCheckData)).toBe(true);
      expect(await check('-3.15', negativeFloatCheckData)).toBe(false);
    });

    it('should match using RegExp', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'value',
        answer: /^test\d+$/i,
      };
      expect(await check('test123', checkData)).toBe(true);
      expect(await check('TEST456', checkData)).toBe(true);
      expect(await check('test', checkData)).toBe(false);
      expect(await check('testing123', checkData)).toBe(false);
    });

    it('should match undefined (empty string)', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'value',
        answer: undefined,
      };
      expect(await check('', checkData)).toBe(true);
      expect(await check('   ', checkData)).toBe(true);
      expect(await check('something', checkData)).toBe(false);
    });

    it('should match any-of alternatives', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'value',
        answer: ['a', 42, /^test$/, undefined],
      };
      expect(await check('a', checkData)).toBe(true);
      expect(await check('42', checkData)).toBe(true);
      expect(await check('test', checkData)).toBe(true);
      expect(await check('  ', checkData)).toBe(true);
      expect(await check('b', checkData)).toBe(false);
    });
  });

  describe('array type - ordered', () => {
    it('should match ordered array with exact values', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(await check('a,b,c', checkData)).toBe(true);
      expect(await check('a, b, c', checkData)).toBe(true);
      expect(await check('a , b , c', checkData)).toBe(true);
    });

    it('should reject ordered array with wrong order', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(await check('b,a,c', checkData)).toBe(false);
      expect(await check('c,b,a', checkData)).toBe(false);
    });

    it('should reject ordered array with wrong length', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(await check('a,b', checkData)).toBe(false);
      expect(await check('a,b,c,d', checkData)).toBe(false);
      expect(await check('', checkData)).toBe(false);
    });

    it('should match ordered array with numbers', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: [1, 2, 3],
      };
      expect(await check('1,2,3', checkData)).toBe(true);
      expect(await check('1, 2, 3', checkData)).toBe(true);
    });

    it('should match ordered array with regex patterns', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: [/^test\d+$/, /^[a-z]+$/i, 'exact'],
      };
      expect(await check('test123, hello, exact', checkData)).toBe(true);
      expect(await check('test456, WORLD, exact', checkData)).toBe(true);
      expect(await check('test, hello, exact', checkData)).toBe(false);
    });

    it('should match ordered array with any-of alternatives', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: ['a', ['b', 'B'], 'c'],
      };
      expect(await check('a,b,c', checkData)).toBe(true);
      expect(await check('a,B,c', checkData)).toBe(true);
      expect(await check('a,d,c', checkData)).toBe(false);
    });

    it('should handle different separators', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ';',
        answers: ['a', 'b', 'c'],
      };
      expect(await check('a;b;c', checkData)).toBe(true);
      expect(await check('a; b; c', checkData)).toBe(true);
      expect(await check('a,b,c', checkData)).toBe(false);
    });

    it('should handle special characters in separator', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: '|',
        answers: ['a', 'b', 'c'],
      };
      expect(await check('a|b|c', checkData)).toBe(true);
    });
  });

  describe('array type - unordered', () => {
    it('should match unordered array regardless of order', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(await check('a,b,c', checkData)).toBe(true);
      expect(await check('b,a,c', checkData)).toBe(true);
      expect(await check('c,b,a', checkData)).toBe(true);
      expect(await check('b,c,a', checkData)).toBe(true);
    });

    it('should reject unordered array with extra elements', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(await check('a,b,c,d', checkData)).toBe(false);
      expect(await check('a,b,c,c', checkData)).toBe(false);
    });

    it('should reject unordered array with missing elements', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(await check('a,b', checkData)).toBe(false);
      expect(await check('a,b,d', checkData)).toBe(false);
    });

    it('should handle duplicates in unordered array correctly', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: ['a', 'a', 'b'],
      };
      expect(await check('a,a,b', checkData)).toBe(true);
      expect(await check('a,b,a', checkData)).toBe(true);
      expect(await check('a,b', checkData)).toBe(false);
    });

    it('should match unordered array with any-of alternatives', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: ['a', ['b', 'B'], 'c'],
      };
      expect(await check('c,a,b', checkData)).toBe(true);
      expect(await check('c,a,B', checkData)).toBe(true);
      expect(await check('c,a,d', checkData)).toBe(false);
    });

    it('should match unordered array with mixed types', async () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: [1, 'text', /test\d+/],
      };
      expect(await check('test123, 1, text', checkData)).toBe(true);
      expect(await check('text, test456, 1', checkData)).toBe(true);
      expect(await check('test, 1, text', checkData)).toBe(false);
    });
  });

  describe('custom check type', () => {
    const mathDef = defineProblemCheck('math')<{ expr: string }>();

    it('should delegate to matching checker when found', async () => {
      const checkObj = createProblemCheckObject(mathDef, { expr: '2+2' });
      const checker = defineProblemChecker(mathDef, (_data, input) => {
        return input === '4';
      });
      const checkers: ProblemCheckers = { [checker.name]: checker };

      expect(await check('4', checkObj, { checkers })).toBe(true);
      expect(await check('5', checkObj, { checkers })).toBe(false);
    });

    it('should support async checkers', async () => {
      const checkObj = createProblemCheckObject(mathDef, { expr: '2+2' });
      const checker = defineProblemChecker(mathDef, async (_data, input) => {
        return input === '4';
      });
      const checkers: ProblemCheckers = { [checker.name]: checker };

      expect(await check('4', checkObj, { checkers })).toBe(true);
    });

    it('should warn and return false when checker is not found', async () => {
      const checkObj = createProblemCheckObject(mathDef, { expr: '2+2' });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(await check('4', checkObj)).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        'No problem checker found for "math"',
      );

      warnSpy.mockRestore();
    });
  });
});
