import { describe, it } from 'vitest';

import { A, BlockLink } from '@erudit-js/prose/elements/link/core';

describe('Link and Block Link', () => {
    it('should require "to" tag prop', () => {
        // @ts-expect-error
        A({ children: undefined as any });
        // @ts-expect-error
        BlockLink({ children: 'link' });
    });

    it('should not let use toc and snippet tag props', () => {
        // @ts-expect-error
        A({ toc: true });
        // @ts-expect-error
        A({ snippet: { title: 'something' } });
        // 	@ts-expect-error
        BlockLink({ toc: true });
        // @ts-expect-error
        BlockLink({ snippet: { title: 'something' } });
    });
});
