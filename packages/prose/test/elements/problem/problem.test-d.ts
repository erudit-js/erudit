import { describe, it } from 'vitest';

import type { ProblemScriptInstance } from '@src/elements/problem/problemScript';

describe('Problem', () => {
  it('should allow only script or problem content children', () => {
    // @ts-expect-error
    Problem({
      title: 'Sample Problem',
      level: 'hard',
      script: undefined as any as ProblemScriptInstance,
      children: 3,
    });
  });
});
