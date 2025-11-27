import { describe, it } from 'vitest';

import { ProblemCheck } from '@erudit-js/prose/elements/problem/problemContent';

describe('Problem Content', () => {
    it('should allow only one of answer, answers or check', () => {
        // @ts-expect-error
        ProblemCheck({
            answer: 42,
            answers: [42, 43],
            check: () => true,
        });
    });
});
