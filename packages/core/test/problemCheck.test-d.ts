import { describe, expectTypeOf, it } from 'vitest';

import {
  isProblemCheckObject,
  type ProblemCheckDefinition,
  type ProblemCheckObject,
  type ToProblemCheckDefinition,
  type ToProblemChecker,
  type ToProblemCheckObject,
} from '@src/problemCheck.js';

type SpecificDefinition = ToProblemCheckDefinition<'specific', { foo: string }>;
type SpecificObject = ToProblemCheckObject<SpecificDefinition>;
type SpecificChecker = ToProblemChecker<SpecificDefinition>;

describe('Problem Check Definition', () => {
  it('should widen correctly', () => {
    expectTypeOf<SpecificDefinition>().toExtend<ProblemCheckDefinition>();
  });
});

describe('Problem Check Object', () => {
  it('should widen correctly', () => {
    expectTypeOf<SpecificObject>().toExtend<ProblemCheckObject>();
  });
});

describe('isProblemCheckObject', () => {
  it('should cast to ProblemCheckObject', () => {
    const value = {} as any;
    const result = isProblemCheckObject(value);
    if (result) {
      expectTypeOf(value).toEqualTypeOf<ProblemCheckObject>();
    }
  });
});

describe('Problem Checker', () => {
  it('should widen correctly', () => {
    expectTypeOf<SpecificChecker>().toExtend<
      ToProblemChecker<ProblemCheckDefinition>
    >();
  });
});
