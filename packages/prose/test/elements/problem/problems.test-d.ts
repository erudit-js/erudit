import { describe, it } from 'vitest';

import { SubProblem } from '@erudit-js/prose/elements/problem/problems';
import type { ProblemScriptInstance } from '@erudit-js/prose/elements/problem/problemScript';

describe('SubProblem', () => {
  it('should allow only script or problem content children', () => {
    // @ts-expect-error
    SubProblem({
      script: {} as ProblemScriptInstance,
      children: 3,
    });
  });
});
