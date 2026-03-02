import { describe, it } from 'vitest';

import { ProblemCheck } from '@src/elements/problem/problemCheck';
import type { ProblemCheckObject } from '@erudit-js/core/problemCheck';

describe('Problem Content', () => {
  it('should allow yes/no, answer, answers or script', () => {
    ProblemCheck({ yes: true });
    ProblemCheck({ no: true });
    ProblemCheck({ answer: undefined });
    ProblemCheck({ answer: 'foobar' });
    ProblemCheck({ answer: /\d+/ });
    ProblemCheck({ answer: 42 });
    ProblemCheck({ answers: [42, [43, /\d+/]] });
    ProblemCheck({
      script: 'myCheck',
    });
  });

  it('should not allow providing multiple answer props', () => {
    // @ts-expect-error
    ProblemCheck({
      yes: true,
      answer: 42,
      answers: [42, 43],
      script: 'myCheck',
    });
  });

  it('should accept branded ProblemCheckObject objects', () => {
    ProblemCheck({
      answer: { __ERUDIT_CHECK: true, name: 'math', data: { expr: 'sqrt(2)' } },
    });

    const descriptor: ProblemCheckObject = {
      __ERUDIT_CHECK: true,
      name: 'custom',
      data: null,
    };
    ProblemCheck({ answer: descriptor });
  });

  it('should reject plain objects without __ERUDIT_CHECK', () => {
    // @ts-expect-error
    ProblemCheck({ answer: { type: 'math', expr: 'sqrt(2)' } });

    // @ts-expect-error
    ProblemCheck({ answer: { foo: 'bar' } });
  });

  it('should reject objects with __ERUDIT_CHECK set to non-true', () => {
    // @ts-expect-error
    ProblemCheck({ answer: { __ERUDIT_CHECK: false, name: 'math', data: {} } });

    // @ts-expect-error
    ProblemCheck({ answer: { __ERUDIT_CHECK: 'yes', name: 'math', data: {} } });

    // @ts-expect-error
    ProblemCheck({ answer: { __ERUDIT_CHECK: 42 } });
  });
});
