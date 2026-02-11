import { describe, it } from 'vitest';

import { ProblemCheck } from '@erudit-js/prose/elements/problem/problemCheck';

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
});
