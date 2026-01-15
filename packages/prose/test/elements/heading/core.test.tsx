import { describe, expect, it } from 'vitest';
import { isolateProse, PROSE_REGISTRY } from '@jsprose/core';

import { asEruditRaw } from '@erudit-js/prose';
import {
    H1,
    H2,
    H3,
    headingRegistryItem,
} from '@erudit-js/prose/elements/heading/core';

describe('Heading', () => {
    it('should correclty set level, title, and automatic snippet/toc element data', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(headingRegistryItem);

            const h1 = asEruditRaw(<H1 search>Heading Level 1</H1>);
            const h2 = asEruditRaw(<H2 quick>Heading Level 2</H2>);
            const h3 = asEruditRaw(<H3 seo>Heading Level 3</H3>);

            expect(h1.data).toStrictEqual({
                level: 1,
                title: 'Heading Level 1',
            });
            expect(h1.slug).toBe('Heading Level 1');
            expect(h1.snippet).toStrictEqual({
                title: 'Heading Level 1',
            });
            expect(h1.snippetFlags).toStrictEqual({
                search: true,
                quick: undefined,
                seo: false,
            });
            expect(h1.toc).toStrictEqual({
                title: 'Heading Level 1',
            });
            expect(h1.title).toBe('Heading Level 1');

            expect(h2.data).toStrictEqual({
                level: 2,
                title: 'Heading Level 2',
            });
            expect(h2.slug).toBe('Heading Level 2');
            expect(h2.title).toBe('Heading Level 2');
            expect(h2.snippetFlags).toStrictEqual({
                search: true,
                quick: true,
                seo: false,
            });

            expect(h3.data).toStrictEqual({
                level: 3,
                title: 'Heading Level 3',
            });
            expect(h3.slug).toBe('Heading Level 3');
            expect(h3.title).toBe('Heading Level 3');
            expect(h3.snippetFlags).toStrictEqual({
                search: true,
                quick: undefined,
                seo: true,
            });
        });
    });

    it('should prioritize prop snippet data over auto-generated one', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(headingRegistryItem);

            expect(
                asEruditRaw(
                    <H1
                        snippet={{
                            title: 'Manual Snippet Title',
                            description: 'Test description',
                        }}
                        search
                    >
                        Auto-generated {'Snippet'} Title
                    </H1>,
                ).snippet,
            ).toStrictEqual({
                title: 'Manual Snippet Title',
                description: 'Test description',
            });

            expect(
                asEruditRaw(<H2 search={false}>Heading 2</H2>).snippet,
            ).toBeUndefined();
        });
    });

    it('should throw if title is empty or falsy', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(headingRegistryItem);
            expect(() => {
                <H2> </H2>;
            }).toThrow();
        });
    });
});
