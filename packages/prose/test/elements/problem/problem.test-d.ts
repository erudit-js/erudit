import { describe, it } from 'vitest';

import { Problem } from '@erudit-js/prose/elements/problem/problem';
import type { ProblemScript } from '@erudit-js/prose/elements/problem/problemScript';

describe('Problem', () => {
    it('should allow only script or problem content children', () => {
        // @ts-expect-error
        Problem({
            title: 'Sample Problem',
            level: 'hard',
            script: {} as ProblemScript,
            children: 3,
        });
    });
});
