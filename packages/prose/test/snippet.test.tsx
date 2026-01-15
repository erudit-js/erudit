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

        // Both quick, search, and seo are undefined/false - no snippet
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: { title: 'Title' },
                },
            }),
        ).toBeUndefined();
    });

    it('should resolve snippet with quick and search configurations', () => {
        // Quick enabled
        expect(
            testFinalizeSnippet({
                element: {},
                props: { snippet: { title: 'Prop Title' }, quick: true },
            }),
        ).toEqual({
            title: 'Prop Title',
        });

        // Search enabled
        expect(
            testFinalizeSnippet({
                element: {},
                props: { snippet: { title: 'Test Title' }, search: true },
            }),
        ).toEqual({
            title: 'Test Title',
        });

        // Both quick and search enabled
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: { title: 'Title' },
                    quick: true,
                    search: true,
                },
            }),
        ).toEqual({
            title: 'Title',
        });

        // SEO enabled
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: { title: 'SEO Title' },
                    seo: true,
                },
            }),
        ).toEqual({
            title: 'SEO Title',
        });

        // Search with synonyms
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: { title: 'Search Title' },
                    search: { synonyms: ['alias1', 'alias2'] },
                },
            }),
        ).toEqual({
            title: 'Search Title',
        });

        // Quick and search with synonyms
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: { title: 'Combined Title' },
                    quick: true,
                    search: { synonyms: ['syn1', 'syn2', 'syn3'] },
                },
            }),
        ).toEqual({
            title: 'Combined Title',
        });
    });

    it('should prefer props over element values', () => {
        // Prop title overrides element title
        const resultTitle = testFinalizeSnippet({
            props: { snippet: { title: 'Prop Title' }, quick: true },
            element: { snippet: { title: 'Element Title' } },
        });
        expect(resultTitle!.title).toBe('Prop Title');

        // Prop description overrides element description
        const resultDesc = testFinalizeSnippet({
            props: {
                snippet: {
                    title: 'Title',
                    description: 'Prop Desc',
                },
                quick: true,
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
                props: { quick: true },
                element: { snippet: { title: 'Element Title' } },
            }),
        ).toEqual({
            title: 'Element Title',
        });

        // Use element title when prop title not provided
        const resultTitle = testFinalizeSnippet({
            props: { snippet: {}, quick: true },
            element: { snippet: { title: 'Element Title' } },
        });
        expect(resultTitle!.title).toBe('Element Title');

        // Use element description when prop description not provided
        const resultDesc = testFinalizeSnippet({
            props: { snippet: { title: 'Title' }, quick: true },
            element: {
                snippet: { title: 'Title', description: 'Element Desc' },
            },
        });
        expect(resultDesc!.description).toBe('Element Desc');
    });

    it('should trim whitespace from title and description', () => {
        // Trim title
        const resultTitle = testFinalizeSnippet({
            props: { snippet: { title: '  Trimmed Title  ' }, quick: true },
            element: {},
        });
        expect(resultTitle!.title).toBe('Trimmed Title');

        // Trim description
        const resultDesc = testFinalizeSnippet({
            props: {
                snippet: {
                    title: 'Title',
                    description: '  Trimmed Description  ',
                },
                quick: true,
            },
            element: {},
        });
        expect(resultDesc!.description).toBe('Trimmed Description');
    });

    it('should fallback to element title if possible when finalizing snippet title', () => {
        expect(
            testFinalizeSnippet({
                props: { snippet: {}, quick: true },
                element: {
                    title: 'Element Title',
                },
            }),
        ).toEqual({ title: 'Element Title' });
    });

    it('should throw error for invalid titles', () => {
        // Title cannot be resolved
        expect(() => {
            testFinalizeSnippet({
                props: { snippet: {}, quick: true },
                element: {},
            });
        }).toThrow();

        // Title is whitespace only
        expect(() => {
            testFinalizeSnippet({
                props: { snippet: { title: '   ' }, quick: true },
                element: {},
            });
        }).toThrow();
    });

    it('should handle prop overrides correctly', () => {
        // No flags set - returns undefined
        expect(
            testFinalizeSnippet({
                props: { snippet: { title: 'Title' } },
                element: {},
            }),
        ).toBeUndefined();

        // Quick: false but search enabled - snippet created
        expect(
            testFinalizeSnippet({
                props: {
                    snippet: { title: 'Title' },
                    search: true,
                    quick: false,
                },
                element: {},
            }),
        ).toEqual({
            title: 'Title',
        });

        // Search: false but quick enabled - snippet created
        expect(
            testFinalizeSnippet({
                props: {
                    snippet: { title: 'Title' },
                    quick: true,
                    search: false,
                },
                element: {},
            }),
        ).toEqual({
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
                        <P $={pUnique} snippet={{ title: 'P-Snippet' }} quick>
                            Paragraph with{' '}
                            <B snippet={{ title: 'Bold' }} quick>
                                manual
                            </B>{' '}
                            snippet title
                        </P>
                        <P snippet={{}} search toc="Toc Title">
                            Paragraph with snippet title taken from toc title
                        </P>
                    </>
                ),
            });

            expect(snippets).toHaveLength(4);
            expect(snippets).toEqual<ResolvedSnippet[]>([
                {
                    schemaName: 'heading',
                    quick: undefined,
                    search: true,
                    seo: false,
                    title: 'Heading 1 Title',
                    isUnique: false,
                    elementId: proseElement.children![0].id!,
                },
                {
                    schemaName: 'emphasis',
                    quick: true,
                    search: undefined,
                    seo: true,
                    title: 'Bold',
                    isUnique: false,
                    elementId: proseElement.children![2].children![1].id!,
                },
                {
                    schemaName: 'paragraph',
                    quick: true,
                    search: undefined,
                    seo: true,
                    title: 'P-Snippet',
                    isUnique: true,
                    elementId: proseElement.children![2].id!,
                },
                {
                    schemaName: 'paragraph',
                    quick: undefined,
                    search: true,
                    seo: true,
                    title: 'Toc Title',
                    isUnique: false,
                    elementId: proseElement.children![3].id!,
                },
            ]);
        });
    });

    it('should collect snippets with synonyms', async () => {
        await isolateProse(async () => {
            PROSE_REGISTRY.setItems(
                paragraphRegistryItem,
                headingRegistryItem,
                emphasisRegistryItem,
            );

            const { snippets, proseElement } = await resolveEruditRawElement({
                context: {
                    language: 'en',
                    linkable: true,
                },
                rawElement: (
                    <>
                        <H1
                            snippet={{ title: 'Advanced Search' }}
                            search={{ synonyms: ['lookup', 'find', 'query'] }}
                        >
                            Search Heading
                        </H1>
                        <P
                            snippet={{
                                title: 'Paragraph with synonyms',
                                description: 'Test description',
                            }}
                            search={{ synonyms: ['alternative', 'alias'] }}
                            seo
                        >
                            Some content here with{' '}
                            <B snippet={{ title: 'Bold Text' }} quick>
                                emphasis
                            </B>
                        </P>
                    </>
                ),
            });

            expect(snippets).toHaveLength(3);
            expect(snippets).toEqual<ResolvedSnippet[]>([
                {
                    schemaName: 'heading',
                    quick: undefined,
                    search: { synonyms: ['lookup', 'find', 'query'] },
                    seo: false,
                    title: 'Advanced Search',
                    isUnique: false,
                    elementId: proseElement.children![0].id!,
                },
                {
                    schemaName: 'emphasis',
                    quick: true,
                    search: undefined,
                    seo: true,
                    title: 'Bold Text',
                    isUnique: false,
                    elementId: proseElement.children![1].children![1].id!,
                },
                {
                    schemaName: 'paragraph',
                    quick: undefined,
                    search: { synonyms: ['alternative', 'alias'] },
                    seo: true,
                    title: 'Paragraph with synonyms',
                    description: 'Test description',
                    isUnique: false,
                    elementId: proseElement.children![1].id!,
                },
            ]);
        });
    });
});
