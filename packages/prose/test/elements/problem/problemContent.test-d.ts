import { describe, it } from 'vitest';

import { ProblemCheck } from '@erudit-js/prose/elements/problem/problemContent';

describe('Problem Content', () => {
    it('should allow only one of answer, answers or check', () => {
        ProblemCheck({ answer: 42 });
        ProblemCheck({ answers: [42, 43] });
        ProblemCheck({
            script: true,
        });

        // @ts-expect-error
        ProblemCheck({
            answer: 42,
            answers: [42, 43],
            script: true as const,
        });
    });
});
