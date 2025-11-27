import { describe, it, expect } from 'vitest';
import { defineUnique, isolateProse, PROSE_REGISTRY } from '@jsprose/core';

import {
    finalizeSnippet,
    resolveEruditRawElement,
    type ResolvedSnippet,
} from '@erudit-js/prose';
import {
    P,
    paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';
import {
    H1,
    headingRegistryItem,
} from '@erudit-js/prose/elements/heading/core';
import {
    B,
    emphasisRegistryItem,
} from '@erudit-js/prose/elements/emphasis/core';

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

const testFinalizeSnippet = finalizeSnippet as (
    args: DeepPartial<Parameters<typeof finalizeSnippet>[0]>,
) => any;

describe('finalizeSnippet', () => {
    it('should return undefined when snippet is invalid or disabled', () => {
        // No snippet provided
        expect(
            testFinalizeSnippet({
                element: {},
                props: {},
            }),
        ).toBeUndefined();

        // Snippet without quick or search
        expect(
            testFinalizeSnippet({
                element: {},
                props: { snippet: { title: 'Test' } },
            }),
        ).toBeUndefined();

        // Both quick and search are false
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: { quick: false, search: false, title: 'Title' },
                },
            }),
        ).toBeUndefined();
    });

    it('should resolve snippet with quick and search configurations', () => {
        // Quick enabled
        expect(
            testFinalizeSnippet({
                element: {},
                props: { snippet: { quick: true, title: 'Prop Title' } },
            }),
        ).toEqual({
            quick: true,
            title: 'Prop Title',
        });

        // Search enabled
        expect(
            testFinalizeSnippet({
                element: {},
                props: { snippet: { search: true, title: 'Test Title' } },
            }),
        ).toEqual({
            search: true,
            title: 'Test Title',
        });

        // Search with synonyms
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: {
                        search: { synonyms: ['alias1', 'alias2'] },
                        title: 'Test',
                    },
                },
            }),
        ).toEqual({
            search: { synonyms: ['alias1', 'alias2'] },
            title: 'Test',
        });

        // Both quick and search enabled
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: {
                        quick: true,
                        search: { synonyms: ['syn1'] },
                        title: 'Title',
                    },
                },
            }),
        ).toEqual({
            quick: true,
            search: { synonyms: ['syn1'] },
            title: 'Title',
        });
    });

    it('should prefer props over element values', () => {
        // Prop title overrides element title
        const resultTitle = testFinalizeSnippet({
            props: { snippet: { quick: true, title: 'Prop Title' } },
            element: { snippet: { title: 'Element Title' } },
        });
        expect(resultTitle!.title).toBe('Prop Title');

        // Prop description overrides element description
        const resultDesc = testFinalizeSnippet({
            props: {
                snippet: {
                    quick: true,
                    title: 'Title',
                    description: 'Prop Desc',
                },
            },
            element: {
                snippet: { title: 'Title', description: 'Element Desc' },
            },
        });
        expect(resultDesc!.description).toBe('Prop Desc');
    });

    it('should fallback to element snippet values when props are not provided', () => {
        // Use element snippet when prop snippet not provided
        expect(
            testFinalizeSnippet({
                props: {},
                element: { snippet: { quick: true, title: 'Element Title' } },
            }),
        ).toEqual({
            quick: true,
            title: 'Element Title',
        });

        // Use element title when prop title not provided
        const resultTitle = testFinalizeSnippet({
            props: { snippet: { quick: true } },
            element: { snippet: { title: 'Element Title' } },
        });
        expect(resultTitle!.title).toBe('Element Title');

        // Use element description when prop description not provided
        const resultDesc = testFinalizeSnippet({
            props: { snippet: { quick: true, title: 'Title' } },
            element: {
                snippet: { title: 'Title', description: 'Element Desc' },
            },
        });
        expect(resultDesc!.description).toBe('Element Desc');

        // Use element quick when prop quick is undefined
        const resultQuick = testFinalizeSnippet({
            props: { snippet: { title: 'Prop Title' } },
            element: { snippet: { quick: true, title: 'Title' } },
        });
        expect(resultQuick!.quick).toBe(true);

        // Use element search when prop search is undefined
        const resultSearch = testFinalizeSnippet({
            props: { snippet: { title: 'Prop Title' } },
            element: {
                snippet: { search: { synonyms: ['syn'] }, title: 'Title' },
            },
        });
        expect(resultSearch!.search).toEqual({ synonyms: ['syn'] });
    });

    it('should trim whitespace from title and description', () => {
        // Trim title
        const resultTitle = testFinalizeSnippet({
            props: { snippet: { quick: true, title: '  Trimmed Title  ' } },
            element: {},
        });
        expect(resultTitle!.title).toBe('Trimmed Title');

        // Trim description
        const resultDesc = testFinalizeSnippet({
            props: {
                snippet: {
                    quick: true,
                    title: 'Title',
                    description: '  Trimmed Description  ',
                },
            },
            element: {},
        });
        expect(resultDesc!.description).toBe('Trimmed Description');
    });

    it('should fallback to element title if possible when finalizing snippet title', () => {
        expect(
            testFinalizeSnippet({
                props: { snippet: { quick: true } },
                element: {
                    title: 'Element Title',
                },
            }),
        ).toEqual({ quick: true, title: 'Element Title' });
    });

    it('should throw error for invalid titles', () => {
        // Title cannot be resolved
        expect(() => {
            testFinalizeSnippet({
                props: { snippet: { quick: true } },
                element: {},
            });
        }).toThrow();

        // Title is whitespace only
        expect(() => {
            testFinalizeSnippet({
                props: { snippet: { quick: true, title: '   ' } },
                element: {},
            });
        }).toThrow();
    });

    it('should handle prop overrides correctly', () => {
        // Prop quick: false overrides element quick: true
        expect(
            testFinalizeSnippet({
                props: { snippet: { quick: false } },
                element: { snippet: { quick: true, title: 'Title' } },
            }),
        ).toBeUndefined();

        // Prop search: false overrides element search
        expect(
            testFinalizeSnippet({
                props: { snippet: { search: false } },
                element: {
                    snippet: { search: { synonyms: ['syn'] }, title: 'Title' },
                },
            }),
        ).toBeUndefined();

        // Prop quick: false but search enabled
        expect(
            testFinalizeSnippet({
                props: { snippet: { search: true, quick: false } },
                element: { snippet: { quick: true, title: 'Title' } },
            }),
        ).toEqual({
            search: true,
            title: 'Title',
        });

        // Prop search: false but quick enabled
        expect(
            testFinalizeSnippet({
                props: { snippet: { quick: true, search: false } },
                element: {
                    snippet: { search: { synonyms: ['syn'] }, title: 'Title' },
                },
            }),
        ).toEqual({
            quick: true,
            title: 'Title',
        });
    });
});

describe('snippetStep', () => {
    it('should collect snippets', async () => {
        await isolateProse(async () => {
            PROSE_REGISTRY.setItems(
                paragraphRegistryItem,
                headingRegistryItem,
                emphasisRegistryItem,
            );

            const pUnique = defineUnique({
                documentId: undefined as any,
                name: 'pUnique',
                tag: P,
            });

            const { snippets, proseElement } = await resolveEruditRawElement({
                context: {
                    language: 'en',
                    linkable: true,
                },
                rawElement: (
                    <>
                        <H1>Heading 1 Title</H1>
                        <P>Paragraph 1</P>
                        <P
                            $={pUnique}
                            snippet={{ quick: true, title: 'P-Snippet' }}
                        >
                            Paragraph with{' '}
                            <B snippet={{ quick: true, title: 'Bold' }}>
                                manual
                            </B>{' '}
                            snippet title
                        </P>
                        <P snippet={{ search: true }} toc="Toc Title">
                            Paragraph with snippet title taken from toc title
                        </P>
                    </>
                ),
            });

            expect(snippets).toHaveLength(4);
            expect(snippets).toEqual<ResolvedSnippet[]>([
                {
                    schemaName: 'heading',
                    search: true,
                    title: 'Heading 1 Title',
                    isUnique: false,
                    elementId: proseElement.children![0].id!,
                },
                {
                    schemaName: 'emphasis',
                    quick: true,
                    title: 'Bold',
                    isUnique: false,
                    elementId: proseElement.children![2].children![1].id!,
                },
                {
                    schemaName: 'paragraph',
                    quick: true,
                    title: 'P-Snippet',
                    isUnique: true,
                    elementId: proseElement.children![2].id!,
                },
                {
                    schemaName: 'paragraph',
                    search: true,
                    title: 'Toc Title',
                    isUnique: false,
                    elementId: proseElement.children![3].id!,
                },
            ]);
        });
    });
});
