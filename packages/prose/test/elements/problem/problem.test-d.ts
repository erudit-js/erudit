import { describe, it } from 'vitest';

import { Problem } from '@erudit-js/prose/elements/problem/problem';
import type { ProblemScriptInstance } from '@erudit-js/prose/elements/problem/problemScript';

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
