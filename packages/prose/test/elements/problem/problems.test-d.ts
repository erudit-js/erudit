import { describe, it } from 'vitest';

import { SubProblem } from '@src/elements/problem/problems';
import type { ProblemScriptInstance } from '@src/elements/problem/problemScript';

describe('SubProblem', () => {
  it('should allow only script or problem content children', () => {
    // @ts-expect-error
    SubProblem({
      script: {} as ProblemScriptInstance,
      children: 3,
    });
  });
});
