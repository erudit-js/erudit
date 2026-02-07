import { describe, expect, it } from 'vitest';

import { type RawElement, PROSE_REGISTRY, isolateProse } from '@jsprose/core';

import {
  toSerializableValidator,
  checkProblemAnswer,
  type ProblemCheckValidator,
  fromSerializableValidator,
  problemCheckRegistryItem,
  problemCheckSchema,
  ProblemCheck,
} from '@erudit-js/prose/elements/problem/problemCheck';

const check = (
  answer: string,
  checkData: ProblemCheckValidator,
  yesRegexp?: RegExp,
  noRegexp?: RegExp,
) => {
  const defaultYesRegexp = /^(yes|y|true|t|1)$/i;
  const defaultNoRegexp = /^(no|n|false|f|0)$/i;
  return checkProblemAnswer(
    answer,
    yesRegexp ?? defaultYesRegexp,
    noRegexp ?? defaultNoRegexp,
    checkData,
  );
};

export const prepareRegistry = () => {
  PROSE_REGISTRY.setItems(problemCheckRegistryItem);
};

describe('<ProblemCheck>', () => {
  it('should throw on non-check children', () => {
    expect(() => <ProblemCheck yes> </ProblemCheck>).toThrow();
  });

  it('should fill info and serialized validator for root check and nested check correctly', () => {
    isolateProse(() => {
      prepareRegistry();

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
      ) as RawElement<typeof problemCheckSchema>;

      const childrenCheck = rootCheck.children![0] as RawElement<
        typeof problemCheckSchema
      >;

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
    it('should return true when answer matches yes pattern for true answer', () => {
      const checkData: ProblemCheckValidator = {
        type: 'boolean',
        answer: true,
      };
      expect(check('yes', checkData)).toBe(true);
      expect(check('y', checkData)).toBe(true);
      expect(check('TRUE', checkData)).toBe(true);
      expect(check('1', checkData)).toBe(true);
    });

    it('should return false when answer does not match yes pattern for true answer', () => {
      const checkData: ProblemCheckValidator = {
        type: 'boolean',
        answer: true,
      };
      expect(check('no', checkData)).toBe(false);
      expect(check('maybe', checkData)).toBe(false);
      expect(check('', checkData)).toBe(false);
    });

    it('should return true when answer matches no pattern for false answer', () => {
      const checkData: ProblemCheckValidator = {
        type: 'boolean',
        answer: false,
      };
      expect(check('no', checkData)).toBe(true);
      expect(check('n', checkData)).toBe(true);
      expect(check('FALSE', checkData)).toBe(true);
      expect(check('0', checkData)).toBe(true);
    });

    it('should return false when answer does not match no pattern for false answer', () => {
      const checkData: ProblemCheckValidator = {
        type: 'boolean',
        answer: false,
      };
      expect(check('yes', checkData)).toBe(false);
      expect(check('maybe', checkData)).toBe(false);
    });
  });

  describe('value type', () => {
    it('should match string values exactly', () => {
      const checkData: ProblemCheckValidator = {
        type: 'value',
        answer: 'hello',
      };
      expect(check('hello', checkData)).toBe(true);
      expect(check('Hello', checkData)).toBe(false);
      expect(check('hello ', checkData)).toBe(false);
    });

    it('should match number values', () => {
      const checkData: ProblemCheckValidator = { type: 'value', answer: 42 };
      expect(check('42', checkData)).toBe(true);
      expect(check('42.0', checkData)).toBe(true);
      expect(check('43', checkData)).toBe(false);
      expect(check('forty-two', checkData)).toBe(false);

      const negativeFloatCheckData: ProblemCheckValidator = {
        type: 'value',
        answer: -3.14,
      };
      expect(check('-3.14', negativeFloatCheckData)).toBe(true);
      expect(check('-3.140', negativeFloatCheckData)).toBe(true);
      expect(check('-3.15', negativeFloatCheckData)).toBe(false);
    });

    it('should match using RegExp', () => {
      const checkData: ProblemCheckValidator = {
        type: 'value',
        answer: /^test\d+$/i,
      };
      expect(check('test123', checkData)).toBe(true);
      expect(check('TEST456', checkData)).toBe(true);
      expect(check('test', checkData)).toBe(false);
      expect(check('testing123', checkData)).toBe(false);
    });

    it('should match undefined (empty string)', () => {
      const checkData: ProblemCheckValidator = {
        type: 'value',
        answer: undefined,
      };
      expect(check('', checkData)).toBe(true);
      expect(check('   ', checkData)).toBe(true);
      expect(check('something', checkData)).toBe(false);
    });
  });

  describe('array type - ordered', () => {
    it('should match ordered array with exact values', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(check('a,b,c', checkData)).toBe(true);
      expect(check('a, b, c', checkData)).toBe(true);
      expect(check('a , b , c', checkData)).toBe(true);
    });

    it('should reject ordered array with wrong order', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(check('b,a,c', checkData)).toBe(false);
      expect(check('c,b,a', checkData)).toBe(false);
    });

    it('should reject ordered array with wrong length', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(check('a,b', checkData)).toBe(false);
      expect(check('a,b,c,d', checkData)).toBe(false);
      expect(check('', checkData)).toBe(false);
    });

    it('should match ordered array with numbers', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: [1, 2, 3],
      };
      expect(check('1,2,3', checkData)).toBe(true);
      expect(check('1, 2, 3', checkData)).toBe(true);
    });

    it('should match ordered array with regex patterns', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: [/^test\d+$/, /^[a-z]+$/i, 'exact'],
      };
      expect(check('test123, hello, exact', checkData)).toBe(true);
      expect(check('test456, WORLD, exact', checkData)).toBe(true);
      expect(check('test, hello, exact', checkData)).toBe(false);
    });

    it('should match ordered array with any-of alternatives', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ',',
        answers: ['a', ['b', 'B'], 'c'],
      };
      expect(check('a,b,c', checkData)).toBe(true);
      expect(check('a,B,c', checkData)).toBe(true);
      expect(check('a,d,c', checkData)).toBe(false);
    });

    it('should handle different separators', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: ';',
        answers: ['a', 'b', 'c'],
      };
      expect(check('a;b;c', checkData)).toBe(true);
      expect(check('a; b; c', checkData)).toBe(true);
      expect(check('a,b,c', checkData)).toBe(false);
    });

    it('should handle special characters in separator', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: true,
        separator: '|',
        answers: ['a', 'b', 'c'],
      };
      expect(check('a|b|c', checkData)).toBe(true);
    });
  });

  describe('array type - unordered', () => {
    it('should match unordered array regardless of order', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(check('a,b,c', checkData)).toBe(true);
      expect(check('b,a,c', checkData)).toBe(true);
      expect(check('c,b,a', checkData)).toBe(true);
      expect(check('b,c,a', checkData)).toBe(true);
    });

    it('should reject unordered array with extra elements', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(check('a,b,c,d', checkData)).toBe(false);
      expect(check('a,b,c,c', checkData)).toBe(false);
    });

    it('should reject unordered array with missing elements', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: ['a', 'b', 'c'],
      };
      expect(check('a,b', checkData)).toBe(false);
      expect(check('a,b,d', checkData)).toBe(false);
    });

    it('should handle duplicates in unordered array correctly', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: ['a', 'a', 'b'],
      };
      expect(check('a,a,b', checkData)).toBe(true);
      expect(check('a,b,a', checkData)).toBe(true);
      expect(check('a,b', checkData)).toBe(false);
    });

    it('should match unordered array with any-of alternatives', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: ['a', ['b', 'B'], 'c'],
      };
      expect(check('c,a,b', checkData)).toBe(true);
      expect(check('c,a,B', checkData)).toBe(true);
      expect(check('c,a,d', checkData)).toBe(false);
    });

    it('should match unordered array with mixed types', () => {
      const checkData: ProblemCheckValidator = {
        type: 'array',
        ordered: false,
        separator: ',',
        answers: [1, 'text', /test\d+/],
      };
      expect(check('test123, 1, text', checkData)).toBe(true);
      expect(check('text, test456, 1', checkData)).toBe(true);
      expect(check('test, 1, text', checkData)).toBe(false);
    });
  });
});
