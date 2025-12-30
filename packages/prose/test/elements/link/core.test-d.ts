import { describe, it } from 'vitest';

import { Ref, Reference } from '@erudit-js/prose/elements/link/reference/core';
import {
    Dep,
    Dependency,
} from '@erudit-js/prose/elements/link/dependency/core';

describe('Link and Block Link', () => {
    it('should require "to" tag prop', () => {
        // @ts-expect-error
        Ref({ children: undefined as any });
        // @ts-expect-error
        Reference({ children: 'link' });

        // @ts-expect-error
        Dep({ children: undefined as any });
        // @ts-expect-error
        Dependency({ children: 'link' });
    });

    it('should not let use toc and snippet tag props', () => {
        // @ts-expect-error
        Ref({ toc: true });
        // @ts-expect-error
        Ref({ snippet: { title: 'something' } });
        // 	@ts-expect-error
        Reference({ toc: true });
        // @ts-expect-error
        Reference({ snippet: { title: 'something' } });

        // @ts-expect-error
        Dep({ toc: true });
        // @ts-expect-error
        Dep({ snippet: { title: 'something' } });
        // 	@ts-expect-error
        Dependency({ toc: true });
        // @ts-expect-error
        Dependency({ snippet: { title: 'something' } });
    });
});
