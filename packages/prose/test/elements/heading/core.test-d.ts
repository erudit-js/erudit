import { describe, it } from 'vitest';

import { H2 } from '@erudit-js/prose/elements/heading/core';

describe('Heading', () => {
    it('should not let use toc tag prop', () => {
        // @ts-expect-error
        H2({ toc: true });
    });
});
