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
    it('should return undefined when no flags are enabled', () => {
        // No snippet provided
        expect(
            testFinalizeSnippet({
                element: {},
                props: {},
            }),
        ).toBeUndefined();

        // Snippet without any flags
        expect(
            testFinalizeSnippet({
                element: {},
                props: { snippet: { title: 'Test' } },
            }),
        ).toBeUndefined();

        // All flags explicitly false
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: {
                        title: 'Title',
                        quick: false,
                        search: false,
                        seo: false,
                    },
                },
            }),
        ).toBeUndefined();
    });

    it('should resolve snippet with quick flag', () => {
        // Quick as boolean
        expect(
            testFinalizeSnippet({
                element: {},
                props: { snippet: { title: 'Quick Title', quick: true } },
            }),
        ).toEqual({
            title: 'Quick Title',
            quick: true,
            seo: true, // Auto-enabled
        });

        // Quick with custom title
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: {
                        title: 'General Title',
                        quick: { title: 'Quick Title' },
                    },
                },
            }),
        ).toEqual({
            title: 'General Title',
            quick: { title: 'Quick Title' },
            seo: true,
        });

        // Quick with custom title and description
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: {
                        title: 'General Title',
                        quick: {
                            title: 'Quick Title',
                            description: 'Quick Desc',
                        },
                    },
                },
            }),
        ).toEqual({
            title: 'General Title',
            quick: { title: 'Quick Title', description: 'Quick Desc' },
            seo: true,
        });
    });

    it('should resolve snippet with search flag', () => {
        // Search as boolean
        expect(
            testFinalizeSnippet({
                element: {},
                props: { snippet: { title: 'Search Title', search: true } },
            }),
        ).toEqual({
            title: 'Search Title',
            search: true,
            seo: true, // Auto-enabled
        });

        // Search with synonyms array
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: {
                        title: 'Title',
                        search: ['alias1', 'alias2'],
                    },
                },
            }),
        ).toEqual({
            title: 'Title',
            search: ['alias1', 'alias2'],
            seo: true,
        });

        // Search with custom configuration
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: {
                        title: 'General Title',
                        search: {
                            title: 'Search Title',
                            description: 'Search Desc',
                            synonyms: ['syn1', 'syn2'],
                        },
                    },
                },
            }),
        ).toEqual({
            title: 'General Title',
            search: {
                title: 'Search Title',
                description: 'Search Desc',
                synonyms: ['syn1', 'syn2'],
            },
            seo: true,
        });
    });

    it('should resolve snippet with seo flag', () => {
        // SEO as boolean
        expect(
            testFinalizeSnippet({
                element: {},
                props: { snippet: { title: 'SEO Title', seo: true } },
            }),
        ).toEqual({
            title: 'SEO Title',
            seo: true,
        });

        // SEO with custom title and description
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: {
                        title: 'General Title',
                        seo: {
                            title: 'SEO Title',
                            description: 'SEO Desc',
                        },
                    },
                },
            }),
        ).toEqual({
            title: 'General Title',
            seo: { title: 'SEO Title', description: 'SEO Desc' },
        });
    });

    it('should combine multiple flags', () => {
        // Quick and search
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: {
                        title: 'Title',
                        quick: true,
                        search: true,
                    },
                },
            }),
        ).toEqual({
            title: 'Title',
            quick: true,
            search: true,
            seo: true,
        });

        // All flags with custom configurations
        expect(
            testFinalizeSnippet({
                element: {},
                props: {
                    snippet: {
                        title: 'General Title',
                        description: 'General Desc',
                        quick: { title: 'Quick' },
                        search: { synonyms: ['alias'] },
                        seo: { title: 'SEO Title' },
                    },
                },
            }),
        ).toEqual({
            title: 'General Title',
            description: 'General Desc',
            quick: { title: 'Quick' },
            search: { synonyms: ['alias'] },
            seo: { title: 'SEO Title' },
        });
    });

    it('should auto-enable SEO when quick or search is enabled', () => {
        // SEO auto-enabled with quick
        const resultQuick = testFinalizeSnippet({
            element: {},
            props: { snippet: { title: 'Title', quick: true } },
        });
        expect(resultQuick!.seo).toBe(true);

        // SEO auto-enabled with search
        const resultSearch = testFinalizeSnippet({
            element: {},
            props: { snippet: { title: 'Title', search: true } },
        });
        expect(resultSearch!.seo).toBe(true);

        // SEO not auto-enabled when explicitly disabled (but snippet still created)
        const resultDisabled = testFinalizeSnippet({
            element: {},
            props: {
                snippet: { title: 'Title', quick: true, seo: false },
            },
        });
        expect(resultDisabled).toEqual({
            title: 'Title',
            quick: true,
        });
    });

    it('should prefer props snippet over element snippet', () => {
        // Prop snippet overrides element snippet (but flags are merged)
        expect(
            testFinalizeSnippet({
                props: {
                    snippet: { title: 'Prop Title', quick: true },
                },
                element: {
                    snippet: { title: 'Element Title', search: true },
                },
            }),
        ).toEqual({
            title: 'Prop Title',
            quick: true,
            search: true, // Element flag is merged
            seo: true,
        });

        // Prop flags override element flags
        expect(
            testFinalizeSnippet({
                props: {
                    snippet: {
                        title: 'Title',
                        quick: true,
                        search: false,
                    },
                },
                element: {
                    snippet: { title: 'Title', quick: false, search: true },
                },
            }),
        ).toEqual({
            title: 'Title',
            quick: true,
            seo: true,
        });
    });

    it('should fallback to element snippet when props are not provided', () => {
        // Use element snippet when no prop snippet
        expect(
            testFinalizeSnippet({
                props: {},
                element: {
                    snippet: { title: 'Element Title', quick: true },
                },
            }),
        ).toEqual({
            title: 'Element Title',
            quick: true,
            seo: true,
        });

        // Merge prop flags with element snippet
        expect(
            testFinalizeSnippet({
                props: { snippet: { quick: true } },
                element: {
                    snippet: { title: 'Element Title' },
                },
            }),
        ).toEqual({
            title: 'Element Title',
            quick: true,
            seo: true,
        });
    });

    it('should trim whitespace from title and description', () => {
        const result = testFinalizeSnippet({
            props: {
                snippet: {
                    title: '  Trimmed Title  ',
                    description: '  Trimmed Description  ',
                    quick: true,
                },
            },
            element: {},
        });
        expect(result!.title).toBe('Trimmed Title');
        expect(result!.description).toBe('Trimmed Description');
    });

    it('should fallback to element title when snippet title is not provided', () => {
        expect(
            testFinalizeSnippet({
                props: { snippet: { quick: true } },
                element: { title: 'Element Title' },
            }),
        ).toEqual({
            title: 'Element Title',
            quick: true,
            seo: true,
        });
    });

    it('should throw error when title cannot be resolved', () => {
        // No title at all with quick flag
        expect(() => {
            testFinalizeSnippet({
                props: { snippet: { quick: true } },
                element: {},
            });
        }).toThrow(/Unable to get title for snippet flags/);

        // Whitespace-only title with search flag
        expect(() => {
            testFinalizeSnippet({
                props: { snippet: { title: '   ', search: true } },
                element: {},
            });
        }).toThrow(/Unable to get title for snippet flags/);

        // No title with seo flag
        expect(() => {
            testFinalizeSnippet({
                props: { snippet: { seo: true } },
                element: {},
            });
        }).toThrow(/Unable to get title for snippet flags/);

        // Multiple flags without title
        expect(() => {
            testFinalizeSnippet({
                props: { snippet: { quick: true, search: true, seo: true } },
                element: {},
            });
        }).toThrow(/Unable to get title for snippet flags/);
    });

    it('should respect explicit SEO disable from element', () => {
        // Element has seo: false, prop enables quick - snippet created without SEO
        expect(
            testFinalizeSnippet({
                props: { snippet: { title: 'Title', quick: true } },
                element: { snippet: { seo: false } },
            }),
        ).toEqual({
            title: 'Title',
            quick: true,
        });

        // Prop has seo: false, element enables search - snippet created without SEO
        expect(
            testFinalizeSnippet({
                props: { snippet: { title: 'Title', seo: false } },
                element: { snippet: { search: true } },
            }),
        ).toEqual({
            title: 'Title',
            search: true,
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
                            snippet={{ title: 'P-Snippet', quick: true }}
                        >
                            Paragraph with{' '}
                            <B snippet={{ title: 'Bold', quick: true }}>
                                manual
                            </B>
                            snippet title
                        </P>
                        <P snippet={{ search: true }} toc="Toc Title">
                            Paragraph with snippet title taken from toc title
                        </P>
                    </>
                ),
            });

            expect(snippets).toHaveLength(3);
            expect(snippets).toEqual<ResolvedSnippet[]>([
                {
                    schemaName: 'emphasis',
                    snippetData: {
                        quick: true,
                        seo: true,
                        title: 'Bold',
                    },
                    isUnique: false,
                    elementId: proseElement.children![2].children![1].id!,
                },
                {
                    schemaName: 'paragraph',
                    snippetData: {
                        quick: true,
                        seo: true,
                        title: 'P-Snippet',
                    },
                    isUnique: true,
                    elementId: proseElement.children![2].id!,
                },
                {
                    schemaName: 'paragraph',
                    snippetData: {
                        search: true,
                        seo: true,
                        title: 'Toc Title',
                    },
                    isUnique: false,
                    elementId: proseElement.children![3].id!,
                },
            ]);
        });
    });

    it('should collect snippets with custom flag configurations', async () => {
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
                            snippet={{
                                title: 'Advanced Search',
                                search: {
                                    title: 'Search Title',
                                    synonyms: ['lookup', 'find', 'query'],
                                },
                            }}
                        >
                            Search Heading
                        </H1>
                        <P
                            snippet={{
                                title: 'Paragraph with synonyms',
                                description: 'Test description',
                                search: { synonyms: ['alternative', 'alias'] },
                                seo: true,
                            }}
                        >
                            Some content here with{' '}
                            <B
                                snippet={{
                                    title: 'Bold Text',
                                    quick: {
                                        title: 'Quick Title',
                                        description: 'Quick Desc',
                                    },
                                }}
                            >
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
                    isUnique: false,
                    elementId: proseElement.children![0].id!,
                    snippetData: {
                        search: {
                            title: 'Search Title',
                            synonyms: ['lookup', 'find', 'query'],
                        },
                        title: 'Advanced Search',
                        seo: true,
                    },
                },
                {
                    schemaName: 'emphasis',
                    isUnique: false,
                    elementId: proseElement.children![1].children![1].id!,
                    snippetData: {
                        title: 'Bold Text',
                        quick: {
                            title: 'Quick Title',
                            description: 'Quick Desc',
                        },
                        seo: true,
                    },
                },
                {
                    schemaName: 'paragraph',
                    isUnique: false,
                    elementId: proseElement.children![1].id!,
                    snippetData: {
                        search: { synonyms: ['alternative', 'alias'] },
                        seo: true,
                        title: 'Paragraph with synonyms',
                        description: 'Test description',
                    },
                },
            ]);
        });
    });
});
