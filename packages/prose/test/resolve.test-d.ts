import { describe, it, expectTypeOf } from 'vitest';

import {
    resolveEruditRawElement,
    type ResolvedSnippet,
    type ResolvedTocItem,
} from '@erudit-js/prose';

describe('resolveEruditRawElement', () => {
    it('should augment resolve return', async () => {
        const resolveResult = await resolveEruditRawElement(undefined as any);

        expectTypeOf<typeof resolveResult.snippets>().toEqualTypeOf<
            ResolvedSnippet[]
        >();
        expectTypeOf<typeof resolveResult.tocItems>().toEqualTypeOf<
            ResolvedTocItem[]
        >();
    });
});
